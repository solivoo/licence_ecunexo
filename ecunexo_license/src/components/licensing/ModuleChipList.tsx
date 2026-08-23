import { useCallback } from 'react'
import { Check } from 'lucide-react'
import {
  ensureIdentityModule,
  getDependants,
  getRequiredModules,
  OPTIONAL_LICENSE_MODULE_OPTIONS,
  REQUIRED_LICENSE_MODULE_CODE,
  TENANT_MODULE_OPTIONS,
} from '@/constants/tenantModules'

export type ModuleChipListProps = {
  readonly selected: string[]
  readonly onChange: (codes: string[]) => void
}

const identityOption = TENANT_MODULE_OPTIONS.find((m) => m.code === REQUIRED_LICENSE_MODULE_CODE)

export function ModuleChipList({ selected, onChange }: ModuleChipListProps) {
  const selectedSet = new Set(selected.map((c) => c.toLowerCase()))

  const toggleModule = useCallback(
    (code: string, checked: boolean) => {
      const base = selected.filter((c) => c !== REQUIRED_LICENSE_MODULE_CODE)
      if (checked) {
        // Al activar, auto-seleccionar todas las dependencias
        const toAdd = new Set<string>([code])
        const stack = [code]
        while (stack.length > 0) {
          const current = stack.pop()!
          for (const req of getRequiredModules(current)) {
            if (!toAdd.has(req)) {
              toAdd.add(req)
              stack.push(req)
            }
          }
        }
        const merged = new Set([...base, ...toAdd])
        onChange(ensureIdentityModule([...merged]))
        return
      }
      // Al desactivar, auto-desactivar dependientes
      const toRemove = new Set<string>([code])
      const stack = [code]
      while (stack.length > 0) {
        const current = stack.pop()!
        for (const dep of getDependants(current)) {
          if (!toRemove.has(dep)) {
            toRemove.add(dep)
            stack.push(dep)
          }
        }
      }
      onChange(ensureIdentityModule(base.filter((c) => !toRemove.has(c))))
    },
    [selected, onChange]
  )

  return (
    <>
      {identityOption ? (
        <p className="ecu-module-included" aria-label="Módulo incluido">
          <Check size={16} strokeWidth={2} aria-hidden />
          <span>
            <strong>{identityOption.label}</strong> — incluido en todas las licencias (
            {identityOption.description.toLowerCase()}).
          </span>
        </p>
      ) : null}

      <ul className="ecu-module-checkbox-list">
        {OPTIONAL_LICENSE_MODULE_OPTIONS.map((module) => {
          const checked = selectedSet.has(module.code)
          const inputId = `issue-license-module-${module.code}`
          const required = getRequiredModules(module.code)
          const dependants = getDependants(module.code).filter((d) => selectedSet.has(d))

          return (
            <li key={module.code}>
              <label className="ecu-module-checkbox" htmlFor={inputId}>
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => toggleModule(module.code, event.target.checked)}
                />
                <span className="ecu-module-checkbox__content">
                  <span className="ecu-module-checkbox__label">
                    {module.label}
                    {required.length > 0 ? (
                      <span className="ecu-module-deps-hint">
                        {' '}requiere{' '}
                        {required
                          .map((r) => TENANT_MODULE_OPTIONS.find((m) => m.code === r)?.label ?? r)
                          .join(', ')}
                      </span>
                    ) : null}
                  </span>
                  <span className="ecu-module-checkbox__hint">
                    {module.description}
                    {dependants.length > 0 ? (
                      <span className="ecu-module-deps-used">
                        {' '}— usado por{' '}
                        {dependants
                          .map((d) => TENANT_MODULE_OPTIONS.find((m) => m.code === d)?.label ?? d)
                          .join(', ')}
                      </span>
                    ) : null}
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </>
  )
}
