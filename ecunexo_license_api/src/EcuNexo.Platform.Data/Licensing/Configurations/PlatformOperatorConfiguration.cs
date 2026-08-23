using EcuNexo.Platform.Core.Licensing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcuNexo.Platform.Data.Licensing.Configurations;

public sealed class PlatformOperatorConfiguration : IEntityTypeConfiguration<PlatformOperator>
{
    public void Configure(EntityTypeBuilder<PlatformOperator> builder)
    {
        builder.ToTable("operators");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnType("uuid").ValueGeneratedNever();
        builder.Property(x => x.Email).HasMaxLength(PlatformOperator.EmailMaxLength).IsRequired();
        builder.HasIndex(x => x.Email).IsUnique();
        builder.Property(x => x.Name).HasMaxLength(PlatformOperator.NameMaxLength).IsRequired();
        builder.Property(x => x.PasswordHash).HasMaxLength(PlatformOperator.PasswordHashMaxLength).IsRequired();
        builder.Property(x => x.Role).HasColumnType("smallint").IsRequired();
        builder.Property(x => x.LastLoginAt).HasColumnType("timestamptz");
        builder.Property(x => x.CreatedAt).HasColumnType("timestamptz").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnType("timestamptz");

        builder.Property<uint>("xmin").IsRowVersion().HasColumnName("xmin");
    }
}
