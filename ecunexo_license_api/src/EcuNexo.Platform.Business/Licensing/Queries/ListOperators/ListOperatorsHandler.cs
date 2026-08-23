using EcuNexo.Platform.Business.Abstractions;
using EcuNexo.Core.Common;

namespace EcuNexo.Platform.Business.Licensing.Queries.ListOperators;

public sealed class ListOperatorsHandler : IQueryHandler<ListOperatorsQuery, ListOperatorsResponse>
{
    private readonly IPlatformOperatorRepository _operators;

    public ListOperatorsHandler(IPlatformOperatorRepository operators) => _operators = operators;

    public async Task<Result<ListOperatorsResponse>> Handle(ListOperatorsQuery query, CancellationToken ct)
    {
        var rows = await _operators.ListAsync(ct).ConfigureAwait(false);
        var items = rows.Select(o => new OperatorListItem(
            o.Id,
            o.Email,
            o.Name,
            o.Role.ToString(),
            o.IsActive,
            o.LastLoginAt,
            o.CreatedAt)).ToList();

        return Result.Success(new ListOperatorsResponse(items));
    }
}
