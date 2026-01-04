import { Link } from 'react-router-dom';
import './Auth.css';

function Register() {
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

