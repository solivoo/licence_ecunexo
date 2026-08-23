using EcuNexo.Core.Common;

namespace EcuNexo.Platform.Core.Licensing;

public sealed class PlatformOperator : AggregateRoot<Guid>
{
    public const int EmailMaxLength = 320;
    public const int NameMaxLength = 200;
    public const int PasswordHashMaxLength = 500;

    private PlatformOperator()
    {
        Email = string.Empty;
        Name = string.Empty;
        PasswordHash = string.Empty;
    }

    public string Email { get; private set; }

    public string Name { get; private set; }

    public string PasswordHash { get; private set; }

    public PlatformOperatorRole Role { get; private set; }

    public bool IsActive { get; private set; }

    public DateTimeOffset? LastLoginAt { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UpdatedAt { get; private set; }

    public static Result<PlatformOperator> Create(
        Guid id,
        string email,
        string name,
        string passwordHash,
        PlatformOperatorRole role)
    {
        if (id == Guid.Empty)
        {
            return Result.Failure<PlatformOperator>(
                new Error("operator.id.invalid", "El identificador no es válido.", ErrorType.Validation));
        }

        if (string.IsNullOrWhiteSpace(email) || email.Length > EmailMaxLength)
        {
            return Result.Failure<PlatformOperator>(
                new Error("operator.email.invalid", "El correo no es válido.", ErrorType.Validation));
        }

        if (string.IsNullOrWhiteSpace(name) || name.Length > NameMaxLength)
        {
            return Result.Failure<PlatformOperator>(
                new Error("operator.name.invalid", "El nombre no es válido.", ErrorType.Validation));
        }

        if (string.IsNullOrWhiteSpace(passwordHash) || passwordHash.Length > PasswordHashMaxLength)
        {
            return Result.Failure<PlatformOperator>(
                new Error("operator.password.invalid", "El hash de contraseña no es válido.", ErrorType.Validation));
        }

        return new PlatformOperator
        {
            Id = id,
            Email = email.Trim().ToLowerInvariant(),
            Name = name.Trim(),
            PasswordHash = passwordHash,
            Role = role,
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public void TouchLastLogin(DateTimeOffset utcNow)
    {
        LastLoginAt = utcNow;
        UpdatedAt = utcNow;
    }
}
