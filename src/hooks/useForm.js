import { useState, useCallback } from "react";

export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback(
    (rules) => {
      const newErrors = {};
      for (const [field, fn] of Object.entries(rules)) {
        const msg = fn(values[field]);
        if (msg) newErrors[field] = msg;
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [values]
  );

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  return { values, errors, handleChange, setErrors, reset, validate };
}