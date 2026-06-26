import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>🏦</div>
          <h1 style={s.logoTitle}>Secure Banking</h1>
          <p style={s.logoSub}>Sign in to your account</p>
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Email address</label>
          <input style={s.input} type="email" placeholder="you@example.com" onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
        </div>
        <button style={s.btn} onClick={login} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p style={s.link}>Don't have an account? <Link to="/register" style={{color:"#1a237e"}}>Register</Link></p>
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

export default Login;