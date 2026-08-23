import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, type PageActionItem } from 'glubox'
import { EcuPageActions } from '@/components/ui/EcuPageActions'
import { EcuAlertDialog } from '@/components/ui/EcuAlertDialog'
import { GridDateRangeBox } from '@/components/ui/GridDateRangeBox'
import { GridOptionFilter } from '@/components/ui/GridOptionFilter'
import { renderSidebarIcon } from '@/config/sidebarIcons'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import { DEFAULT_GRID_LOOKBACK, rangeFromLookback, toIsoDate } from '@/lib/gridLookback'
import {
  cancelTraining,
  completeTraining,
  getTrainingCalendarInvite,
  listTrainingSessions,
  type TrainingSessionItem,
} from '@/lib/platformLicensingApi'
import { readApiError } from '@/lib/readApiError'
import { TrainingSessionsGrid } from './TrainingSessionsGrid'

const STATUS_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'Scheduled', label: 'Agendada' },
  { value: 'Completed', label: 'Completada' },
  { value: 'Cancelled', label: 'Cancelada' },
] as const

function sessionDate(iso: string): string {
  return toIsoDate(new Date(iso))
}

export function TrainingSessionsListPage() {
  const theme = useGluComponentTheme()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<TrainingSessionItem[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [range, setRange] = useState(() => rangeFromLookback(DEFAULT_GRID_LOOKBACK))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorOpen, setErrorOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listTrainingSessions()
      setSessions(data)
      setError(null)
    } catch (err: unknown) {
      setError(readApiError(err, 'No se pudieron cargar las capacitaciones.'))
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    listTrainingSessions()
      .then((data) => {
        if (cancelled) return
        setSessions(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(readApiError(err, 'No se pudieron cargar las capacitaciones.'))
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
    return sessions.filter((session) => {
      if (statusFilter !== 'all' && session.status !== statusFilter) return false
      const day = sessionDate(session.scheduledAt)
      return day >= range.from && day <= range.to
    })
  }, [range.from, range.to, sessions, statusFilter])

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

  const handleComplete = async (id: string) => {
    try {
      await completeTraining(id)
      await load()
    } catch (err: unknown) {
      setError(readApiError(err, 'Error al completar.'))
      setErrorOpen(true)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelTraining(id)
      await load()
    } catch (err: unknown) {
      setError(readApiError(err, 'Error al cancelar.'))
      setErrorOpen(true)
    }
  }

  const handleDownloadCalendar = async (id: string) => {
    try {
      const invite = await getTrainingCalendarInvite(id)
      const blob = new Blob([invite.icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = invite.fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      setError(readApiError(err, 'Error al generar invitación.'))
      setErrorOpen(true)
    }
  }

  return (
    <>
      <div className="ecu-page-header">
        <div>
          <h1 className="platform-shell__page-title">Capacitaciones</h1>
          <p className="platform-shell__page-lead">
            Gestión de sesiones de capacitación para clientes EcuNexo.
          </p>
        </div>
        <div className="ecu-page-header__actions">
          <Button
            type="button"
            variant="primary"
            theme={theme}
            onClick={() => navigate('/app/capacitaciones/nueva')}
          >
            Agendar
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

      <TrainingSessionsGrid
        rows={visibleRows}
        loading={loading}
        onComplete={(id) => void handleComplete(id)}
        onCancel={(id) => void handleCancel(id)}
        onDownloadCalendar={(id) => void handleDownloadCalendar(id)}
        toolbarRight={
          <div className="ecu-grid-toolbar">
            <GridDateRangeBox from={range.from} to={range.to} disabled={loading} onChange={setRange} />
            <GridOptionFilter
              id="training-status"
              ariaLabel="Estado de la sesión"
              value={statusFilter}
              options={STATUS_FILTERS}
              disabled={loading}
              onChange={setStatusFilter}
            />
          </div>
        }
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
