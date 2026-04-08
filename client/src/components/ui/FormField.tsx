import { cx } from '../../utils/cx'
import type { ChangeEvent } from 'react'

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  error?: string
  hint?: string
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
  children?: React.ReactNode // for select options
}

export function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  type = 'text',
  placeholder,
  required,
  rows = 4,
  className,
  children,
}: FormFieldProps) {
  const inputClass = cx('input', error ? 'input-error' : '', type === 'textarea' ? 'input-code' : '')

  return (
    <div className={cx('form-field', className)}>
      <label className="form-label" htmlFor={name}>
        {label}
        {required && <span style={{ color: 'var(--color-danger)', marginLeft: 4 }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={inputClass}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClass}
        >
          {children}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          className={inputClass}
        />
      )}

      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  )
}
