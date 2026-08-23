import { useCallback, useEffect, useState } from 'react'
import { Button } from 'glubox'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import { TENANT_MODULE_OPTIONS } from '@/constants/tenantModules'

const CORE_MODULE_CODES = ['identity', 'catalog', 'warehousing', 'inventory'] as const
const ALL_MODULE_CODES = TENANT_MODULE_OPTIONS.map((m) => m.code)

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((v, i) => v === sortedB[i])
}

export type ModulePresetChipsProps = {
  readonly selectedModules: string[]
  readonly onApply: (codes: string[]) => void
}

export function ModulePresetChips({ selectedModules, onApply }: ModulePresetChipsProps) {
  const theme = useGluComponentTheme()
  const [activePreset, setActivePreset] = useState<'core' | 'all' | null>(null)

  useEffect(() => {
    if (sameSet(selectedModules, CORE_MODULE_CODES)) {
      setActivePreset('core')
    } else if (sameSet(selectedModules, ALL_MODULE_CODES)) {
      setActivePreset('all')
    } else {
      setActivePreset(null)
    }
  }, [selectedModules])

  const applyCore = useCallback(() => {
    setActivePreset('core')
    onApply([...CORE_MODULE_CODES])
  }, [onApply])

  const applyAll = useCallback(() => {
    setActivePreset('all')
    onApply([...ALL_MODULE_CODES])
  }, [onApply])

  return (
    <div className="ecu-module-preset-actions">
      <Button
        type="button"
        variant={activePreset === 'core' ? 'primary' : 'outline'}
        theme={theme}
        size="sm"
        onClick={applyCore}
      >
        Paquete operativo
      </Button>
      <Button
        type="button"
        variant={activePreset === 'all' ? 'primary' : 'outline'}
        theme={theme}
        size="sm"
        onClick={applyAll}
      >
        Todos
      </Button>
    </div>
  )
}
