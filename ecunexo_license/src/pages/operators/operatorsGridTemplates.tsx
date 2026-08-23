import { Check, User, X } from 'lucide-react'
import { formatOperatorRole } from '@/constants/operatorRoles'
import { formatDateTime } from '@/lib/formatDate'
import type { OperatorListItem } from '@/lib/platformLicensingApi'
import {
  operatorAvatarHue,
  operatorInitials,
  operatorRoleTone,
} from './operatorGridUtils'

type OperatorGridRow = OperatorListItem

export function OperatorPersonCell(props: OperatorGridRow) {
  const seed = props.email || props.name
  const hue = operatorAvatarHue(seed)
  const initials = operatorInitials(props.name)

  return (
    <div className="ecu-op-grid__person">
      <span
        className="ecu-op-grid__avatar"
        style={{
          background: `hsl(${hue} 48% 32%)`,
          color: `hsl(${hue} 90% 92%)`,
        }}
        aria-hidden
      >
        {initials}
      </span>
      <span className="ecu-op-grid__person-text">
        <span className="ecu-op-grid__person-name">{props.name}</span>
        <span className="ecu-op-grid__person-email">{props.email}</span>
      </span>
    </div>
  )
}

export function OperatorRoleCell(props: OperatorGridRow) {
  const tone = operatorRoleTone(props.role)
  return (
    <span className={`ecu-op-grid__badge ecu-op-grid__badge--role ecu-op-grid__badge--${tone}`}>
      <User size={12} strokeWidth={2} aria-hidden />
      {formatOperatorRole(props.role)}
    </span>
  )
}

export function OperatorStatusCell(props: OperatorGridRow) {
  if (props.isActive) {
    return (
      <span className="ecu-op-grid__badge ecu-op-grid__badge--active">
        <Check size={12} strokeWidth={2} aria-hidden />
        Activo
      </span>
    )
  }
  return (
    <span className="ecu-op-grid__badge ecu-op-grid__badge--inactive">
      <X size={12} strokeWidth={2} aria-hidden />
      Inactivo
    </span>
  )
}

export function OperatorLastLoginCell(props: OperatorGridRow) {
  return <span className="ecu-op-grid__date">{formatDateTime(props.lastLoginAt)}</span>
}

export function OperatorCreatedCell(props: OperatorGridRow) {
  return <span className="ecu-op-grid__date">{formatDateTime(props.createdAt)}</span>
}
