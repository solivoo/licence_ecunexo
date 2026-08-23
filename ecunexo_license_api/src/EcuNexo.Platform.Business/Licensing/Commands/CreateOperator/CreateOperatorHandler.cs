using EcuNexo.Platform.Business.Abstractions;
using EcuNexo.Core.Abstractions;
using EcuNexo.Core.Common;
using EcuNexo.Platform.Core.Licensing;
using FluentValidation;

namespace EcuNexo.Platform.Business.Licensing.Commands.CreateOperator;

public sealed class CreateOperatorHandler : ICommandHandler<CreateOperatorCommand, CreateOperatorResponse>
{
    private readonly IValidator<CreateOperatorCommand> _validator;
    private readonly IPlatformOperatorRepository _operators;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IIdGenerator _idGenerator;
    private readonly ILicensingUnitOfWork _unitOfWork;

    public CreateOperatorHandler(
        IValidator<CreateOperatorCommand> validator,
        IPlatformOperatorRepository operators,
        IPasswordHasher passwordHasher,
        IIdGenerator idGenerator,
        ILicensingUnitOfWork unitOfWork)
    {
        _validator = validator;
        _operators = operators;
        _passwordHasher = passwordHasher;
        _idGenerator = idGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<CreateOperatorResponse>> Handle(CreateOperatorCommand command, CancellationToken ct)
    {
        var validation = await _validator.ValidateAsync(command, ct).ConfigureAwait(false);
        if (!validation.IsValid)
        {
            var message = string.Join(' ', validation.Errors.Select(e => e.ErrorMessage));
            return Result.Failure<CreateOperatorResponse>(
                new Error("operator.create.validation", message, ErrorType.Validation));
        }

        if (!CanManageOperators(command.RequestedByRole))
        {
            return Result.Failure<CreateOperatorResponse>(
                new Error("operator.create.forbidden", "No tienes permiso para crear operadores.", ErrorType.Forbidden));
        }

        if (!Enum.IsDefined(typeof(PlatformOperatorRole), command.Role))
        {
            return Result.Failure<CreateOperatorResponse>(
                new Error("operator.role.invalid", "Rol no válido.", ErrorType.Validation));
        }

        var role = (PlatformOperatorRole)command.Role;
        if (command.RequestedByRole != nameof(PlatformOperatorRole.SuperAdmin) && role >= PlatformOperatorRole.Admin)
        {
            return Result.Failure<CreateOperatorResponse>(
                new Error("operator.role.forbidden", "Solo SuperAdmin puede crear Admin o SuperAdmin.", ErrorType.Forbidden));
        }

        var exists = await _operators.ExistsByEmailAsync(command.Email, ct).ConfigureAwait(false);
        if (exists)
        {
            return Result.Failure<CreateOperatorResponse>(
                new Error("operator.email.duplicate", "Ya existe un operador con ese correo.", ErrorType.Conflict));
        }

        var hash = _passwordHasher.Hash(command.Password);
        var created = PlatformOperator.Create(
            _idGenerator.NewId(),
            command.Email,
            command.Name,
            hash,
            role);

        if (!created.IsSuccess)
        {
            return Result.Failure<CreateOperatorResponse>(created.Error!);
        }

        await _operators.AddAsync(created.Value!, ct).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(ct).ConfigureAwait(false);

        var op = created.Value!;
        return Result.Success(new CreateOperatorResponse(op.Id, op.Email, op.Name, op.Role.ToString()));
    }

    private static bool CanManageOperators(string role) =>
        role is nameof(PlatformOperatorRole.SuperAdmin) or nameof(PlatformOperatorRole.Admin);
}
