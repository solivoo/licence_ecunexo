using FluentValidation;

namespace EcuNexo.Platform.Business.Licensing.Commands.OperatorLogin;

public sealed class PlatformOperatorLoginValidator : AbstractValidator<PlatformOperatorLoginCommand>
{
    public PlatformOperatorLoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}
