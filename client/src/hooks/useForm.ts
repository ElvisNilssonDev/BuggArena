import { useState, useCallback, type ChangeEvent } from 'react'

type FieldValues = Record<string, string>
type FieldErrors = Record<string, string>
type Validator<T extends FieldValues> = (values: T) => FieldErrors

export function useForm<T extends FieldValues>(
  initialValues: T,
  validate?: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }, [])

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      if (validate) {
        const validationErrors = validate(values)
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors)
          setTouched(Object.fromEntries(Object.keys(validationErrors).map((k) => [k, true])))
          return
        }
      }
      setSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setSubmitting(false)
      }
    },
    [values, validate]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  return {
    values,
    errors,
    touched,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldError,
  }
}
