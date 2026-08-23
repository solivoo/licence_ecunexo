using System.Security.Cryptography;

namespace EcuNexo.Platform.Core.Tenancy;

/// <summary>Genera códigos de activación legibles (sin caracteres ambiguos O/0, I/1).</summary>
public static class ActivationCodeGenerator
{
    private const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public static string Generate(int segmentLength = 4, int segmentCount = 8)
    {
        if (segmentLength < 2 || segmentCount < 2)
        {
            throw new ArgumentOutOfRangeException(nameof(segmentLength));
        }

        Span<char> buffer = stackalloc char[segmentLength];
        var parts = new string[segmentCount];
        for (var s = 0; s < segmentCount; s++)
        {
            for (var i = 0; i < segmentLength; i++)
            {
                buffer[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
            }

            parts[s] = new string(buffer);
        }

        return "ECU-" + string.Join('-', parts);
    }
}
