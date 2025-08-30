import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/germany";

const GermanyMatchForm = ({ onAdded }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    time: "",
    home: "",
    away: "",
    tip: "",
    ou: "",
    h2h: [0, 0, 0, 0, 0, 0],
    form: ["D", "D", "D", "D", "D", "D"],
    stat: { home: "0%", away: "0%" },
    odds: { main: ["", "", ""], double: ["", "", ""] },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOddsChange = (e, type, index) => {
    const updated = { ...form.odds };
    updated[type][index] = e.target.value;
    setForm({ ...form, odds: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Format odds before sending
    const formatted = {
      ...form,
      odds: {
        main: form.odds.main.map((v) => (v ? Number(v) : null)),
        double: form.odds.double.map((v) => (v ? Number(v) : null)),
      },
    };

    // ✅ Get token from localStorage
    const token = localStorage.getItem("adminToken");

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- ✅ IMPORTANT
      },
      body: JSON.stringify(formatted),
    });

    if (res.ok) {
      // ✅ Only call onAdded if it exists
      if (onAdded) {
        onAdded();
      } else {
        // fallback: redirect back to Germany page
        navigate("/germany");
      }

      // Reset form after success
      setForm({
        time: "",
        home: "",
        away: "",
        tip: "",
        ou: "",
        h2h: [0, 0, 0, 0, 0, 0],
        form: ["D", "D", "D", "D", "D", "D"],
        stat: { home: "0%", away: "0%" },
        odds: { main: ["", "", ""], double: ["", "", ""] },
      });
    } else {
      const error = await res.json();
      alert("Failed to add match: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-3 border rounded"
      style={{ background: "#f9f9f9" }}
    >
      <h5>Add New Match</h5>

      <div className="mb-2">
        <input
          name="time"
          placeholder="Time (e.g. 04:30)"
          value={form.time}
          onChange={handleChange}
        />
        <input
          name="home"
          placeholder="Home Team"
          value={form.home}
          onChange={handleChange}
        />
        <input
          name="away"
          placeholder="Away Team"
          value={form.away}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <input
          name="tip"
          placeholder="Tip (1x, 12, etc)"
          value={form.tip}
          onChange={handleChange}
        />
        <input
          name="ou"
          placeholder="O/U (e.g. un3.5)"
          value={form.ou}
          onChange={handleChange}
        />
      </div>

      <h6>Main Odds (1, X, 2)</h6>
      <div className="mb-2">
        {["1", "X", "2"].map((label, i) => (
          <input
            key={i}
            type="number"
            step="0.01"
            placeholder={label}
            value={form.odds.main[i]}
            onChange={(e) => handleOddsChange(e, "main", i)}
          />
        ))}
      </div>

      <h6>Double Chance (1X, 12, X2)</h6>
      <div className="mb-2">
        {["1X", "12", "X2"].map((label, i) => (
          <input
            key={i}
            type="number"
            step="0.01"
            placeholder={label}
            value={form.odds.double[i]}
            onChange={(e) => handleOddsChange(e, "double", i)}
          />
        ))}
      </div>

      <button type="submit" className="btn btn-primary">
        Add Match
      </button>
    </form>
  );
};

export default GermanyMatchForm;
