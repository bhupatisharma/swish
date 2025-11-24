import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page-container">
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <div className="login-title">Login</div>
        <input type="email" className="login-input" placeholder="Email" id="email"/>
        <input type="password" className="login-input" placeholder="Password" id="password"/>
        <button
          className="login-button"
          onClick={() => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            if (email === "b@gmail.com" && password === "b") {
              navigate("/feed");
            } else {
              alert("Invalid email or password");
            }
          }}
        >
          Login
        </button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
