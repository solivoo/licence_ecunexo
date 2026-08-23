using EcuNexo.Platform.Business.Licensing.Commands.OperatorLogin;

namespace EcuNexo.Platform.Api.Contracts.V1;

public sealed record PlatformOperatorLoginRequest(string Email, string Password)
{
    public PlatformOperatorLoginCommand ToCommand() => new(Email, Password);
}
