using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace EcuNexo.Platform.Data.Licensing;

public sealed class LicensingDbContextFactory : IDesignTimeDbContextFactory<LicensingDbContext>
{
    public LicensingDbContext CreateDbContext(string[] args)
    {
        var connection = Environment.GetEnvironmentVariable("ECUNEXO_LICENSING_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=licensing_ecunexo;Username=postgres;Password=root";

        var options = new DbContextOptionsBuilder<LicensingDbContext>()
            .UseNpgsql(connection, npg => npg.ConfigureDataSource(ds => ds.EnableDynamicJson()).MigrationsHistoryTable("__ef_migrations_history", "licensing"))
            .UseSnakeCaseNamingConvention()
            .Options;

        return new LicensingDbContext(options);
    }
}
