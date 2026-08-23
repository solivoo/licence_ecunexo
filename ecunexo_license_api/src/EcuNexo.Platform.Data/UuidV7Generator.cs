using EcuNexo.Core.Abstractions;

namespace EcuNexo.Platform.Data;

internal sealed class UuidV7Generator : IIdGenerator
{
    public Guid NewId() => Guid.CreateVersion7();
}
