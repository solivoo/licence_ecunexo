using EcuNexo.Platform.Business.Abstractions;

namespace EcuNexo.Platform.Business.Licensing.Commands.CreateOperator;

public sealed record CreateOperatorCommand(
    string Email,
    string Name,
    string Password,
    short Role,
    Guid RequestedByOperatorId,
    string RequestedByRole)
    : ICommand<CreateOperatorResponse>;

public sealed record CreateOperatorResponse(Guid OperatorId, string Email, string Name, string Role);
