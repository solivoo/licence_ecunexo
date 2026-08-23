export type EcuLabeledTextareaProps = {
  readonly id: string
  readonly name?: string
  readonly label: string
  readonly value: string
  readonly onValueChange: (value: string) => void
  readonly placeholder?: string
  readonly rows?: number
  readonly required?: boolean
  readonly disabled?: boolean
  readonly hint?: string
}

export function EcuLabeledTextarea({
  id,
  name,
  label,
  value,
  onValueChange,
  placeholder,
  rows = 4,
  required,
  disabled,
  hint,
}: EcuLabeledTextareaProps) {
  return (
    <div className="ecu-form-field">
      <label className="ecu-form-field__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className="ecu-form-field__input ecu-form-field__textarea"
        value={value}
        rows={rows}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {hint ? <p className="ecu-form-field__hint">{hint}</p> : null}
    </div>
  )
}
