/**
 * Login Component
 * Supports login by email OR username.
 */
import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Auth.css';

function Login({ onLogin, onSwitchToRegister }) {
  const [identifier, setIdentifier] = useState('');    // email or username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = identifier.trim();
    if (!trimmedId || !password) {
      setError('Please enter your email (or username) and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier: trimmedId.toLowerCase(),
        password,
      });

      const { user } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id);
      if (onLogin) onLogin(user);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials. Check your email/username and password.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please make sure the server is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>📋 Task Manager</h1>
          <p>Sign in to manage your tasks</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Enter email or username"
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">{error}</div>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? '⏳ Signing in…' : '🚀 Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button className="link-button" onClick={onSwitchToRegister} type="button">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
