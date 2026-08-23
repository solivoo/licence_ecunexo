using EcuNexo.Platform.Business.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace EcuNexo.Platform.Api.Security;

internal sealed class PasswordMarker;

public sealed class EcuPasswordHasher : IPasswordHasher
{
    private readonly PasswordHasher<PasswordMarker> _hasher = new();

    public string Hash(string plainPassword)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(plainPassword);
        return _hasher.HashPassword(new PasswordMarker(), plainPassword);
    }

    public bool Verify(string plainPassword, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            return false;
        }

        var result = _hasher.VerifyHashedPassword(new PasswordMarker(), passwordHash, plainPassword);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
