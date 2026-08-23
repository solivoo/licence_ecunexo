using EcuNexo.Platform.Business.Licensing.Commands.ReissueLicense;

namespace EcuNexo.Platform.Api.Contracts.V1;

public sealed record ReissueLicenseRequest(
    int? ValidityDays = null,
    int? OnlineValidationIntervalDays = null,
    string? PlanCode = null)
{
    public ReissueLicenseCommand ToCommand(Guid grantId, Guid operatorId) =>
        new(grantId, operatorId, ValidityDays, OnlineValidationIntervalDays, PlanCode);
}
