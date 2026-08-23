import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, KeyRound, Layers, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'glubox'
import { useGluComponentTheme } from '@/hooks/useGluComponentTheme'
import { listPlans, listLicenses, type PlanListItem } from '@/lib/platformLicensingApi'
import { readApiError } from '@/lib/readApiError'
import { useAppSelector } from '@/store/hooks'
import { selectCanManageOperators, selectOperatorRole } from '@/store/platformAuthSlice'

export function DashboardHomePage() {
  const theme = useGluComponentTheme()
  const navigate = useNavigate()
  const role = useAppSelector(selectOperatorRole)
  const canManageOperators = useAppSelector(selectCanManageOperators)

  const [metrics, setMetrics] = useState({ activePlans: 0, totalLicenses: 0, activeLicenses: 0 })
  const [recentPlans, setRecentPlans] = useState<PlanListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadMetrics = useCallback(async () => {
    try {
      const [plans, licenses] = await Promise.all([listPlans(), listLicenses()])
      setMetrics({
        activePlans: plans.filter((p) => p.isActive).length,
        totalLicenses: licenses.length,
        activeLicenses: licenses.filter((l) => l.status === 'Active').length,
      })
      setRecentPlans(plans.slice(0, 3))
    } catch (err: unknown) {
      setLoadError(readApiError(err, 'Error al cargar métricas. ¿API en 5090?'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMetrics()
  }, [loadMetrics])

  return (
    <>
      <div className="ecu-page-header">
        <div>
          <h1 className="platform-shell__page-title">Inicio</h1>
          <p className="platform-shell__page-lead">
            Panel de operaciones EcuNexo · Rol: <strong>{role ?? '—'}</strong>
          </p>
        </div>
      </div>

      {loadError ? (
        <p className="platform-shell__alert platform-shell__alert--error" role="alert">
          {loadError}
        </p>
      ) : null}

      <div className="ecu-stats-grid">
        <div className="ecu-stat-card">
          <Layers className="ecu-stat-card__icon" size={22} strokeWidth={1.75} aria-hidden />
          <div>
            <span className="ecu-stat-card__value">{loading ? '—' : metrics.activePlans}</span>
            <span className="ecu-stat-card__label">Planes activos</span>
          </div>
        </div>
        <div className="ecu-stat-card">
          <KeyRound className="ecu-stat-card__icon" size={22} strokeWidth={1.75} aria-hidden />
          <div>
            <span className="ecu-stat-card__value">{loading ? '—' : metrics.totalLicenses}</span>
            <span className="ecu-stat-card__label">Licencias emitidas</span>
          </div>
        </div>
        <div className="ecu-stat-card">
          <CheckCircle2 className="ecu-stat-card__icon" size={22} strokeWidth={1.75} aria-hidden />
          <div>
            <span className="ecu-stat-card__value">{loading ? '—' : metrics.activeLicenses}</span>
            <span className="ecu-stat-card__label">Licencias activas</span>
          </div>
        </div>
      </div>

      <div className="ecu-dashboard-sections">
        <div className="platform-shell__card ecu-dashboard-card">
          <h2 className="ecu-dashboard-card__title">
            <Zap size={20} strokeWidth={1.75} aria-hidden /> Accesos rápidos
          </h2>
          <div className="ecu-dashboard-actions">
            <Button type="button" variant="primary" theme={theme} onClick={() => navigate('/app/licencias/nueva')}>
              Emitir licencia
            </Button>
            <Button type="button" variant="outline" theme={theme} onClick={() => navigate('/app/planes')}>
              Catálogo de planes
            </Button>
            <Button type="button" variant="outline" theme={theme} onClick={() => navigate('/app/licencias/historial')}>
              Historial
            </Button>
            <Button type="button" variant="outline" theme={theme} onClick={() => navigate('/app/clientes')}>
              Clientes
            </Button>
            {canManageOperators ? (
              <Button type="button" variant="outline" theme={theme} onClick={() => navigate('/app/operadores')}>
                Operadores
              </Button>
            ) : null}
          </div>
        </div>

        <div className="platform-shell__card ecu-dashboard-card">
          <h2 className="ecu-dashboard-card__title">
            <Layers size={20} strokeWidth={1.75} aria-hidden /> Planes recientes
          </h2>
          {recentPlans.length === 0 ? (
            <p className="login-page__muted">
              No hay planes aún.{' '}
              <button
                type="button"
                className="ecu-link-btn"
                onClick={() => navigate('/app/planes/nuevo')}
              >
                Crear primer plan
              </button>
            </p>
          ) : (
            <div className="ecu-dashboard-plan-list">
              {recentPlans.map((plan) => (
                <div
                  key={plan.code}
                  className="ecu-dashboard-plan-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/app/planes/${encodeURIComponent(plan.code)}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/app/planes/${encodeURIComponent(plan.code)}`)
                    }
                  }}
                >
                  <span className="ecu-dashboard-plan-item__name">{plan.displayName}</span>
                  <span className="ecu-dashboard-plan-item__code">{plan.code}</span>
                  {plan.suggestedPriceUsdMonthly != null ? (
                    <span className="ecu-dashboard-plan-item__price">
                      ${plan.suggestedPriceUsdMonthly.toFixed(2)}/mes
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
