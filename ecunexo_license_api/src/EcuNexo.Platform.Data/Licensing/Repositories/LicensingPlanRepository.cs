using EcuNexo.Core.Common;
using EcuNexo.Platform.Business.Licensing;
using EcuNexo.Platform.Core.Licensing;
using Microsoft.EntityFrameworkCore;

namespace EcuNexo.Platform.Data.Licensing.Repositories;

public sealed class LicensingPlanRepository : ILicensingPlanRepository
{
    private readonly LicensingDbContext _db;

    public LicensingPlanRepository(LicensingDbContext db) => _db = db;

    public Task<LicensingPlan?> GetByCodeAsync(string planCode, CancellationToken ct)
    {
        var code = planCode.Trim().ToLowerInvariant();
        return _db.Plans.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Code == code && p.IsActive, ct);
    }

    public Task<LicensingPlan?> GetByCodeAnyStatusAsync(string planCode, CancellationToken ct)
    {
        var code = planCode.Trim().ToLowerInvariant();
        return _db.Plans.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Code == code, ct);
    }

    public Task<LicensingPlan?> GetByCodeTrackingAsync(string planCode, CancellationToken ct)
    {
        var code = planCode.Trim().ToLowerInvariant();
        return _db.Plans
            .FirstOrDefaultAsync(p => p.Code == code, ct);
    }

    public Task<IReadOnlyList<LicensingPlan>> ListAsync(CancellationToken ct) =>
        _db.Plans.AsNoTracking()
            .Where(p => p.IsActive)
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.DisplayName)
            .ToListAsync(ct)
            .ContinueWith(t => (IReadOnlyList<LicensingPlan>)t.Result, ct);

    public Task<IReadOnlyList<LicensingPlan>> ListAllAsync(CancellationToken ct) =>
        _db.Plans.AsNoTracking()
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.DisplayName)
            .ToListAsync(ct)
            .ContinueWith(t => (IReadOnlyList<LicensingPlan>)t.Result, ct);

    public async Task AddAsync(LicensingPlan plan, CancellationToken ct)
    {
        await _db.Plans.AddAsync(plan, ct).ConfigureAwait(false);
    }

    public Task<bool> ExistsByCodeAsync(string planCode, CancellationToken ct)
    {
        var code = planCode.Trim().ToLowerInvariant();
        return _db.Plans.AnyAsync(p => p.Code == code, ct);
    }
}
