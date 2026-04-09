import { useState, useCallback } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { ROUTES } from "../constants";
import Icon from "../components/ui/Icon";
import FormField from "../components/ui/FormField";

export default function LoginPage() {
  const { navigate } = useNav();
  const auth = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const { values, errors, handleChange, setErrors, validate } = useForm({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = useCallback(async () => {
    if (isRegister) {
      const valid = validate({
        username: (v) => (!v.trim() ? "Required." : null),
        email: (v) => (!v.trim() ? "Required." : null),
        password: (v) => (!v.trim() ? "Required." : null),
      });
      if (!valid) return;

      const result = await auth.register(
        values.username,
        values.email,
        values.password
      );
      if (result.success) {
        navigate(ROUTES.HOME);
      } else {
        setErrors({ email: result.error });
      }
    } else {
      const valid = validate({
        email: (v) => (!v.trim() ? "Required." : null),
        password: (v) => (!v.trim() ? "Required." : null),
      });
      if (!valid) return;

      const result = await auth.login(values.email, values.password);
      if (result.success) {
        navigate(ROUTES.HOME);
      } else {
        setErrors({ email: result.error });
      }
    }
  }, [isRegister, values, validate, auth, navigate, setErrors]);

  const toggleMode = useCallback(() => {
    setIsRegister((prev) => !prev);
    setErrors({});
  }, [setErrors]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <main className="page page--narrow page--center">
      <div className="login-box" onKeyDown={handleKeyDown}>
        <div className="login-box__header">
          <Icon name="bug" size={36} className="text-accent" />
          <h1 className="login-box__title">
            {isRegister ? "Join the Arena" : "Welcome Back"}
          </h1>
          <p className="text-muted">
            {isRegister
              ? "Create your account"
              : "Log in to start debugging"}
          </p>
        </div>

        <div className="card form-stack">
          {isRegister && (
            <FormField
              label="Username"
              id="auth-user"
              error={errors.username}
            >
              <input
                id="auth-user"
                className="input"
                value={values.username}
                onChange={handleChange("username")}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </FormField>
          )}

          <FormField
            label="Email"
            id="auth-email"
            error={errors.email}
          >
            <input
              id="auth-email"
              className="input"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormField>

          <FormField
            label="Password"
            id="auth-pass"
            error={errors.password}
          >
            <input
              id="auth-pass"
              className="input"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
            />
          </FormField>

          <button
            className="btn btn--primary btn--full"
            onClick={handleSubmit}
          >
            {isRegister ? "Create Account" : "Log In"}
          </button>

          <p className="login-box__toggle">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button className="link-btn" onClick={toggleMode}>
              {isRegister ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}