using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EcuNexo.Platform.Business.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace EcuNexo.Platform.Api.Security;

public sealed class PlatformJwtAccessTokenFactory : IPlatformJwtAccessTokenFactory
{
    private readonly PlatformJwtOptions _options;

    public PlatformJwtAccessTokenFactory(IOptions<PlatformJwtOptions> options) => _options = options.Value;

    public JwtAccessToken Create(Guid operatorId, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, operatorId.ToString("D")),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("D")),
            new(PlatformJwtClaimTypes.OperatorId, operatorId.ToString("D")),
            new(PlatformJwtClaimTypes.OperatorRole, role),
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return new JwtAccessToken(tokenString, new DateTimeOffset(token.ValidTo.ToUniversalTime()));
    }
}
