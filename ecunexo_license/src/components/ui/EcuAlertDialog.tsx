import { Popup } from 'glubox'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'

export type EcuAlertDialogProps = {
  readonly open: boolean
  readonly title: string
  readonly message: string
  readonly onClose: () => void
  readonly onConfirm?: () => void
  readonly confirmLabel?: string
}

export function EcuAlertDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel,
}: EcuAlertDialogProps) {
  const theme = useGluComponentTheme()

  const actions = onConfirm
    ? [
        { id: 'cancel', label: 'Cancelar', variant: 'ghost' as const, onClick: onClose },
        {
          id: 'confirm',
          label: confirmLabel ?? 'Confirmar',
          variant: 'primary' as const,
          onClick: onConfirm,
        },
      ]
    : [{ id: 'close', label: 'Entendido', variant: 'primary' as const, onClick: onClose }]

  return (
    <Popup
      open={open}
      onClose={onClose}
      title={title}
      width="min(92vw, 32rem)"
      theme={theme}
      actions={actions}
    >
      <p className="ecu-alert-dialog__message issue-license-error-popup" role="alert">
        {message}
      </p>
    </Popup>
  )
}
