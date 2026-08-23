using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace EcuNexo.Platform.Api.Security;

public static class PlatformJwtServiceCollectionExtensions
{
    public static IServiceCollection AddPlatformJwt(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<PlatformJwtOptions>()
            .Bind(configuration.GetSection(PlatformJwtOptions.SectionName))
            .Validate(j => !string.IsNullOrWhiteSpace(j.Issuer), "Jwt:Issuer es obligatorio.")
            .Validate(j => !string.IsNullOrWhiteSpace(j.Audience), "Jwt:Audience es obligatorio.")
            .Validate(
                j => j.SigningKey is { Length: >= 32 },
                "Jwt:SigningKey debe tener al menos 32 caracteres.")
            .ValidateOnStart();

        var jwt = configuration.GetSection(PlatformJwtOptions.SectionName).Get<PlatformJwtOptions>()
            ?? throw new InvalidOperationException("Jwt no configurado.");

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                };
            });

        services.AddAuthorization();
        return services;
    }
}
