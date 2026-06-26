import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters!"); return;
    }
    if (!/[A-Z]/.test(password)) {
      alert("Password must contain at least one uppercase letter!"); return;
    }
    if (!/[0-9]/.test(password)) {
      alert("Password must contain at least one number!"); return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      alert("Password must contain at least one special character!"); return;
    }
    try {
      await api.post("/auth/register", { fullname, email, password });
      alert("Registered Successfully! Please Login.");
      navigate("/");
    } catch {
      alert("Registration Failed");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>🏦</div>
          <h1 style={s.logoTitle}>Secure Banking</h1>
          <p style={s.logoSub}>Create your account</p>
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} placeholder="Enter your full name" onChange={e => setFullname(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Email address</label>
          <input style={s.input} type="email" placeholder="you@example.com" onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
            onChange={e => setPassword(e.target.value)}
          />
          <p style={{fontSize:"11px", color:"#888", margin:"4px 0 0"}}>
            Must contain: 8+ characters, uppercase, number, special character (!@#$%^&*)
          </p>
        </div>
        <button style={s.btn} onClick={register}>Create Account</button>
        <p style={s.link}>Already have an account? <Link to="/" style={{color:"#1a237e"}}>Login</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:"100vh", background:"#f0f4f8", display:"flex", alignItems:"center", justifyContent:"center" },
  card: { background:"white", borderRadius:"16px", padding:"40px", width:"400px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:"0.5px solid #e0e0e0" },
  logo: { textAlign:"center", marginBottom:"28px" },
  logoIcon: { fontSize:"40px", marginBottom:"8px" },
  logoTitle: { fontSize:"22px", fontWeight:"500", color:"#1a237e", margin:"0 0 4px" },
  logoSub: { fontSize:"13px", color:"#888", margin:0 },
  formGroup: { marginBottom:"16px" },
  label: { display:"block", fontSize:"13px", fontWeight:"500", color:"#555", marginBottom:"6px" },
  input: { width:"100%", padding:"11px 14px", border:"1px solid #e0e0e0", borderRadius:"8px", fontSize:"14px", outline:"none", boxSizing:"border-box", color:"#333" },
  btn: { width:"100%", padding:"12px", background:"#1a237e", color:"white", border:"none", borderRadius:"8px", fontSize:"15px", fontWeight:"500", cursor:"pointer", marginTop:"8px" },
  link: { textAlign:"center", fontSize:"13px", color:"#888", marginTop:"16px" }
};

export default Register;