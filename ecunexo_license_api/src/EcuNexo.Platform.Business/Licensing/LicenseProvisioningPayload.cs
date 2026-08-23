namespace EcuNexo.Platform.Business.Licensing;

/// <summary>
/// Titular de licencia cifrado en <c>license_grants.provisioning_payload_encrypted</c>.
/// Sin datos de empresa tenant: eso lo provisiona el titular en <c>ecunexo_api</c>.
/// </summary>
public sealed record LicenseProvisioningPayload(
    string OwnerEmail,
    string OwnerName,
    string OwnerPassword,
    string? OwnerDepartment = null,
    string? OwnerPhone = null,
    string? OwnerJobTitle = null);
