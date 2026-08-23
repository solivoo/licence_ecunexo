using EcuNexo.Core.Abstractions;
using EcuNexo.Core.Common;

namespace EcuNexo.Platform.Core.Licensing;

public sealed class LicensingCustomer : AggregateRoot<Guid>, IAuditable
{
    public const int LegalNameMaxLength = 200;
    public const int TradeNameMaxLength = 200;
    public const int TaxIdMaxLength = 20;
    public const int ContactNameMaxLength = 200;
    public const int ContactEmailMaxLength = 320;
    public const int ContactPhoneMaxLength = 40;
    public const int CountryCodeLength = 2;

    private LicensingCustomer()
    {
        LegalName = string.Empty;
        CountryCode = "EC";
    }

    public string LegalName { get; private set; }

    public string? TradeName { get; private set; }

    public string? TaxId { get; private set; }

    public string CountryCode { get; private set; }

    public string? ContactName { get; private set; }

    public string? ContactEmail { get; private set; }

    public string? ContactPhone { get; private set; }

    public LicensingDeploymentMode DeploymentMode { get; private set; }

    public string? Notes { get; private set; }

    public LicensingCustomerStatus Status { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UpdatedAt { get; private set; }

    public Guid? CreatedBy { get; private set; }

    public Guid? UpdatedBy { get; private set; }

    public static Result<LicensingCustomer> Create(
        Guid id,
        string legalName,
        LicensingDeploymentMode deploymentMode,
        string countryCode = "EC",
        string? tradeName = null,
        string? taxId = null,
        string? contactName = null,
        string? contactEmail = null,
        string? contactPhone = null,
        string? notes = null,
        Guid? createdBy = null)
    {
        if (id == Guid.Empty)
        {
            return Result.Failure<LicensingCustomer>(
                new Error("customer.id.invalid", "El identificador no es válido.", ErrorType.Validation));
        }

        if (string.IsNullOrWhiteSpace(legalName) || legalName.Length > LegalNameMaxLength)
        {
            return Result.Failure<LicensingCustomer>(
                new Error("customer.legal_name.invalid", "La razón social no es válida.", ErrorType.Validation));
        }

        var cc = (countryCode ?? "EC").Trim().ToUpperInvariant();
        if (cc.Length != CountryCodeLength)
        {
            return Result.Failure<LicensingCustomer>(
                new Error("customer.country.invalid", "El código de país debe tener 2 caracteres.", ErrorType.Validation));
        }

        var utcNow = DateTimeOffset.UtcNow;
        return new LicensingCustomer
        {
            Id = id,
            LegalName = legalName.Trim(),
            TradeName = TrimOrNull(tradeName, TradeNameMaxLength),
            TaxId = TrimOrNull(taxId, TaxIdMaxLength),
            CountryCode = cc,
            ContactName = TrimOrNull(contactName, ContactNameMaxLength),
            ContactEmail = TrimOrNull(contactEmail, ContactEmailMaxLength),
            ContactPhone = TrimOrNull(contactPhone, ContactPhoneMaxLength),
            DeploymentMode = deploymentMode,
            Notes = notes?.Trim(),
            Status = LicensingCustomerStatus.Active,
            CreatedAt = utcNow,
            CreatedBy = createdBy,
        };
    }

    public Result Update(
        string legalName,
        LicensingDeploymentMode deploymentMode,
        string countryCode,
        string? tradeName,
        string? taxId,
        string? contactName,
        string? contactEmail,
        string? contactPhone,
        string? notes,
        Guid updatedBy)
    {
        if (string.IsNullOrWhiteSpace(legalName) || legalName.Length > LegalNameMaxLength)
        {
            return Result.Failure(
                new Error("customer.legal_name.invalid", "La razón social no es válida.", ErrorType.Validation));
        }

        var cc = (countryCode ?? "EC").Trim().ToUpperInvariant();
        if (cc.Length != CountryCodeLength)
        {
            return Result.Failure(
                new Error("customer.country.invalid", "El código de país debe tener 2 caracteres.", ErrorType.Validation));
        }

        LegalName = legalName.Trim();
        TradeName = TrimOrNull(tradeName, TradeNameMaxLength);
        TaxId = TrimOrNull(taxId, TaxIdMaxLength);
        CountryCode = cc;
        ContactName = TrimOrNull(contactName, ContactNameMaxLength);
        ContactEmail = TrimOrNull(contactEmail, ContactEmailMaxLength);
        ContactPhone = TrimOrNull(contactPhone, ContactPhoneMaxLength);
        DeploymentMode = deploymentMode;
        Notes = notes?.Trim();
        UpdatedAt = DateTimeOffset.UtcNow;
        UpdatedBy = updatedBy;
        return Result.Success();
    }

    public Result Suspend(Guid updatedBy)
    {
        if (Status == LicensingCustomerStatus.Suspended)
        {
            return Result.Failure(
                new Error(
                    "customer.already_suspended",
                    "El cliente ya está suspendido.",
                    ErrorType.Conflict));
        }

        Status = LicensingCustomerStatus.Suspended;
        UpdatedAt = DateTimeOffset.UtcNow;
        UpdatedBy = updatedBy;
        return Result.Success();
    }

    private static string? TrimOrNull(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var t = value.Trim();
        return t.Length > maxLength ? null : t;
    }
}
