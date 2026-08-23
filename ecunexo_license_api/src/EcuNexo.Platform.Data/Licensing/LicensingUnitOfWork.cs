using EcuNexo.Platform.Business.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace EcuNexo.Platform.Data.Licensing;

public sealed class LicensingUnitOfWork : ILicensingUnitOfWork
{
    private readonly LicensingDbContext _db;

    public LicensingUnitOfWork(LicensingDbContext db) => _db = db;

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);

    public async Task ExecuteInTransactionAsync(Func<CancellationToken, Task> action, CancellationToken ct)
    {
        await using var tx = await _db.Database.BeginTransactionAsync(ct).ConfigureAwait(false);
        try
        {
            await action(ct).ConfigureAwait(false);
            await tx.CommitAsync(ct).ConfigureAwait(false);
        }
        catch
        {
            await tx.RollbackAsync(ct).ConfigureAwait(false);
            throw;
        }
    }
}
