namespace EcuNexo.Platform.Business.Abstractions;

public interface ILicensingUnitOfWork
{
    Task SaveChangesAsync(CancellationToken ct);

    /// <summary>
    /// Ejecuta el trabajo en una transacción de BD. Si falla, revierte todos los
    /// <see cref="SaveChangesAsync"/> intermedios.
    /// </summary>
    Task ExecuteInTransactionAsync(Func<CancellationToken, Task> action, CancellationToken ct);
}
