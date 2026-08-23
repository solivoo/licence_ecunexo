namespace EcuNexo.Platform.Business.Licensing;

public interface IProvisioningPayloadProtector
{
    byte[] Encrypt(LicenseProvisioningPayload payload);

    LicenseProvisioningPayload Decrypt(byte[] ciphertext);
}
