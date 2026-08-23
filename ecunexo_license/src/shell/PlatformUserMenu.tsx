import { useCallback, useEffect, useRef, useState } from 'react'

export type PlatformUserMenuProps = {
  readonly onLogout: () => void
}

export function PlatformUserMenu({ onLogout }: PlatformUserMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  const handleLogout = useCallback(() => {
    close()
    onLogout()
  }, [close, onLogout])

  useEffect(() => {
    if (!open) {
      return undefined
    }
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  return (
    <div className="platform-shell__user-menu" ref={rootRef}>
      <button
        type="button"
        className="platform-shell__icon-btn platform-shell__user-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menú de cuenta"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="material-symbols-outlined" aria-hidden>
          account_circle
        </span>
      </button>
      {open ? (
        <div className="platform-shell__user-menu-panel" role="menu">
          <button type="button" className="platform-shell__user-menu-item" role="menuitem" onClick={handleLogout}>
            <span className="material-symbols-outlined" aria-hidden>
              logout
            </span>
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  )
}
