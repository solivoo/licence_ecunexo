using EcuNexo.Platform.Business.Abstractions;

namespace EcuNexo.Platform.Business.Licensing.Queries.ListOperators;

public sealed record ListOperatorsQuery : IQuery<ListOperatorsResponse>;

public sealed record ListOperatorsResponse(IReadOnlyList<OperatorListItem> Items);

public sealed record OperatorListItem(
    Guid Id,
    string Email,
    string Name,
    string Role,
    bool IsActive,
    DateTimeOffset? LastLoginAt,
    DateTimeOffset CreatedAt);
