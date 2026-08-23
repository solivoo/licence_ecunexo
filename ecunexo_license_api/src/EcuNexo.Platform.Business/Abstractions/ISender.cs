using EcuNexo.Core.Common;

namespace EcuNexo.Platform.Business.Abstractions;

public interface ISender
{
    Task<Result<TResponse>> SendAsync<TCommand, TResponse>(TCommand command, CancellationToken ct)
        where TCommand : ICommand<TResponse>;

    Task<Result<TResponse>> AskAsync<TQuery, TResponse>(TQuery query, CancellationToken ct)
        where TQuery : IQuery<TResponse>;
}
