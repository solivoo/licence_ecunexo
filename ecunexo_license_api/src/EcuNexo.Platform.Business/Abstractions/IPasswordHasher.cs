namespace EcuNexo.Platform.Business.Abstractions;

public interface IPasswordHasher
{
    string Hash(string plainPassword);

    bool Verify(string plainPassword, string passwordHash);
}
