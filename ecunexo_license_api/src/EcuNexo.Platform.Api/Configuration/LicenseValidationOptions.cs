namespace EcuNexo.Platform.Api.Configuration;

public sealed class LicenseValidationOptions
{
    public const string SectionName = "LicenseValidation";

    public string ValidationPepper { get; init; } = string.Empty;
}
