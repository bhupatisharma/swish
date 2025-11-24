import { Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  return (
    <div className="register-page-container">
      <form className="register-form">
        <div className="register-title">Register</div>
        <input type="text" className="register-input" placeholder="Name" />
        <input type="email" className="register-input" placeholder="Email" />
        <input type="password" className="register-input" placeholder="Password" />
        <button className="register-button">Register</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
