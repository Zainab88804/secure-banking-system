// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// function Transfer() {
//   const [receiverId, setReceiverId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const transfer = async () => {
//     setLoading(true);
//     try {
//       await api.post("/transaction/transfer", { receiverId, amount, note });
//       alert("Transfer Successful!");
//       navigate("/dashboard");
//     } catch {
//       alert("Transfer Failed! Check balance or receiver ID.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{minHeight:"100vh", background:"#f0f4f8"}}>
//       <nav style={s.nav}>
//         <div style={s.brand}>🏦 <span style={{marginLeft:"8px"}}>Secure Banking</span></div>
//         <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
//       </nav>
//       <div style={s.content}>
//         <div style={s.card}>
//           <h2 style={s.title}>💸 Transfer Money</h2>
//           <p style={s.subtitle}>Send money securely to another account</p>
//           <div style={s.formGroup}>
//             <label style={s.label}>Receiver Account ID</label>
//             <input style={s.input} placeholder="Enter receiver ID (e.g. 2)" onChange={e => setReceiverId(e.target.value)} />
//           </div>
//           <div style={s.formGroup}>
//             <label style={s.label}>Amount (Rs.)</label>
//             <input style={s.input} type="number" placeholder="Enter amount" onChange={e => setAmount(e.target.value)} />
//           </div>
//           <div style={s.formGroup}>
//             <label style={s.label}>Note (optional)</label>
//             <input style={s.input} placeholder="e.g. Rent payment" onChange={e => setNote(e.target.value)} />
//           </div>
//           <button style={s.btn} onClick={transfer} disabled={loading}>
//             {loading ? "Processing..." : "💸 Send Money"}
//           </button>
//           <button style={s.cancelBtn} onClick={() => navigate("/dashboard")}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const s = {
//   nav: { background:"#1a237e", padding:"0 24px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" },
//   brand: { color:"white", fontSize:"18px", fontWeight:"500", display:"flex", alignItems:"center" },
//   backBtn: { background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 16px", borderRadius:"6px", cursor:"pointer" },
//   content: { maxWidth:"500px", margin:"40px auto", padding:"0 20px" },
//   card: { background:"white", borderRadius:"16px", padding:"36px", border:"0.5px solid #e0e0e0", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" },
//   title: { fontSize:"22px", fontWeight:"500", color:"#1a237e", margin:"0 0 6px" },
//   subtitle: { fontSize:"13px", color:"#888", margin:"0 0 28px" },
//   formGroup: { marginBottom:"18px" },
//   label: { display:"block", fontSize:"13px", fontWeight:"500", color:"#555", marginBottom:"6px" },
//   input: { width:"100%", padding:"11px 14px", border:"1px solid #e0e0e0", borderRadius:"8px", fontSize:"14px", outline:"none", boxSizing:"border-box", color:"#333" },
//   btn: { width:"100%", padding:"13px", background:"#1a237e", color:"white", border:"none", borderRadius:"8px", fontSize:"15px", fontWeight:"500", cursor:"pointer", marginTop:"8px" },
//   cancelBtn: { width:"100%", padding:"11px", background:"transparent", color:"#666", border:"1px solid #e0e0e0", borderRadius:"8px", fontSize:"14px", cursor:"pointer", marginTop:"10px" }
// };

// export default Transfer;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Transfer() {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const transfer = async () => {
    if (!receiverId || !amount) {
      alert("Please enter Receiver ID and Amount.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/transaction/transfer", {
        receiverId: Number(receiverId),
        amount: Number(amount),
        note,
      });

      alert("✅ Transfer Successful!");

      setReceiverId("");
      setAmount("");
      setNote("");

      navigate("/dashboard");
    } catch (err) {
      console.error("Transfer Error:", err);

      alert(
        err?.response?.data?.message ||
        "❌ Transfer Failed! Check balance or Receiver ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      <nav style={s.nav}>
        <div style={s.brand}>
          🏦 <span style={{ marginLeft: "8px" }}>Secure Banking</span>
        </div>

        <button
          style={s.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      <div style={s.content}>
        <div style={s.card}>
          <h2 style={s.title}>💸 Transfer Money</h2>

          <p style={s.subtitle}>
            Send money securely to another account
          </p>

          <div style={s.formGroup}>
            <label style={s.label}>Receiver Account ID</label>

            <input
              style={s.input}
              type="number"
              value={receiverId}
              placeholder="Enter receiver ID (e.g. 2)"
              onChange={(e) => setReceiverId(e.target.value)}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Amount (Rs.)</label>

            <input
              style={s.input}
              type="number"
              value={amount}
              placeholder="Enter amount"
              min="1"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Note (Optional)</label>

            <input
              style={s.input}
              value={note}
              placeholder="e.g. Rent payment"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button
            style={{
              ...s.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={transfer}
            disabled={loading}
          >
            {loading ? "Processing..." : "💸 Send Money"}
          </button>

          <button
            style={s.cancelBtn}
            onClick={() => navigate("/dashboard")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  nav: {
    background: "#1a237e",
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    color: "white",
    fontSize: "18px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },

  backBtn: {
    background: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  content: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "0 20px",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "36px",
    border: "0.5px solid #e0e0e0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },

  title: {
    fontSize: "22px",
    fontWeight: "500",
    color: "#1a237e",
    margin: "0 0 6px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#888",
    margin: "0 0 28px",
  },

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#333",
  },

  btn: {
    width: "100%",
    padding: "13px",
    background: "#1a237e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    marginTop: "8px",
  },

  cancelBtn: {
    width: "100%",
    padding: "11px",
    background: "transparent",
    color: "#666",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Transfer;