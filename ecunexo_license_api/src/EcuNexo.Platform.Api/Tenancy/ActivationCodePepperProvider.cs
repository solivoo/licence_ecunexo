using EcuNexo.Platform.Api.Configuration;
using EcuNexo.Platform.Business.Tenancy;
using Microsoft.Extensions.Options;

namespace EcuNexo.Platform.Api.Tenancy;

public sealed class ActivationCodePepperProvider(IOptions<ActivationCodeOptions> options) : IActivationCodePepperProvider
{
    public string Pepper => options.Value.ResolveIssuePepper();
}
