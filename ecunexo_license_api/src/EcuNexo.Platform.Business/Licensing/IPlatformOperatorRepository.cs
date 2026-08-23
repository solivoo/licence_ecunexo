using EcuNexo.Platform.Core.Licensing;

namespace EcuNexo.Platform.Business.Licensing;

public interface IPlatformOperatorRepository
{
    Task<PlatformOperator?> GetActiveByEmailForUpdateAsync(string email, CancellationToken ct);

    Task<bool> ExistsByEmailAsync(string email, CancellationToken ct);

    Task<IReadOnlyList<OperatorListRow>> ListAsync(CancellationToken ct);

    Task AddAsync(PlatformOperator op, CancellationToken ct);
}

public sealed record OperatorListRow(
    Guid Id,
    string Email,
    string Name,
    PlatformOperatorRole Role,
    bool IsActive,
    DateTimeOffset? LastLoginAt,
    DateTimeOffset CreatedAt);
