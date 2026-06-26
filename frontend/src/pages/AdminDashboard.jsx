import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // ✅ useEffect ADD kiya - page load pe data fetch hoga
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () =>
    api.get("/admin/users").then(res => setUsers(res.data));

  const freeze = async (id) => {
    await api.put(`/admin/freeze/${id}`);
    loadUsers();
  };

  const unfreeze = async (id) => {
    await api.put(`/admin/unfreeze/${id}`);
    loadUsers();
  };

  return (
    <div style={{minHeight:"100vh", background:"#f0f4f8"}}>
      <nav style={s.nav}>
        <div style={s.brand}>🏦 <span style={{marginLeft:"8px"}}>Secure Banking — Admin</span></div>
        <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
      </nav>
      <div style={s.content}>
        <h2 style={s.title}>👨‍💼 User Management</h2>
        <div style={s.list}>
          <div style={s.header}>
            <span>User</span><span>Role</span><span>Balance</span><span>Status</span><span>Actions</span>
          </div>
          {users.map(user => (
            <div key={user.id} style={s.row}>
              <div>
                <div style={s.name}>{user.fullname}</div>
                <div style={s.email}>{user.email}</div>
              </div>
              <span style={{...s.badge, background: user.role==="admin"?"#e3f2fd":"#f3e5f5", color: user.role==="admin"?"#1565c0":"#6a1b9a"}}>
                {user.role}
              </span>
              <span style={s.balance}>Rs. {parseFloat(user.balance).toLocaleString()}</span>
              <span style={{...s.badge, background: user.status==="active"?"#e8f5e9":"#ffebee", color: user.status==="active"?"#2e7d32":"#c62828"}}>
                {user.status}
              </span>
              <div style={{display:"flex", gap:"8px"}}>
                <button style={s.freezeBtn} onClick={() => freeze(user.id)}>🔒 Freeze</button>
                <button style={s.unfreezeBtn} onClick={() => unfreeze(user.id)}>🔓 Unfreeze</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  nav: { background:"#1a237e", padding:"0 24px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  brand: { color:"white", fontSize:"18px", fontWeight:"500", display:"flex", alignItems:"center" },
  backBtn: { background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 16px", borderRadius:"6px", cursor:"pointer" },
  content: { maxWidth:"1000px", margin:"0 auto", padding:"28px 20px" },
  title: { fontSize:"22px", fontWeight:"500", color:"#1a237e", marginBottom:"20px" },
  list: { background:"white", borderRadius:"12px", border:"0.5px solid #e0e0e0", overflow:"hidden" },
  header: { display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr", padding:"12px 20px", background:"#f5f5f5", fontSize:"12px", fontWeight:"500", color:"#666", textTransform:"uppercase", letterSpacing:"0.5px" },
  row: { display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr", padding:"16px 20px", alignItems:"center", borderBottom:"0.5px solid #f5f5f5" },
  name: { fontSize:"14px", fontWeight:"500", color:"#333" },
  email: { fontSize:"12px", color:"#999", marginTop:"2px" },
  badge: { padding:"4px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"500", display:"inline-block" },
  balance: { fontSize:"14px", fontWeight:"500", color:"#1a237e" },
  freezeBtn: { padding:"6px 12px", background:"#ffebee", color:"#c62828", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer" },
  unfreezeBtn: { padding:"6px 12px", background:"#e8f5e9", color:"#2e7d32", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer" }
};

export default AdminDashboard;