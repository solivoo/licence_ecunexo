using EcuNexo.Platform.Business.Licensing;
using EcuNexo.Platform.Core.Licensing;
using Microsoft.EntityFrameworkCore;

namespace EcuNexo.Platform.Data.Licensing.Repositories;

public sealed class PlatformOperatorRepository : IPlatformOperatorRepository
{
    private readonly LicensingDbContext _db;

    public PlatformOperatorRepository(LicensingDbContext db) => _db = db;

    public Task<PlatformOperator?> GetActiveByEmailForUpdateAsync(string email, CancellationToken ct)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return _db.Operators
            .FirstOrDefaultAsync(o => o.Email == normalized && o.IsActive, ct);
    }

    public Task<bool> ExistsByEmailAsync(string email, CancellationToken ct)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return _db.Operators.AnyAsync(o => o.Email == normalized, ct);
    }

    public async Task<IReadOnlyList<OperatorListRow>> ListAsync(CancellationToken ct)
    {
        return await _db.Operators.AsNoTracking()
            .OrderBy(o => o.Name)
            .Select(o => new OperatorListRow(
                o.Id,
                o.Email,
                o.Name,
                o.Role,
                o.IsActive,
                o.LastLoginAt,
                o.CreatedAt))
            .ToListAsync(ct)
            .ConfigureAwait(false);
    }

    public Task AddAsync(PlatformOperator op, CancellationToken ct)
    {
        _db.Operators.Add(op);
        return Task.CompletedTask;
    }
}
