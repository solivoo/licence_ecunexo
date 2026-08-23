using EcuNexo.Platform.Business.Abstractions;
using EcuNexo.Core.Licensing;
using EcuNexo.Platform.Core.Licensing;

namespace EcuNexo.Platform.Business.Licensing.Commands.ReissueLicense;

public sealed record ReissueLicenseCommand(
    Guid GrantId,
    Guid IssuedByOperatorId,
    int? ValidityDays = null,
    int? OnlineValidationIntervalDays = null,
    string? PlanCode = null) : ICommand<ReissueLicenseResponse>;

public sealed record ReissueLicenseResponse(
    Guid LicenseId,
    Guid SupersedesGrantId,
    string ActivationCodePlaintext,
    string LicenseArtifact,
    DateTimeOffset ExpiresAtUtc,
    int ProvisioningSlotsRemaining,
    string PlanLabel,
    int OnlineValidationIntervalDays,
    int Generation,
    string ReissueKind,
    string? PreviousPlanLabel);
