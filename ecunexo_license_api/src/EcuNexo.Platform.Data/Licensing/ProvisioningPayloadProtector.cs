using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using EcuNexo.Platform.Business.Licensing;
using Microsoft.Extensions.Options;

namespace EcuNexo.Platform.Data.Licensing;

public sealed class LicensingOptions
{
    public const string SectionName = "Licensing";

    public string ProvisioningEncryptionKey { get; init; } = string.Empty;
}

public sealed class ProvisioningPayloadProtector : IProvisioningPayloadProtector
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly byte[] _key;

    public ProvisioningPayloadProtector(IOptions<LicensingOptions> options)
    {
        var raw = options.Value.ProvisioningEncryptionKey;
        if (string.IsNullOrWhiteSpace(raw) || raw.Length < 32)
        {
            throw new InvalidOperationException(
                $"{LicensingOptions.SectionName}:ProvisioningEncryptionKey debe tener al menos 32 caracteres.");
        }

        _key = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
    }

    public byte[] Encrypt(LicenseProvisioningPayload payload)
    {
        var plaintext = JsonSerializer.SerializeToUtf8Bytes(payload, JsonOptions);
        var nonce = RandomNumberGenerator.GetBytes(12);
        var ciphertext = new byte[plaintext.Length];
        var tag = new byte[16];
        using var aes = new AesGcm(_key, 16);
        aes.Encrypt(nonce, plaintext, ciphertext, tag);
        var result = new byte[nonce.Length + tag.Length + ciphertext.Length];
        Buffer.BlockCopy(nonce, 0, result, 0, nonce.Length);
        Buffer.BlockCopy(tag, 0, result, nonce.Length, tag.Length);
        Buffer.BlockCopy(ciphertext, 0, result, nonce.Length + tag.Length, ciphertext.Length);
        return result;
    }

    public LicenseProvisioningPayload Decrypt(byte[] ciphertext)
    {
        if (ciphertext.Length < 12 + 16)
        {
            throw new CryptographicException("Payload cifrado inválido.");
        }

        var nonce = ciphertext.AsSpan(0, 12);
        var tag = ciphertext.AsSpan(12, 16);
        var encrypted = ciphertext.AsSpan(28);
        var plaintext = new byte[encrypted.Length];
        using var aes = new AesGcm(_key, 16);
        aes.Decrypt(nonce, encrypted, tag, plaintext);
        return JsonSerializer.Deserialize<LicenseProvisioningPayload>(plaintext, JsonOptions)
            ?? throw new CryptographicException("No se pudo deserializar el payload.");
    }
}
