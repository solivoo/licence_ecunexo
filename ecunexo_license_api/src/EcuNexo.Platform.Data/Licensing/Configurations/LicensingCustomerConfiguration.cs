using EcuNexo.Platform.Core.Licensing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcuNexo.Platform.Data.Licensing.Configurations;

public sealed class LicensingCustomerConfiguration : IEntityTypeConfiguration<LicensingCustomer>
{
    public void Configure(EntityTypeBuilder<LicensingCustomer> builder)
    {
        builder.ToTable("customers");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnType("uuid").ValueGeneratedNever();
        builder.Property(x => x.LegalName).HasMaxLength(LicensingCustomer.LegalNameMaxLength).IsRequired();
        builder.Property(x => x.TradeName).HasMaxLength(LicensingCustomer.TradeNameMaxLength);
        builder.Property(x => x.TaxId).HasMaxLength(LicensingCustomer.TaxIdMaxLength);
        builder.Property(x => x.CountryCode).HasMaxLength(LicensingCustomer.CountryCodeLength).IsRequired();
        builder.Property(x => x.ContactName).HasMaxLength(LicensingCustomer.ContactNameMaxLength);
        builder.Property(x => x.ContactEmail).HasMaxLength(LicensingCustomer.ContactEmailMaxLength);
        builder.Property(x => x.ContactPhone).HasMaxLength(LicensingCustomer.ContactPhoneMaxLength);
        builder.Property(x => x.DeploymentMode).HasColumnType("smallint").IsRequired();
        builder.Property(x => x.Status).HasColumnType("smallint").IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnType("timestamptz").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnType("timestamptz");
        builder.Property(x => x.CreatedBy).HasColumnType("uuid");
        builder.Property(x => x.UpdatedBy).HasColumnType("uuid");

        builder.HasIndex(x => x.TaxId)
            .IsUnique()
            .HasFilter("tax_id IS NOT NULL");

        builder.Property<uint>("xmin").IsRowVersion().HasColumnName("xmin");
    }
}
