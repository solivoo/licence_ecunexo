using EcuNexo.Platform.Business.Licensing.Commands.CreateOperator;

namespace EcuNexo.Platform.Api.Contracts.V1;

public sealed record CreateOperatorRequest(string Email, string Name, string Password, short Role)
{
    public CreateOperatorCommand ToCommand(Guid requestedById, string requestedByRole) =>
        new(Email, Name, Password, Role, requestedById, requestedByRole);
}
