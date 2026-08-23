import { useState, type ReactNode } from 'react'

export interface EcuLabeledInputProps {
  readonly id: string
  readonly name?: string
  readonly label: string
  readonly type?: string
  readonly value: string
  readonly onValueChange: (value: string) => void
  readonly placeholder?: string
  readonly autoComplete?: string
  readonly required?: boolean
  readonly disabled?: boolean
  readonly topSlot?: ReactNode
  readonly hint?: string
  readonly showPasswordToggle?: boolean
}

export function EcuLabeledInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onValueChange,
  placeholder,
  autoComplete,
  required,
  disabled,
  topSlot,
  hint,
  showPasswordToggle = false,
}: EcuLabeledInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const withToggle = type === 'password' && showPasswordToggle
  const inputType = withToggle && passwordVisible ? 'text' : type

  const inputEl = (
    <input
      id={id}
      name={name}
      type={inputType}
      className="ecu-form-field__input"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      disabled={disabled}
    />
  )

  return (
    <div className="ecu-form-field">
      {topSlot}
      <label className="ecu-form-field__label" htmlFor={id}>
        {label}
      </label>
      {withToggle ? (
        <div className="ecu-form-field__input-password-wrap">
          {inputEl}
          <button
            type="button"
            className="ecu-form-field__password-toggle"
            onClick={() => setPasswordVisible((v) => !v)}
            aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={passwordVisible}
            disabled={disabled}
          >
            <span className="material-symbols-outlined" aria-hidden>
              {passwordVisible ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      ) : (
        inputEl
      )}
      {hint ? <p className="ecu-form-field__hint">{hint}</p> : null}
    </div>
  )
}
