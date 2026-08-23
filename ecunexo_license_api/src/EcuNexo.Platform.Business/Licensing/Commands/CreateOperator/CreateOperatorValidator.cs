using FluentValidation;

namespace EcuNexo.Platform.Business.Licensing.Commands.CreateOperator;

public sealed class CreateOperatorValidator : AbstractValidator<CreateOperatorCommand>
{
    public CreateOperatorValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(128);
        RuleFor(x => x.Role).InclusiveBetween((short)0, (short)3);
        RuleFor(x => x.RequestedByOperatorId).NotEmpty();
    }
}
