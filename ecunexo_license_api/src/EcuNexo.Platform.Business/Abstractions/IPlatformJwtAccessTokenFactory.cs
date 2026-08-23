namespace EcuNexo.Platform.Business.Abstractions;

public interface IPlatformJwtAccessTokenFactory
{
    JwtAccessToken Create(Guid operatorId, string role);
}

public sealed record JwtAccessToken(string Token, DateTimeOffset ExpiresAt);
