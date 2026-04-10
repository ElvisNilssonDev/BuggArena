import { useCallback } from "react";
import { useForm } from "../hooks/useForm";
import FormField from "./ui/FormField";
import Icon from "./ui/Icon";

export default function SolutionForm({ onSubmit }) {
  const { values, errors, handleChange, validate } = useForm({
    code: "",
    explanation: "",
  });

  const handleSubmitClick = useCallback(() => {
    const valid = validate({
      code: (v) => (!v.trim() ? "Fixed code is required." : null),
    });
    if (valid) onSubmit(values);
  }, [values, validate, onSubmit]);

  return (
    <div className="card card--accent form-stack">
      <h3 className="solution-form__heading">
        <Icon name="code" size={18} className="text-accent" /> Submit Your Fix
      </h3>

      <FormField label="Fixed Code" id="solution-code" error={errors.code}>
        <textarea
          id="solution-code"
          className="textarea textarea--mono"
          value={values.code}
          onChange={handleChange("code")}
          placeholder="Paste your fixed code here..."
          rows={8}
        />
      </FormField>

      <FormField
        label="Explanation"
        id="solution-explanation"
        error={errors.explanation}
      >
        <textarea
          id="solution-explanation"
          className="textarea"
          value={values.explanation}
          onChange={handleChange("explanation")}
          placeholder="Explain the bug and your fix..."
          rows={4}
        />
      </FormField>

      <button className="btn btn--primary" onClick={handleSubmitClick}>
        <Icon name="send" size={14} /> Submit Solution
      </button>
    </div>
  );
}