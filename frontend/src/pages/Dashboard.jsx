import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/dashboard").then(res => setData(res.data)).catch(() => navigate("/"));
  }, []);

  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  if (!data) return <div style={{textAlign:"center",marginTop:"100px",color:"#1a237e",fontSize:"18px"}}>Loading...</div>;

  const initials = data.profile.fullname.split(" ").map(n=>n[0]).join("");

  return (
    <div style={{minHeight:"100vh", background:"#f0f4f8"}}>
      <nav style={s.nav}>
        <div style={s.brand}>🏦 <span style={{marginLeft:"8px"}}>Secure Banking</span></div>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <div style={s.avatar}>{initials}</div>
          <span style={{color:"rgba(255,255,255,0.8)", fontSize:"14px"}}>{data.profile.fullname}</span>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={s.content}>
        <h2 style={s.welcome}>Welcome back, {data.profile.fullname.split(" ")[0]}! 👋</h2>

        <div style={s.balanceCard}>
          <p style={{color:"rgba(255,255,255,0.7)", fontSize:"13px", margin:"0 0 6px"}}>Total Balance</p>
          <h1 style={{color:"white", fontSize:"36px", fontWeight:"500", margin:"0 0 20px"}}>Rs. {parseFloat(data.balance).toLocaleString()}</h1>
          <div style={{display:"flex", gap:"10px"}}>
            <button style={s.btnWhite} onClick={() => navigate("/transfer")}>💸 Transfer Money</button>
            <button style={s.btnOutline} onClick={() => navigate("/transactions")}>📜 History</button>
            {data.profile.role === "admin" && (
              <button style={{...s.btnOutline, borderColor:"#ff8a65", color:"#ff8a65"}} onClick={() => navigate("/admin")}>👨‍💼 Admin</button>
            )}
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"24px"}}>
          {[
            {label:"Account Status", value:data.profile.status.toUpperCase(), icon:"✅"},
            {label:"Role", value:data.profile.role.toUpperCase(), icon:"🔐"},
            {label:"Fraud Alerts", value:data.fraudAlerts, icon:"🚨"}
          ].map((c,i) => (
            <div key={i} style={s.statCard}>
              <div style={{fontSize:"24px", marginBottom:"8px"}}>{c.icon}</div>
              <div style={{fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.5px"}}>{c.label}</div>
              <div style={{fontSize:"18px", fontWeight:"500", color:"#1a237e", marginTop:"4px"}}>{c.value}</div>
            </div>
          ))}
        </div>

        <h3 style={s.sectionTitle}>Recent Transactions</h3>
        <div style={s.txList}>
          {data.recentTransactions.length === 0 && (
            <div style={{padding:"30px", textAlign:"center", color:"#999"}}>No transactions yet</div>
          )}
          {data.recentTransactions.map(tx => (
            <div key={tx.id} style={s.txItem}>
              <div style={{...s.txIcon, background: tx.sender_id === data.profile.id ? "#fce4ec" : "#e8f5e9"}}>
                {tx.sender_id === data.profile.id ? "↗" : "↙"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px", fontWeight:"500", color:"#333"}}>{tx.note || "Transfer"}</div>
                <div style={{fontSize:"12px", color:"#999", marginTop:"2px"}}>{new Date(tx.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{fontSize:"15px", fontWeight:"500", color: tx.sender_id === data.profile.id ? "#e53935" : "#43a047"}}>
                {tx.sender_id === data.profile.id ? "- " : "+ "}Rs. {parseFloat(tx.amount).toLocaleString()}
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
  avatar: { width:"36px", height:"36px", borderRadius:"50%", background:"#3949ab", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"13px", fontWeight:"500" },
  logoutBtn: { background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", padding:"6px 14px", borderRadius:"6px", fontSize:"13px", cursor:"pointer" },
  content: { maxWidth:"900px", margin:"0 auto", padding:"28px 20px" },
  welcome: { fontSize:"22px", fontWeight:"500", color:"#1a237e", marginBottom:"20px" },
  balanceCard: { background:"#1a237e", borderRadius:"16px", padding:"28px", marginBottom:"20px" },
  btnWhite: { padding:"10px 20px", background:"white", color:"#1a237e", border:"none", borderRadius:"8px", fontSize:"13px", fontWeight:"500", cursor:"pointer" },
  btnOutline: { padding:"10px 20px", background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"8px", fontSize:"13px", cursor:"pointer" },
  statCard: { background:"white", borderRadius:"12px", padding:"20px", border:"0.5px solid #e0e0e0" },
  sectionTitle: { fontSize:"16px", fontWeight:"500", color:"#333", marginBottom:"14px" },
  txList: { background:"white", borderRadius:"12px", border:"0.5px solid #e0e0e0", overflow:"hidden" },
  txItem: { padding:"14px 20px", display:"flex", alignItems:"center", gap:"14px", borderBottom:"0.5px solid #f5f5f5" },
  txIcon: { width:"40px", height:"40px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }
};

export default Dashboard;