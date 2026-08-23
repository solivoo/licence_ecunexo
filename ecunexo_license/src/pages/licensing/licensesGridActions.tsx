import { ArrowUpCircle } from 'lucide-react'
import { GridIconButton } from '@/components/ui/GridIconButton'
import type { LicenseListItem } from '@/lib/platformLicensingApi'

export function LicenseActionsCell(
  props: LicenseListItem & { onExpand?: (row: LicenseListItem) => void },
) {
  const canExpand = props.status === 'Active' || props.status === 'Exhausted'

  if (!canExpand || !props.onExpand) {
    return null
  }

  return (
    <div className="ecu-licenses-grid__actions">
      <GridIconButton
        label="Ampliar licencia"
        icon={ArrowUpCircle}
        onClick={() => props.onExpand?.(props)}
      />
    </div>
  )
}
