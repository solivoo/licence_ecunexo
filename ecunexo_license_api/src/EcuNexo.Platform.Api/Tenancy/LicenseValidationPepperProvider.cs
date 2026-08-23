using EcuNexo.Platform.Api.Configuration;
using EcuNexo.Platform.Business.Licensing;
using Microsoft.Extensions.Options;

namespace EcuNexo.Platform.Api.Tenancy;

public sealed class LicenseValidationPepperProvider(IOptions<LicenseValidationOptions> options)
    : ILicenseValidationPepperProvider
{
    public string ValidationPepper => options.Value.ValidationPepper;
}
