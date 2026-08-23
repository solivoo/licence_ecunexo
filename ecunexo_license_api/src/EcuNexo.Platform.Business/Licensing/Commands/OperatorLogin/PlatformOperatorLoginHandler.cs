using EcuNexo.Platform.Business.Abstractions;
using EcuNexo.Core.Common;
using FluentValidation;

namespace EcuNexo.Platform.Business.Licensing.Commands.OperatorLogin;

public sealed class PlatformOperatorLoginHandler
    : ICommandHandler<PlatformOperatorLoginCommand, PlatformOperatorLoginResponse>
{
    private readonly IValidator<PlatformOperatorLoginCommand> _validator;
    private readonly IPlatformOperatorRepository _operators;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IPlatformJwtAccessTokenFactory _tokens;
    private readonly ILicensingUnitOfWork _unitOfWork;

    public PlatformOperatorLoginHandler(
        IValidator<PlatformOperatorLoginCommand> validator,
        IPlatformOperatorRepository operators,
        IPasswordHasher passwordHasher,
        IPlatformJwtAccessTokenFactory tokens,
        ILicensingUnitOfWork unitOfWork)
    {
        _validator = validator;
        _operators = operators;
        _passwordHasher = passwordHasher;
        _tokens = tokens;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<PlatformOperatorLoginResponse>> Handle(
        PlatformOperatorLoginCommand command,
        CancellationToken ct)
    {
        var validation = await _validator.ValidateAsync(command, ct).ConfigureAwait(false);
        if (!validation.IsValid)
        {
            var message = string.Join(' ', validation.Errors.Select(e => e.ErrorMessage));
            return Result.Failure<PlatformOperatorLoginResponse>(
                new Error("platform.login.validation", message, ErrorType.Validation));
        }

        var op = await _operators.GetActiveByEmailForUpdateAsync(command.Email, ct).ConfigureAwait(false);
        if (op is null || !_passwordHasher.Verify(command.Password, op.PasswordHash))
        {
            return Result.Failure<PlatformOperatorLoginResponse>(
                new Error("platform.login.failed", "Credenciales inválidas.", ErrorType.Unauthorized));
        }

        op.TouchLastLogin(DateTimeOffset.UtcNow);
        await _unitOfWork.SaveChangesAsync(ct).ConfigureAwait(false);

        var jwt = _tokens.Create(op.Id, op.Role.ToString());
        return Result.Success(new PlatformOperatorLoginResponse(
            jwt.Token,
            jwt.ExpiresAt,
            op.Id,
            op.Role.ToString()));
    }
}
