import { useParams } from 'react-router-dom'

export function RoadmapPlaceholderPage() {
  const { section = 'módulo' } = useParams<{ section: string }>()

  return (
    <>
      <h1 className="platform-shell__page-title">Próximamente</h1>
      <p className="platform-shell__page-lead">
        La sección <strong>{section}</strong> está planificada. El menú lateral ya reserva el espacio
        para cuando exista el endpoint en <code>ecunexo_platform_api</code>.
      </p>
      <div className="platform-shell__card">
        <p style={{ margin: 0, color: 'var(--shell-muted)' }}>
          Patrón recomendado: añadir ruta en <code>platformNav.ts</code>, página en{' '}
          <code>src/pages/</code> y handler CQRS en la API platform.
        </p>
      </div>
    </>
  )
}
