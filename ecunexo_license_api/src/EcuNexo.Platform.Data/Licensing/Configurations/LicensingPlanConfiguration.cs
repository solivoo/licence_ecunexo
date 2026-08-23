using EcuNexo.Platform.Core.Licensing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcuNexo.Platform.Data.Licensing.Configurations;

public sealed class LicensingPlanConfiguration : IEntityTypeConfiguration<LicensingPlan>
{
    public void Configure(EntityTypeBuilder<LicensingPlan> builder)
    {
        builder.ToTable("plans");

        builder.HasKey(x => x.Code);

        builder.Property(x => x.Code).HasMaxLength(LicensingPlan.CodeMaxLength).IsRequired();
        builder.Property(x => x.DisplayName).HasMaxLength(LicensingPlan.DisplayNameMaxLength).IsRequired();
        builder.Property(x => x.EnabledModuleCodesDefault).HasColumnType("jsonb").IsRequired();

        builder.Property(x => x.ModuleEntitlementsDefault)
            .HasColumnName("module_entitlements_default")
            .HasColumnType("jsonb");

        builder.Property(x => x.SuggestedPriceUsdMonthly).HasColumnType("numeric(10,2)");
        builder.Property(x => x.CreatedAt).HasColumnType("timestamptz").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnType("timestamptz");
    }
}
