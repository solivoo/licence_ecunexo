namespace EcuNexo.Platform.Api.Configuration;

public sealed class ActivationCodeOptions
{
    public const string SectionName = "ActivationCodes";

    /// <summary>Pepper de emisión: solo platform / CEO. Nunca en despliegue tenant.</summary>
    public string IssuePepper { get; init; } = string.Empty;

    /// <summary>Compatibilidad: si <see cref="IssuePepper"/> está vacío, se usa <see cref="Pepper"/>.</summary>
    public string Pepper { get; init; } = string.Empty;

    public string ResolveIssuePepper() =>
        string.IsNullOrWhiteSpace(IssuePepper) ? Pepper : IssuePepper;
}
