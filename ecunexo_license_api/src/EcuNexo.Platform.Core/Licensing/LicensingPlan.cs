using EcuNexo.Core.Common;
using EcuNexo.Core.Tenancy;

namespace EcuNexo.Platform.Core.Licensing;

public sealed class LicensingPlan
{
    public const int CodeMaxLength = 64;
    public const int DisplayNameMaxLength = 120;

    private LicensingPlan()
    {
        Code = string.Empty;
        DisplayName = string.Empty;
        EnabledModuleCodesDefault = [];
    }

    public string Code { get; private set; }

    public string DisplayName { get; private set; }

    public string? Description { get; private set; }

    public int MaxTenantsDefault { get; private set; }

    public int MaxUsersDefault { get; private set; }

    public int MaxWarehousesDefault { get; private set; }

    public List<string> EnabledModuleCodesDefault { get; private set; }

    /// <summary>
    /// Derechos de uso por defecto para cada módulo incluido en el plan,
    /// con tiers y límites transaccionales que se copian al emitir una licencia.
    /// </summary>
    public IReadOnlyList<ModuleEntitlement>? ModuleEntitlementsDefault { get; private set; }

    public decimal? SuggestedPriceUsdMonthly { get; private set; }

    public bool IsActive { get; private set; }

    public int SortOrder { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UpdatedAt { get; private set; }

    public static Result<LicensingPlan> Create(
        string code,
        string displayName,
        int maxTenantsDefault,
        int maxUsersDefault,
        int maxWarehousesDefault,
        IReadOnlyList<string> enabledModuleCodesDefault,
        IReadOnlyList<ModuleEntitlement>? moduleEntitlementsDefault,
        int sortOrder,
        decimal? suggestedPriceUsdMonthly = null,
        string? description = null)
    {
        if (string.IsNullOrWhiteSpace(code) || code.Length > CodeMaxLength)
        {
            return Result.Failure<LicensingPlan>(
                new Error("plan.code.invalid", "El código del plan no es válido.", ErrorType.Validation));
        }

        if (string.IsNullOrWhiteSpace(displayName) || displayName.Length > DisplayNameMaxLength)
        {
            return Result.Failure<LicensingPlan>(
                new Error("plan.display_name.invalid", "El nombre del plan no es válido.", ErrorType.Validation));
        }

        var modules = NormalizeModules(enabledModuleCodesDefault);
        if (modules.IsFailure)
        {
            return Result.Failure<LicensingPlan>(modules.Error!);
        }

        if (maxTenantsDefault < 1 || maxUsersDefault < 0 || maxWarehousesDefault < 0)
        {
            return Result.Failure<LicensingPlan>(
                new Error("plan.limits.invalid", "Los límites por defecto no son válidos.", ErrorType.Validation));
        }

        var utcNow = DateTimeOffset.UtcNow;
        return new LicensingPlan
        {
            Code = code.Trim().ToLowerInvariant(),
            DisplayName = displayName.Trim(),
            Description = description?.Trim(),
            MaxTenantsDefault = maxTenantsDefault,
            MaxUsersDefault = maxUsersDefault,
            MaxWarehousesDefault = maxWarehousesDefault,
            EnabledModuleCodesDefault = modules.Value!,
            ModuleEntitlementsDefault = moduleEntitlementsDefault,
            SuggestedPriceUsdMonthly = suggestedPriceUsdMonthly,
            IsActive = true,
            SortOrder = sortOrder,
            CreatedAt = utcNow,
        };
    }

    internal static Result<List<string>> NormalizeModules(IReadOnlyList<string> enabledModuleCodes)
    {
        if (enabledModuleCodes.Count == 0)
        {
            return Result.Failure<List<string>>(
                new Error("plan.modules.required", "Debe indicarse al menos un módulo.", ErrorType.Validation));
        }

        var modules = new List<string>(enabledModuleCodes.Count);
        foreach (var m in enabledModuleCodes)
        {
            var t = m.Trim();
            if (t.Length == 0 || !TenantModuleCodes.IsKnown(t))
            {
                return Result.Failure<List<string>>(
                    new Error("plan.module.unknown", $"El módulo «{m}» no es reconocido.", ErrorType.Validation));
            }

            if (!modules.Contains(t, StringComparer.OrdinalIgnoreCase))
            {
                modules.Add(t.ToLowerInvariant());
            }
        }

        if (!modules.Contains(TenantModuleCodes.Identity, StringComparer.OrdinalIgnoreCase))
        {
            modules.Insert(0, TenantModuleCodes.Identity);
        }

        return modules;
    }

    public void Update(
        string? displayName,
        string? description,
        int? maxTenantsDefault,
        int? maxUsersDefault,
        int? maxWarehousesDefault,
        IReadOnlyList<string>? enabledModuleCodesDefault,
        IReadOnlyList<ModuleEntitlement>? moduleEntitlementsDefault,
        decimal? suggestedPriceUsdMonthly,
        int? sortOrder)
    {
        if (displayName is not null)
            DisplayName = displayName.Trim();
        if (description is not null)
            Description = description.Trim().Length > 0 ? description.Trim() : null;
        if (maxTenantsDefault.HasValue)
            MaxTenantsDefault = maxTenantsDefault.Value;
        if (maxUsersDefault.HasValue)
            MaxUsersDefault = maxUsersDefault.Value;
        if (maxWarehousesDefault.HasValue)
            MaxWarehousesDefault = maxWarehousesDefault.Value;
        if (enabledModuleCodesDefault is not null && enabledModuleCodesDefault.Count > 0)
        {
            var normalized = NormalizeModules(enabledModuleCodesDefault);
            if (normalized.IsSuccess)
                EnabledModuleCodesDefault = normalized.Value!;
        }
        if (moduleEntitlementsDefault is not null)
            ModuleEntitlementsDefault = moduleEntitlementsDefault;
        if (suggestedPriceUsdMonthly.HasValue)
            SuggestedPriceUsdMonthly = suggestedPriceUsdMonthly.Value >= 0 ? suggestedPriceUsdMonthly.Value : null;
        if (sortOrder.HasValue)
            SortOrder = sortOrder.Value;

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
