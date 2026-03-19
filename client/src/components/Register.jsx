/**
 * Register Component
 *
 * Handles user registration by sending user data to the backend.
 * Automatically logs in the user after successful registration.
 *
 * Fixes applied:
 * - API_BASE_URL imported from shared config (no hardcoding)
 * - Email is trimmed and lowercased before sending
 * - Username validation: no spaces, min 3 chars, alphanumeric + underscores only
 * - Show/hide password toggles on both password fields
 */

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Auth.css';

// Valid username: 3–30 characters, letters, digits, underscores only
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

function Register({ onLogin, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generic change handler — uses the input's name attribute as the state key
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = formData.username.trim();
    const normalisedEmail = formData.email.trim().toLowerCase();

    // ── Client-side validation ──────────────────────────────────────────────

    if (!trimmedUsername) {
      setError('Username is required.');
      return;
    }

    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setError(
        'Username must be 3–30 characters and contain only letters, numbers, or underscores (no spaces).'
      );
      return;
    }

    if (!normalisedEmail) {
      setError('Email is required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // ── API call ────────────────────────────────────────────────────────────

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username: trimmedUsername,
        email: normalisedEmail,      // normalised before sending
        password: formData.password  // confirmPassword is intentionally not sent
      });

      // Store user info and userId in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userId', response.data.user.id);

      // Auto-login: lift state up to App component
      if (onLogin) {
        onLogin(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us to start managing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="3–30 chars: letters, numbers, underscores"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
