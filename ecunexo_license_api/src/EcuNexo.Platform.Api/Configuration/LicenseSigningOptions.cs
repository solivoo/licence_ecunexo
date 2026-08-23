namespace EcuNexo.Platform.Api.Configuration;

public sealed class LicenseSigningOptions
{
    public const string SectionName = "LicenseSigning";

    public string PrivateKeyPem { get; init; } = string.Empty;

    public string? PrivateKeyPath { get; init; }
}
