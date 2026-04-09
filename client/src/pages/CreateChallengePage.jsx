import { useCallback, useEffect } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { ROUTES, LANGUAGES, DIFFICULTIES } from "../constants";
import { challengeService } from "../services/challengeService";
import Icon from "../components/ui/Icon";
import FormField from "../components/ui/FormField";

export default function CreateChallengePage() {
  const { navigate } = useNav();
  const { isAuthenticated } = useAuth();
  const { values, errors, handleChange, validate } = useForm({
    title: "",
    description: "",
    buggyCode: "",
    expectedBehavior: "",
    actualBehavior: "",
    hints: "",
    language: "JavaScript",
    difficulty: "Easy",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(async () => {
    const valid = validate({
      title: (v) => (!v.trim() ? "Title is required." : null),
      description: (v) => (!v.trim() ? "Description is required." : null),
      buggyCode: (v) => (!v.trim() ? "Code is required." : null),
    });

    if (!valid) return;

    try {
      const challenge = await challengeService.create(values);
      navigate(ROUTES.CHALLENGE, challenge.id);
    } catch {
      alert("Failed to create challenge. Please try again.");
    }
  }, [values, validate, navigate]);

  if (!isAuthenticated) return null;

  return (
    <main className="page page--narrow">
      <h1 className="page-title">Create Challenge</h1>
      <p className="page-subtitle">Submit buggy code for others to fix.</p>

      <div className="form-stack">
        <FormField label="Title" id="cf-title" error={errors.title}>
          <input
            id="cf-title"
            className="input"
            value={values.title}
            onChange={handleChange("title")}
            placeholder="e.g. Off-by-one in Binary Search"
          />
        </FormField>

        <div className="form-row">
          <FormField label="Language" id="cf-lang">
            <select
              id="cf-lang"
              className="select select--full"
              value={values.language}
              onChange={handleChange("language")}
            >
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Difficulty" id="cf-diff">
            <select
              id="cf-diff"
              className="select select--full"
              value={values.difficulty}
              onChange={handleChange("difficulty")}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          label="Description"
          id="cf-desc"
          error={errors.description}
        >
          <textarea
            id="cf-desc"
            className="textarea"
            value={values.description}
            onChange={handleChange("description")}
            placeholder="Describe the problem..."
            rows={4}
          />
        </FormField>

        <FormField label="Buggy Code" id="cf-code" error={errors.buggyCode}>
          <textarea
            id="cf-code"
            className="textarea textarea--mono"
            value={values.buggyCode}
            onChange={handleChange("buggyCode")}
            placeholder="Paste buggy code..."
            rows={8}
          />
        </FormField>

        <div className="form-row">
          <FormField label="Expected Behavior" id="cf-exp">
            <textarea
              id="cf-exp"
              className="textarea"
              value={values.expectedBehavior}
              onChange={handleChange("expectedBehavior")}
              rows={3}
            />
          </FormField>

          <FormField label="Actual Behavior" id="cf-act">
            <textarea
              id="cf-act"
              className="textarea"
              value={values.actualBehavior}
              onChange={handleChange("actualBehavior")}
              rows={3}
            />
          </FormField>
        </div>

        <FormField label="Hints (optional)" id="cf-hints">
          <input
            id="cf-hints"
            className="input"
            value={values.hints}
            onChange={handleChange("hints")}
          />
        </FormField>

        <div className="form-actions">
          <button className="btn btn--primary" onClick={handleSubmit}>
            <Icon name="send" size={14} /> Publish Challenge
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => navigate(ROUTES.CHALLENGES)}
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}