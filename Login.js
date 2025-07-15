
import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Email: ''
  });
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup) {
        // Signup API call
        const res = await axios.post('http://localhost:5000/auth/signup', {
          Firstname: formData.FirstName,
          Lastname: formData.LastName,
          Email: formData.Email,
          Username: formData.Username,
          Password: formData.Password
        });

        if (res.data.success) {
          alert('Signup successful! Please login.');
          setIsSignup(false);
        } else {
          setError(res.data.message || 'Signup failed');
        }
      } else {
        // Login API call
        const res = await axios.post('http://localhost:5000/auth/login', {
          Username: formData.Username,
          Password: formData.Password
        });

        if (res.data.success) {
          // Temporarily store token and user
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          // Call callback
          onLoginSuccess();

          //  remove token after login
          localStorage.removeItem('token');

          // Reload the page
        } else {
          setError(res.data.message || 'Login failed');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              className="login-input"
              type="text"
              name="FirstName"
              placeholder="First Name"
              value={formData.FirstName}
              onChange={handleChange}
              required
            />
            <input
              className="login-input"
              type="text"
              name="LastName"
              placeholder="Last Name"
              value={formData.LastName}
              onChange={handleChange}
              required
            />
            <input
              className="login-input"
              type="email"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          className="login-input"
          type="text"
          name="Username"
          placeholder="Username"
          value={formData.Username}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          type="password"
          name="Password"
          placeholder="Password"
          value={formData.Password}
          onChange={handleChange}
          required
        />
        <button className="login-button" type="submit">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p className="login-toggle">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default Login;
