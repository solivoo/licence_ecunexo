using EcuNexo.Core.Tenancy;
using FluentValidation;

namespace EcuNexo.Platform.Business.Licensing.Commands.IssueLicense;

public sealed class IssueLicenseValidator : AbstractValidator<IssueLicenseCommand>
{
    public IssueLicenseValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.PlanCode).NotEmpty().MaximumLength(64);
        RuleFor(x => x.IssuedByOperatorId).NotEmpty();
        RuleFor(x => x.Provisioning.OwnerEmail)
            .NotEmpty().WithMessage("El correo del titular es obligatorio.")
            .EmailAddress().WithMessage("El correo del titular no es una dirección válida.");
        RuleFor(x => x.Provisioning.OwnerName)
            .NotEmpty().WithMessage("El nombre del titular es obligatorio.")
            .MaximumLength(200).WithMessage("El nombre del titular no puede superar 200 caracteres.");
        RuleFor(x => x.Provisioning.OwnerPassword)
            .NotEmpty().WithMessage("La contraseña del titular es obligatoria.")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.");
        RuleFor(x => x.ValidityDays).GreaterThan(0).When(x => x.ValidityDays.HasValue);

        RuleFor(x => x.EnabledModuleCodesOverride)
            .Must(modules =>
            {
                if (modules is null || modules.Count == 0) return true; // se validará contra el plan
                var errors = ModuleDependencyGraph.Validate(modules);
                return errors.Count == 0;
            })
            .WithMessage(command =>
            {
                if (command.EnabledModuleCodesOverride is null) return string.Empty;
                var errors = ModuleDependencyGraph.Validate(command.EnabledModuleCodesOverride);
                return string.Join(" ", errors);
            });

        RuleFor(x => x)
            .Must(command =>
            {
                if (command.ModuleEntitlementsOverride is null || command.ModuleEntitlementsOverride.Count == 0)
                {
                    return true;
                }

                var errors = ModuleDependencyGraph.ValidateTierConsistency(command.ModuleEntitlementsOverride);
                return errors.Count == 0;
            })
            .WithMessage(command =>
            {
                if (command.ModuleEntitlementsOverride is null) return string.Empty;
                var errors = ModuleDependencyGraph.ValidateTierConsistency(command.ModuleEntitlementsOverride);
                return string.Join(" ", errors);
            });
    }
}
