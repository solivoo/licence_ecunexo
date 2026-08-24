using EcuNexo.Platform.Business.Abstractions;
using EcuNexo.Platform.Core.Licensing;
using EcuNexo.Platform.Data.Licensing;
using Microsoft.EntityFrameworkCore;

namespace EcuNexo.Platform.Api.Development;

/// <summary>
/// Crea el primer SuperAdmin si la BD no tiene operadores (piloto / Portainer).
/// Desactivar con Bootstrap__Enabled=false tras el primer acceso.
/// </summary>
public static class BootstrapOperatorSeeder
{
    public static async Task EnsureAsync(WebApplication app, CancellationToken ct)
    {
        var cfg = app.Configuration.GetSection("Bootstrap");
        if (!cfg.GetValue("Enabled", false))
        {
            return;
        }

        var email = cfg["Email"]?.Trim();
        var password = cfg["Password"];
        var displayName = cfg["DisplayName"]?.Trim();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            app.Logger.LogWarning("Bootstrap operador omitido: Email/Password vacíos.");
            return;
        }

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<LicensingDbContext>();
        if (await db.Operators.AnyAsync(ct).ConfigureAwait(false))
        {
            return;
        }

        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var created = PlatformOperator.Create(
            Guid.CreateVersion7(),
            email,
            string.IsNullOrWhiteSpace(displayName) ? "Administrador" : displayName,
            hasher.Hash(password),
            PlatformOperatorRole.SuperAdmin);
        if (created.IsFailure)
        {
            app.Logger.LogError(
                "Bootstrap operador falló: {Code} {Message}",
                created.Error?.Code,
                created.Error?.Message);
            return;
        }

        db.Operators.Add(created.Value!);
        await db.SaveChangesAsync(ct).ConfigureAwait(false);
        app.Logger.LogInformation("Bootstrap: operador SuperAdmin creado ({Email}).", email);
    }
}
