namespace EcuNexo.Platform.Core.Licensing;

/// <summary>
/// Motivo de un grant que reemplaza a otro. La emisión original deja el campo en null.
/// </summary>
public enum LicenseReissueKind : short
{
    Renew = 0,
    Expand = 1,
}
