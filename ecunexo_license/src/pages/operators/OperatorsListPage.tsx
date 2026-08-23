import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, type PageActionItem } from 'glubox'
import { EcuPageActions } from '@/components/ui/EcuPageActions'
import { GridOptionFilter } from '@/components/ui/GridOptionFilter'
import { renderSidebarIcon } from '@/config/sidebarIcons'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import {
  createOperator,
  listOperators,
  type CreateOperatorInput,
  type OperatorListItem,
} from '@/lib/platformLicensingApi'
import { readApiError } from '@/lib/readApiError'
import { useAppSelector } from '@/store/hooks'
import { selectCanManageOperators, selectOperatorRole } from '@/store/platformAuthSlice'
import { CreateOperatorDialog } from './CreateOperatorDialog'
import { OperatorsGrid } from './OperatorsGrid'

const STATUS_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
] as const

export function OperatorsListPage() {
  const theme = useGluComponentTheme()
  const navigate = useNavigate()
  const canManage = useAppSelector(selectCanManageOperators)
  const managerRole = useAppSelector(selectOperatorRole)
  const [rows, setRows] = useState<OperatorListItem[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [createBusy, setCreateBusy] = useState(false)

  const load = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading) setLoading(true)
    try {
      const data = await listOperators()
      setLoadError(null)
      setRows(data)
    } catch (err) {
      setLoadError(readApiError(err, 'No se pudo cargar operadores.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const data = await listOperators()
        if (cancelled) return
        setLoadError(null)
        setRows(data)
      } catch (err) {
        if (cancelled) return
        setLoadError(readApiError(err, 'No se pudo cargar operadores.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const visibleRows = useMemo(() => {
    if (statusFilter === 'active') return rows.filter((row) => row.isActive)
    if (statusFilter === 'inactive') return rows.filter((row) => !row.isActive)
    return rows
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

  const handleCreate = useCallback(
    async (body: CreateOperatorInput) => {
      setCreateBusy(true)
      setSuccessMessage(null)
      try {
        await createOperator(body)
        setSuccessMessage(`Operador ${body.email} creado correctamente.`)
        await load({ showLoading: true })
      } catch (err: unknown) {
        setLoadError(readApiError(err, 'No se pudo crear el operador.'))
      } finally {
        setCreateBusy(false)
      }
    },
    [load],
  )

  if (!canManage) {
    return <Navigate to="/app/inicio" replace />
  }

  return (
    <>
      <div className="ecu-page-header">
        <div>
          <h1 className="platform-shell__page-title">Operadores</h1>
          <p className="platform-shell__page-lead">
            Usuarios autorizados para emitir licencias en la plataforma corporativa EcuNexo.
          </p>
        </div>
        <div className="ecu-page-header__actions">
          <Button type="button" variant="primary" theme={theme} onClick={() => setDialogOpen(true)}>
            Nuevo operador
          </Button>
          <EcuPageActions
            items={actionItems}
            variant="outline"
            triggerLabel="Acciones"
            renderIcon={renderSidebarIcon}
            onNavigate={(route: string) => navigate(route)}
            onActionSelect={(item) => {
              if (item.id === 'refresh') void load({ showLoading: true })
            }}
          />
        </div>
      </div>

      {successMessage ? (
        <p className="platform-shell__alert platform-shell__alert--success" role="status">
          {successMessage}
        </p>
      ) : null}

      {loadError ? (
        <p className="platform-shell__alert platform-shell__alert--error" role="alert">
          {loadError}
        </p>
      ) : null}

      <OperatorsGrid
        rows={visibleRows}
        loading={loading}
        toolbarRight={
          <GridOptionFilter
            id="operators-status"
            ariaLabel="Estado del operador"
            value={statusFilter}
            options={STATUS_FILTERS}
            disabled={loading}
            onChange={setStatusFilter}
          />
        }
      />

      <CreateOperatorDialog
        open={dialogOpen}
        busy={createBusy}
        managerRole={managerRole}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </>
  )
}
