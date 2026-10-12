// This page allows a new user to register and create an account.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: '', color: '' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#10b981' },
  ];
  return { score, ...levels[score] };
}

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(form.password);

  const handleChange = (event) => {
    setError('');
    setIsDuplicate(false);
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsDuplicate(false);
    setIsLoading(true);

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already registered') || err.statusCode === 409) {
        setIsDuplicate(true);
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* Left panel */}
        <section className="auth-story">
          <Link className="auth-brand" to="/login">
            <span className="brand-mark">₹</span> pennywise<span className="brand-period">.</span>
          </Link>
          <div className="auth-story-copy">
            <span className="auth-kicker">A BETTER MONEY HABIT STARTS HERE</span>
            <h1>Small steps.<br /><span>Stronger</span> finances.</h1>
            <p>Bring your spending, budgets and subscriptions into one simple view.</p>
          </div>
          <div className="auth-feature-pills">
            <span className="auth-feature-pill">✦ Expense Tracking</span>
            <span className="auth-feature-pill">◷ Subscription Manager</span>
            <span className="auth-feature-pill">◉ Budget Goals</span>
          </div>
          <div className="auth-story-note">
            <span className="auth-note-icon">✓</span>
            <span>
              <strong>Start with a fresh perspective.</strong>
              <small>Make confident choices, one day at a time.</small>
            </span>
          </div>
          <span className="auth-ring auth-ring-one" />
          <span className="auth-ring auth-ring-two" />
        </section>

        {/* Right panel */}
        <section className="auth-form-side">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-header">
              <span className="auth-kicker">GET STARTED — FREE</span>
              <h2>Create your account</h2>
              <p className="auth-subtitle">A clearer picture of your money starts here.</p>
            </div>

            {/* Success state */}
            {success && (
              <div className="auth-success-banner" role="status">
                <span className="auth-success-icon">✓</span>
                <span>Account created! Redirecting to sign in…</span>
              </div>
            )}

            {/* Error banner */}
            {error && !success && (
              <div className={`auth-error-banner ${isDuplicate ? 'auth-error-duplicate' : ''}`} role="alert">
                <span className="auth-error-icon">{isDuplicate ? '⚠' : '✕'}</span>
                <span>
                  {isDuplicate ? (
                    <>
                      This email is already registered.{' '}
                      <Link to="/login" className="auth-error-link">Sign in instead →</Link>
                    </>
                  ) : error}
                </span>
              </div>
            )}

            <label className="auth-field">
              <span>Full name</span>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="e.g. Om Lendal"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading || success}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Email address</span>
              <div className={`auth-input-wrap ${isDuplicate ? 'auth-input-error' : ''}`}>
                <span className="auth-input-icon">✉</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading || success}
                  aria-invalid={isDuplicate}
                  aria-describedby={isDuplicate ? 'email-error' : undefined}
                />
                {isDuplicate && <span className="auth-input-badge">Already used</span>}
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap password-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading || success}
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a16.4 16.4 0 01-3.3 4.1M6.2 6.2C3.9 7.7 2 12 2 12s3.5 7 10 7a10 10 0 003.2-.5" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {/* Password strength meter */}
              {form.password && (
                <div className="password-strength">
                  <div className="password-strength-bar">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="password-strength-segment"
                        style={{ background: strength.score >= i ? strength.color : undefined }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className="password-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
            </label>

            <button className="auth-submit" type="submit" disabled={isLoading || success}>
              {isLoading ? (
                <span className="auth-spinner" aria-hidden="true" />
              ) : (
                <>Create account <span aria-hidden="true">→</span></>
              )}
            </button>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            <p className="auth-privacy">Your financial data stays private and secure.</p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Register;
