import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [userType, setUserType] = useState("regular"); // regular, qc, or manager

  const handleLogin = (e) => {
    e.preventDefault();

    // Clear previous errors
    let formIsValid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      formIsValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      // Navigate based on user type
      if (userType === "qc") {
        navigate("/qc-dashboard");
      } else if (userType === "manager") {
        navigate("/manager-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <div style={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 20l4-8 4 8 4-8 4 8" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <h1 style={styles.title}>CargoSight Manager</h1>
        <p style={styles.subtitle}>AI-Powered Cargo Inspection System</p>
      </div>
      <div style={styles.card}>
        <div style={styles.userTypeButtons}>
          <button 
            style={{
              ...styles.userTypeButton,
              background: userType === "regular" ? "#000" : "#fff",
              color: userType === "regular" ? "#fff" : "#111827",
            }}
            onClick={() => setUserType("regular")}
          >
            Demo User
          </button>
          <button 
            style={{
              ...styles.userTypeButton,
              background: userType === "qc" ? "#000" : "#fff",
              color: userType === "qc" ? "#fff" : "#111827",
            }}
            onClick={() => setUserType("qc")}
          >
            QA Operator
          </button>
          <button 
            style={{
              ...styles.userTypeButton,
              background: userType === "manager" ? "#000" : "#fff",
              color: userType === "manager" ? "#fff" : "#111827",
            }}
            onClick={() => setUserType("manager")}
          >
            Warehouse Manager
          </button>
        </div>
        <h2 style={styles.loginTitle}>
          {userType === "qc" ? "QC Operator Login" : 
           userType === "manager" ? "Warehouse Manager Login" : 
           "Login"}
        </h2>
        <p style={styles.loginSubtitle}>Enter your credentials to access your account</p>
        <form onSubmit={handleLogin} noValidate>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p style={styles.error}>{errors.username}</p>}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>
          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: 'Inter, Arial, sans-serif',
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 700,
    fontSize: 28,
    margin: 0,
    color: "#111827",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 16,
    margin: 0,
    marginBottom: 8,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    padding: 32,
    minWidth: 400,
    maxWidth: 400,
    width: "100%",
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 4,
    color: "#111827",
  },
  loginSubtitle: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: 500,
    marginBottom: 6,
    color: "#1e293b",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontSize: 15,
    outline: "none",
    background: "#f8fafc",
    marginBottom: 2,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    width: "100%",
    padding: "12px 0",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 8,
  },
  userTypeButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
    width: "100%",
   
  },
  userTypeButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    font: 'Inter, Arial, sans-serif',
    fontSize: "14px",
  },
};

export default LoginPage;
