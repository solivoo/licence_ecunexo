using EcuNexo.Platform.Business.Abstractions;
using EcuNexo.Core.Common;
using EcuNexo.Platform.Core.Licensing;

namespace EcuNexo.Platform.Business.Licensing.Queries.GetLicenseStatus;

public sealed record GetLicenseStatusQuery(Guid GrantId) : IQuery<LicenseStatusResponse>;

public sealed record LicenseStatusResponse(
    Guid GrantId,
    Guid? SupersedesGrantId,
    string Status,
    DateTimeOffset ExpiresAtUtc,
    bool IsAllowed,
    DateTimeOffset? RevokedAtUtc);

public sealed class GetLicenseStatusHandler : IQueryHandler<GetLicenseStatusQuery, LicenseStatusResponse>
{
    private readonly ILicenseGrantRepository _grants;

    public GetLicenseStatusHandler(ILicenseGrantRepository grants) => _grants = grants;

    public async Task<Result<LicenseStatusResponse>> Handle(GetLicenseStatusQuery query, CancellationToken ct)
    {
        var grant = await _grants.GetByIdAsync(query.GrantId, ct).ConfigureAwait(false);
        if (grant is null)
        {
            return Result.Failure<LicenseStatusResponse>(
                new Error("license.status.not_found", "Licencia no encontrada.", ErrorType.NotFound));
        }

        var utcNow = DateTimeOffset.UtcNow;
        var status = grant.Status.ToString();
        var allowed = grant.Status == LicenseGrantStatus.Active && utcNow < grant.ExpiresAtUtc;

        return Result.Success(new LicenseStatusResponse(
            grant.Id,
            grant.SupersedesGrantId,
            status,
            grant.ExpiresAtUtc,
            allowed,
            grant.RevokedAtUtc));
    }
}
