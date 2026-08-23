import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, type PageActionItem } from 'glubox'
import { EcuPageActions } from '@/components/ui/EcuPageActions'
import { EcuAlertDialog } from '@/components/ui/EcuAlertDialog'
import { GridOptionFilter } from '@/components/ui/GridOptionFilter'
import { renderSidebarIcon } from '@/config/sidebarIcons'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import { deactivatePlan, listPlans, type PlanListItem } from '@/lib/platformLicensingApi'
import { readApiError } from '@/lib/readApiError'
import { PlansGrid } from './PlansGrid'

const STATUS_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
] as const

export function PlanListPage() {
  const theme = useGluComponentTheme()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PlanListItem[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorOpen, setErrorOpen] = useState(false)
  const [deactivating, setDeactivating] = useState<string | null>(null)
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(null)

  const loadPlans = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listPlans(true)
      setPlans(data)
      setError(null)
    } catch (err: unknown) {
      setError(readApiError(err, 'No se pudieron cargar los planes.'))
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    listPlans(true)
      .then((data) => {
        if (cancelled) return
        setPlans(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(readApiError(err, 'No se pudieron cargar los planes.'))
        setErrorOpen(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visibleRows = useMemo(() => {
    if (statusFilter === 'active') return plans.filter((p) => p.isActive)
    if (statusFilter === 'inactive') return plans.filter((p) => !p.isActive)
    return plans
  }, [plans, statusFilter])

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

  const handleDeactivate = useCallback(
    async (code: string) => {
      setDeactivating(code)
      setConfirmDeactivate(null)
      try {
        await deactivatePlan(code)
        await loadPlans()
      } catch (err: unknown) {
        setError(readApiError(err, `No se pudo desactivar «${code}».`))
        setErrorOpen(true)
      } finally {
        setDeactivating(null)
      }
    },
    [loadPlans],
  )

  return (
    <>
      <div className="ecu-page-header">
        <div>
          <h1 className="platform-shell__page-title">Planes y módulos</h1>
          <p className="platform-shell__page-lead">
            Catálogo de planes comerciales. Los planes activos se muestran al emitir licencias.
          </p>
        </div>
        <div className="ecu-page-header__actions">
          <Button
            type="button"
            variant="primary"
            theme={theme}
            onClick={() => navigate('/app/planes/nuevo')}
          >
            Crear plan
          </Button>
          <EcuPageActions
            items={actionItems}
            variant="outline"
            triggerLabel="Acciones"
            renderIcon={renderSidebarIcon}
            onNavigate={(route: string) => navigate(route)}
            onActionSelect={(item) => {
              if (item.id === 'refresh') void loadPlans()
            }}
          />
        </div>
      </div>

      <PlansGrid
        rows={visibleRows}
        loading={loading}
        deactivatingCode={deactivating}
        onEdit={(code) => navigate(`/app/planes/${encodeURIComponent(code)}`)}
        onDeactivate={setConfirmDeactivate}
        toolbarRight={
          <GridOptionFilter
            id="plans-status"
            ariaLabel="Estado del plan"
            value={statusFilter}
            options={STATUS_FILTERS}
            disabled={loading}
            onChange={setStatusFilter}
          />
        }
      />

      <EcuAlertDialog
        open={confirmDeactivate !== null}
        title="Desactivar plan"
        message={`¿Estás seguro de desactivar «${confirmDeactivate}»? Las licencias ya emitidas con este plan seguirán funcionando, pero el plan no aparecerá al crear nuevas licencias.`}
        onClose={() => setConfirmDeactivate(null)}
        onConfirm={() => confirmDeactivate && handleDeactivate(confirmDeactivate)}
        confirmLabel="Desactivar"
      />

      <EcuAlertDialog
        open={errorOpen}
        title="Error"
        message={error ?? 'Error inesperado.'}
        onClose={() => {
          setErrorOpen(false)
          setError(null)
        }}
      />
    </>
  )
}
