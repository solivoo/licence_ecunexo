import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, type PageActionItem } from 'glubox'
import { EcuPageActions } from '@/components/ui/EcuPageActions'
import { EcuAlertDialog } from '@/components/ui/EcuAlertDialog'
import { GridOptionFilter } from '@/components/ui/GridOptionFilter'
import { renderSidebarIcon } from '@/config/sidebarIcons'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import {
  deactivateLicensingCustomer,
  listLicensingCustomers,
  type LicensingCustomerListItem,
} from '@/lib/platformLicensingApi'
import { readApiError } from '@/lib/readApiError'
import { customerDeletePrompt } from './customerDeleteMessage'
import { CustomersGrid } from './CustomersGrid'

const STATUS_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'Active', label: 'Activo' },
  { value: 'Suspended', label: 'Suspendido' },
] as const

export function CustomersListPage() {
  const theme = useGluComponentTheme()
  const navigate = useNavigate()
  const [rows, setRows] = useState<LicensingCustomerListItem[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<LicensingCustomerListItem | null>(null)
  const [actionBusyId, setActionBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorOpen, setErrorOpen] = useState(false)
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listLicensingCustomers()
      setLoadError(null)
      setRows(data)
    } catch (err) {
      setLoadError(readApiError(err, 'No se pudo cargar clientes.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const visibleRows = useMemo(() => {
    if (statusFilter === 'all') return rows
    return rows.filter((row) => row.status === statusFilter)
  }, [rows, statusFilter])

  const actionItems = useMemo(
    (): PageActionItem[] => [
      {
        id: 'refresh',
        label: 'Actualizar',
        icon: 'refresh-cw',
        route: null,
        disabled: loading,
      },
    ],
    [loading],
  )

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return
    setActionBusyId(confirmDelete.id)
    setConfirmDelete(null)
    try {
      await deactivateLicensingCustomer(confirmDelete.id)
      await load()
    } catch (err: unknown) {
      setError(readApiError(err, 'No se pudo eliminar el cliente.'))
      setErrorOpen(true)
    } finally {
      setActionBusyId(null)
    }
  }, [confirmDelete, load])

  const deletePrompt = confirmDelete ? customerDeletePrompt(confirmDelete) : null

  return (
    <>
      <div className="ecu-page-header">
        <div>
          <h1 className="platform-shell__page-title">Clientes</h1>
          <p className="platform-shell__page-lead">
            Directorio comercial. Edita, elimina o genera una licencia desde la fila.
          </p>
        </div>
        <div className="ecu-page-header__actions">
          <Button
            type="button"
            variant="primary"
            theme={theme}
            onClick={() => navigate('/app/clientes/nuevo')}
          >
            Nuevo cliente
          </Button>
          <EcuPageActions
            items={actionItems}
            variant="outline"
            triggerLabel="Acciones"
            renderIcon={renderSidebarIcon}
            onNavigate={(route: string) => navigate(route)}
            onActionSelect={(item) => {
              if (item.id === 'refresh') void load()
            }}
          />
        </div>
      </div>

      {loadError ? (
        <p className="platform-shell__alert platform-shell__alert--error" role="alert">
          {loadError}
        </p>
      ) : null}

      <CustomersGrid
        rows={visibleRows}
        loading={loading}
        actionBusyId={actionBusyId}
        onEdit={(id) => navigate(`/app/clientes/${id}/editar`)}
        onDelete={setConfirmDelete}
        onIssueLicense={(row) =>
          navigate('/app/licencias/nueva', { state: { customer: row } })
        }
        toolbarRight={
          <GridOptionFilter
            id="customers-status"
            ariaLabel="Estado del cliente"
            value={statusFilter}
            options={STATUS_FILTERS}
            disabled={loading}
            onChange={setStatusFilter}
          />
        }
      />

      <EcuAlertDialog
        open={deletePrompt !== null}
        title={deletePrompt?.title ?? 'Eliminar cliente'}
        message={deletePrompt?.message ?? ''}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => void handleDelete()}
        confirmLabel={deletePrompt?.confirmLabel ?? 'Sí, eliminar'}
      />
      <EcuAlertDialog
        open={errorOpen}
        title="No se pudo eliminar"
        message={error ?? 'Error inesperado.'}
        onClose={() => {
          setErrorOpen(false)
          setError(null)
        }}
      />
    </>
  )
}
