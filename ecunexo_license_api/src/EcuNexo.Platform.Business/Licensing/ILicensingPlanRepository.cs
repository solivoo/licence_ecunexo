using EcuNexo.Core.Common;
using EcuNexo.Platform.Core.Licensing;

namespace EcuNexo.Platform.Business.Licensing;

public interface ILicensingPlanRepository
{
    Task<LicensingPlan?> GetByCodeAsync(string planCode, CancellationToken ct);

    /// <summary>Obtiene plan sin filtrar por IsActive (útil para admin).</summary>
    Task<LicensingPlan?> GetByCodeAnyStatusAsync(string planCode, CancellationToken ct);

    /// <summary>Obtiene plan con tracking para updates.</summary>
    Task<LicensingPlan?> GetByCodeTrackingAsync(string planCode, CancellationToken ct);

    /// <summary>Lista solo planes activos ordenados por SortOrder.</summary>
    Task<IReadOnlyList<LicensingPlan>> ListAsync(CancellationToken ct);

    /// <summary>Lista todos los planes (activos e inactivos).</summary>
    Task<IReadOnlyList<LicensingPlan>> ListAllAsync(CancellationToken ct);

    Task AddAsync(LicensingPlan plan, CancellationToken ct);

    Task<bool> ExistsByCodeAsync(string planCode, CancellationToken ct);
}
