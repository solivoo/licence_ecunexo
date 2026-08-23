using EcuNexo.Platform.Business.Licensing.Commands.ReissueLicense;
using EcuNexo.Core.Licensing;
using FluentValidation;

namespace EcuNexo.Platform.Business.Licensing.Commands.ReissueLicense;

public sealed class ReissueLicenseValidator : AbstractValidator<ReissueLicenseCommand>
{
    public ReissueLicenseValidator()
    {
        RuleFor(x => x.GrantId).NotEmpty();
        RuleFor(x => x.IssuedByOperatorId).NotEmpty();
        RuleFor(x => x.ValidityDays).GreaterThan(0).When(x => x.ValidityDays.HasValue);
        RuleFor(x => x.OnlineValidationIntervalDays)
            .InclusiveBetween(LicenseValidationPolicy.MinIntervalDays, LicenseValidationPolicy.MaxIntervalDays)
            .When(x => x.OnlineValidationIntervalDays.HasValue);
        RuleFor(x => x.PlanCode)
            .MaximumLength(64)
            .When(x => !string.IsNullOrWhiteSpace(x.PlanCode));
    }
}
