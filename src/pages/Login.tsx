import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Loader2, Moon, Sun } from 'lucide-react';
import { login, isAuthenticated } from '../auth/auth';
import { validateEmail, validateRequired } from '../validation';
import { FormField, inputClassName } from '../components/FormField';
import { useTheme } from '../contexts/ThemeContext';

export function Login(): React.ReactElement {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // MOCK: prefilled with the demo admin login — remove before wiring a real backend.
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const emailError = validateEmail(email);
  const passwordError = validateRequired(password, 'Password');
  const isValid = !emailError && !passwordError;

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    setFormError('');

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setFormError('Invalid email or password.');
        return;
      }
      navigate('/home');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-primary px-4">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-card p-2 text-white/90 hover:bg-white/10 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md rounded-card bg-surface dark:bg-surface-dark p-8 shadow-card-lg">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-card bg-gradient-primary" />
          <span className="text-lg font-semibold">Nimbus</span>
        </div>

        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to access your dashboard.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            htmlFor="email"
            helperText="Use the address you registered with."
            error={hasAttemptedSubmit ? emailError : undefined}
          >
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
              placeholder="you@company.com"
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            helperText="At least 6 characters."
            error={hasAttemptedSubmit ? passwordError : undefined}
          >
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
              placeholder="••••••••"
            />
          </FormField>

          {formError && <p className="text-sm font-medium text-danger-dark">{formError}</p>}

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-card bg-primary py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-subtle dark:bg-border-dark" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-border-subtle dark:bg-border-dark" />
        </div>

        <button
          type="button"
          onClick={() => setFormError('Google sign-in is not available in this demo.')}
          className="flex w-full items-center justify-center gap-2 rounded-card border border-border-default dark:border-border-dark py-2.5 text-sm font-medium hover:bg-canvas dark:hover:bg-night"
        >
          <Globe className="h-4 w-4" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-muted">
          Demo credentials: admin@example.com / password123
        </p>
      </div>
    </div>
  );
}
