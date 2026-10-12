// This page handles user login and stores the token after a successful request.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleChange = (event) => {
    setError('');
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setUser(response.user);
      setToken(response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
            <span className="auth-kicker">YOUR MONEY, IN FOCUS</span>
            <h1>Make every<br />rupee <span>count.</span></h1>
            <p>A little more clarity today can make a big difference tomorrow.</p>
          </div>
          <div className="auth-feature-pills">
            <span className="auth-feature-pill">✦ Expense Tracking</span>
            <span className="auth-feature-pill">◷ Subscription Manager</span>
            <span className="auth-feature-pill">◉ Budget Goals</span>
          </div>
          <div className="auth-story-note">
            <span className="auth-note-icon">✦</span>
            <span>
              <strong>Feel good about your finances.</strong>
              <small>Track spending, subscriptions and goals in one place.</small>
            </span>
          </div>
          <span className="auth-ring auth-ring-one" />
          <span className="auth-ring auth-ring-two" />
        </section>

        {/* Right panel */}
        <section className="auth-form-side">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-header">
              <span className="auth-kicker">WELCOME BACK</span>
              <h2>Sign in to Pennywise</h2>
              <p className="auth-subtitle">Your financial overview is just a step away.</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="auth-error-banner" role="alert">
                <span className="auth-error-icon">✕</span>
                <span>{error}</span>
              </div>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap password-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
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
            </label>

            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="auth-spinner" aria-hidden="true" />
              ) : (
                <>Sign in <span aria-hidden="true">→</span></>
              )}
            </button>

            <p className="auth-switch">
              New to Pennywise? <Link to="/register">Create an account</Link>
            </p>
            <p className="auth-privacy">Your financial data stays private and secure.</p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
