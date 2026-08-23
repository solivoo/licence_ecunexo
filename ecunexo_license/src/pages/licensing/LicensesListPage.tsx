import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Popup, type PageActionItem } from 'glubox'
import { EcuPageActions } from '@/components/ui/EcuPageActions'
import { GridOptionFilter } from '@/components/ui/GridOptionFilter'
import { ExpandLicenseDialog } from '@/components/licensing/ExpandLicenseDialog'
import { IssueLicenseResultDialog } from '@/components/licensing/IssueLicenseResultDialog'
import { renderSidebarIcon } from '@/config/sidebarIcons'
import { moduleLabels } from '@/constants/tenantModules'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import {
  listLicenses,
  reissueLicense,
  type LicenseListItem,
  type ReissueLicenseResult,
} from '@/lib/platformLicensingApi'
import { readApiError } from '@/lib/readApiError'
import { LicensesGrid } from './LicensesGrid'

const STATUS_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'Active', label: 'Activa' },
  { value: 'Revoked', label: 'Revocada' },
  { value: 'Exhausted', label: 'Agotada' },
] as const

export function LicensesListPage() {
  const theme = useGluComponentTheme()
  const navigate = useNavigate()
  const [rows, setRows] = useState<LicenseListItem[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [errorOpen, setErrorOpen] = useState(false)
  const [expandRow, setExpandRow] = useState<LicenseListItem | null>(null)
  const [expandOpen, setExpandOpen] = useState(false)
  const [reissueBusy, setReissueBusy] = useState(false)
  const [reissued, setReissued] = useState<ReissueLicenseResult | null>(null)
  const [reissuedModules, setReissuedModules] = useState<string[]>([])
  const [resultOpen, setResultOpen] = useState(false)

  const showError = useCallback((message: string) => {
    setLoadError(message)
    setErrorOpen(true)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listLicenses()
      setLoadError(null)
      setErrorOpen(false)
      setRows(data)
    } catch (err) {
      showError(readApiError(err, 'No se pudo cargar licencias emitidas.'))
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    let cancelled = false
    listLicenses()
      .then((data) => {
        if (cancelled) return
        setLoadError(null)
        setErrorOpen(false)
        setRows(data)
      })
      .catch((err) => {
        if (cancelled) return
        showError(readApiError(err, 'No se pudo cargar licencias emitidas.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [showError])

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
        disabled: loading || reissueBusy,
      },
    ],
    [loading, reissueBusy],
  )

  const handleExpand = useCallback((row: LicenseListItem) => {
    setExpandRow(row)
    setExpandOpen(true)
  }, [])

  const handleConfirmExpand = useCallback(
    async (planCode: string, enabledModules: string[]) => {
      if (!expandRow) return

      setReissueBusy(true)
      setLoadError(null)
      setErrorOpen(false)
      try {
        const result = await reissueLicense(expandRow.id, {
          onlineValidationIntervalDays: expandRow.onlineValidationIntervalDays ?? 30,
          planCode,
        })
        setExpandOpen(false)
        setExpandRow(null)
        setReissued(result)
        setReissuedModules(enabledModules)
        setResultOpen(true)
        await load()
      } catch (err) {
        showError(readApiError(err, 'No se pudo ampliar la licencia.'))
      } finally {
        setReissueBusy(false)
      }
    },
    [expandRow, load, showError],
  )

  return (
    <>
      <div className="ecu-page-header">
        <div>
          <h1 className="platform-shell__page-title">Historial de licencias</h1>
          <p className="platform-shell__page-lead">
            Licencias emitidas. Ampliar revoca la anterior y genera un código y archivo con el plan elegido.
          </p>
        </div>
        <div className="ecu-page-header__actions">
          <Button
            type="button"
            variant="primary"
            theme={theme}
            disabled={loading || reissueBusy}
            onClick={() => void navigate('/app/licencias/nueva')}
          >
            Emitir licencia
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

      {loadError && !errorOpen ? (
        <p className="platform-shell__alert platform-shell__alert--error" role="alert">
          {loadError}
        </p>
      ) : null}

      <Popup
        open={errorOpen}
        onClose={() => {
          setErrorOpen(false)
          setLoadError(null)
        }}
        title="Error de licencias"
        width="min(92vw, 28rem)"
        theme={theme}
        actions={[
          {
            id: 'close',
            label: 'Entendido',
            variant: 'primary',
            onClick: () => {
              setErrorOpen(false)
              setLoadError(null)
            },
          },
        ]}
      >
        <p className="issue-license-error-popup">{loadError ?? 'Ocurrió un error.'}</p>
      </Popup>

      <LicensesGrid
        rows={visibleRows}
        loading={loading}
        onExpand={handleExpand}
        toolbarRight={
          <GridOptionFilter
            id="licenses-status"
            ariaLabel="Estado de licencia"
            value={statusFilter}
            options={STATUS_FILTERS}
            disabled={loading}
            onChange={setStatusFilter}
          />
        }
      />

      <ExpandLicenseDialog
        open={expandOpen}
        license={expandRow}
        busy={reissueBusy}
        onClose={() => {
          if (reissueBusy) return
          setExpandOpen(false)
          setExpandRow(null)
        }}
        onConfirm={(planCode, enabledModules) => void handleConfirmExpand(planCode, enabledModules)}
      />

      {reissued ? (
        <IssueLicenseResultDialog
          issued={{
            licenseId: reissued.licenseId,
            activationCodePlaintext: reissued.activationCodePlaintext,
            licenseArtifact: reissued.licenseArtifact,
            expiresAtUtc: reissued.expiresAtUtc,
            provisioningSlotsRemaining: reissued.provisioningSlotsRemaining,
            planLabel: reissued.planLabel,
          }}
          enabledModules={reissuedModules}
          modulesLabel={moduleLabels(reissuedModules) || 'Ver plan emitido'}
          supersedesGrantId={reissued.supersedesGrantId}
          generation={reissued.generation}
          reissueKind={reissued.reissueKind}
          previousPlanLabel={reissued.previousPlanLabel}
          open={resultOpen}
          onClose={() => {
            setResultOpen(false)
            setReissued(null)
            setReissuedModules([])
          }}
        />
      ) : null}
    </>
  )
}
