import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { validateEmail } from '../validation';
import { FormField, inputClassName } from '../components/FormField';

export function ForgotPassword(): React.ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailError = validateEmail(email);
  const isValid = !emailError;

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (!isValid) {
      return;
    }
    // MOCK: no real password-reset email service exists; this only simulates success.
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary px-4">
      <div className="w-full max-w-md rounded-card bg-surface dark:bg-surface-dark p-8 shadow-card-lg">
        <h1 className="text-xl font-semibold">Reset your password</h1>
        <p className="mt-1 text-sm text-muted">
          Enter your email and we will send you a link to reset your password.
        </p>

        {isSubmitted ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-card bg-success-light px-4 py-6 text-center">
            <MailCheck className="h-6 w-6 text-success-dark" />
            <p className="text-sm font-medium text-success-dark">
              If an account exists for {email}, a reset link has been sent.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2 text-sm font-semibold text-primary hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Email"
              htmlFor="forgot-email"
              helperText="We will send a reset link to this address."
              error={hasAttemptedSubmit ? emailError : undefined}
            >
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName}
                placeholder="you@company.com"
              />
            </FormField>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full rounded-card bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Send reset link
            </button>

            <Link to="/login" className="block text-center text-sm text-primary hover:underline">
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
