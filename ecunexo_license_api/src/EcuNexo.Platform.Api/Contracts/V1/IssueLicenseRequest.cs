using EcuNexo.Platform.Business.Licensing;
using EcuNexo.Platform.Business.Licensing.Commands.IssueLicense;
using EcuNexo.Core.Tenancy;
using EcuNexo.Platform.Core.Licensing;

namespace EcuNexo.Platform.Api.Contracts.V1;

public sealed record IssueLicenseRequest(
    Guid CustomerId,
    string PlanCode,
    LicensingDeploymentMode DeploymentMode,
    LicenseProvisioningPayload Provisioning,
    int? ValidityDays = null,
    int? MaxTenantsOverride = null,
    int? MaxUsersOverride = null,
    int? MaxWarehousesOverride = null,
    IReadOnlyList<string>? EnabledModuleCodesOverride = null,
    IReadOnlyList<ModuleEntitlement>? ModuleEntitlementsOverride = null,
    int? OnlineValidationIntervalDays = null,
    string? Notes = null,
    DateTimeOffset? TrainingPeriodFromUtc = null,
    DateTimeOffset? TrainingPeriodToUtc = null,
    DateTimeOffset? SupportPeriodFromUtc = null,
    DateTimeOffset? SupportPeriodToUtc = null,
    bool AllowAdditionalLicense = false)
{
    public IssueLicenseCommand ToCommand(Guid operatorId) =>
        new(
            CustomerId,
            PlanCode,
            DeploymentMode,
            operatorId,
            Provisioning,
            ValidityDays,
            MaxTenantsOverride,
            MaxUsersOverride,
            MaxWarehousesOverride,
            EnabledModuleCodesOverride,
            ModuleEntitlementsOverride,
            OnlineValidationIntervalDays,
            Notes,
            TrainingPeriodFromUtc,
            TrainingPeriodToUtc,
            SupportPeriodFromUtc,
            SupportPeriodToUtc,
            AllowAdditionalLicense);
}
