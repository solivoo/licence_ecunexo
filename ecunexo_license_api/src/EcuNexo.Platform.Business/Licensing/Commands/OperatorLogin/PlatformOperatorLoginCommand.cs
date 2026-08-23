using EcuNexo.Platform.Business.Abstractions;

namespace EcuNexo.Platform.Business.Licensing.Commands.OperatorLogin;

public sealed record PlatformOperatorLoginCommand(string Email, string Password)
    : ICommand<PlatformOperatorLoginResponse>;

public sealed record PlatformOperatorLoginResponse(
    string AccessToken,
    DateTimeOffset ExpiresAt,
    Guid OperatorId,
    string Role);
