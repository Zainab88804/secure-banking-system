import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/transaction/history").then(res => {
      setTransactions(res.data.transactions);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{minHeight:"100vh", background:"#f0f4f8"}}>
      <nav style={s.nav}>
        <div style={s.brand}>🏦 <span style={{marginLeft:"8px"}}>Secure Banking</span></div>
        <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
      </nav>
      <div style={s.content}>
        <h2 style={s.title}>📜 Transaction History</h2>
        {loading && <p style={{color:"#888"}}>Loading...</p>}
        <div style={s.list}>
          {transactions.map(tx => (
            <div key={tx.id} style={s.item}>
              <div style={{...s.icon, background: tx.sender_id === 1 ? "#fce4ec" : "#e8f5e9"}}>
                <span style={{fontSize:"18px"}}>{tx.sender_id === 1 ? "↗" : "↙"}</span>
              </div>
              <div style={{flex:1}}>
                <div style={s.itemTitle}>{tx.note || "Transfer"}</div>
                <div style={s.itemSub}>
                  {tx.sender_id === 1 ? `To User #${tx.receiver_id}` : `From User #${tx.sender_id}`}
                  {" • "}{new Date(tx.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{...s.amount, color: tx.sender_id === 1 ? "#e53935" : "#43a047"}}>
                  {tx.sender_id === 1 ? "- " : "+ "}Rs. {parseFloat(tx.amount).toLocaleString()}
                </div>
                <div style={{fontSize:"11px", color:"#43a047", textAlign:"right", marginTop:"2px"}}>{tx.status}</div>
              </div>
            </div>
          ))}
          {transactions.length === 0 && !loading && (
            <div style={{padding:"40px", textAlign:"center", color:"#999"}}>No transactions found</div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  nav: { background:"#1a237e", padding:"0 24px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  brand: { color:"white", fontSize:"18px", fontWeight:"500", display:"flex", alignItems:"center" },
  backBtn: { background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 16px", borderRadius:"6px", cursor:"pointer" },
  content: { maxWidth:"800px", margin:"0 auto", padding:"28px 20px" },
  title: { fontSize:"22px", fontWeight:"500", color:"#1a237e", marginBottom:"20px" },
  list: { background:"white", borderRadius:"12px", border:"0.5px solid #e0e0e0", overflow:"hidden" },
  item: { padding:"16px 20px", display:"flex", alignItems:"center", gap:"14px", borderBottom:"0.5px solid #f5f5f5" },
  icon: { width:"44px", height:"44px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  itemTitle: { fontSize:"14px", fontWeight:"500", color:"#333" },
  itemSub: { fontSize:"12px", color:"#999", marginTop:"3px" },
  amount: { fontSize:"15px", fontWeight:"500" }
};

export default Transactions;