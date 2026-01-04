import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, setAuthData } from '../services/auth';
import './Auth.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register(email, password, username);
      setAuthData(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registration Disabled</h1>
        <div className="info-message">
          <p>🔒 User registration is currently disabled.</p>
          <p>This application is in admin-only mode for story creation.</p>
        </div>
        <div className="auth-actions">
          <Link to="/login" className="auth-link-button">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

