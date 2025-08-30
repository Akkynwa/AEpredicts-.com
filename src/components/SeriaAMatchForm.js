// src/components/SeriaAMatchForm.jsx
import React, { useState } from "react";

const API = "http://localhost:5000/SeriaA"; // backend route (create this file on server if not present)
const SERIE_A_LOGO =
  "https://upload.wikimedia.org/wikipedia/en/0/03/Serie_A_logo_%282019%29.svg";

const SeriaAMatchForm = ({ onAdded }) => {
  const [form, setForm] = useState({
    time: "",
    home: "",
    away: "",
    h2h: ["", "", "", "", "", ""],
    form: ["", "", "", "", "", ""],
    odds: { main: ["", "", ""], double: ["", "", ""] },
    tip: "",
    stat: { home: "", away: "" },
    ou: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, field, index, subfield) => {
    if (field === "odds") {
      const updated = { ...form.odds };
      updated[subfield][index] = e.target.value;
      setForm({ ...form, odds: updated });
    } else {
      const updated = [...form[field]];
      updated[index] = e.target.value;
      setForm({ ...form, [field]: updated });
    }
  };

  const handleStatChange = (e, team) => {
    setForm({ ...form, stat: { ...form.stat, [team]: e.target.value } });
  };

  const resetForm = () => {
    setForm({
      time: "",
      home: "",
      away: "",
      h2h: ["", "", "", "", "", ""],
      form: ["", "", "", "", "", ""],
      odds: { main: ["", "", ""], double: ["", "", ""] },
      tip: "",
      stat: { home: "", away: "" },
      ou: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // convert numeric odds where provided
    const payload = {
      ...form,
      odds: {
        main: form.odds.main.map((v) => (v === "" ? null : Number(v))),
        double: form.odds.double.map((v) => (v === "" ? null : Number(v))),
      },
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Server returned ${res.status}`);
      }

      // success
      resetForm();
      if (onAdded) onAdded();
    } catch (err) {
      console.error("Failed to add Serie A match:", err);
      setError(err.message || "Failed to add match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow"
        style={{ maxWidth: 640, width: "100%", background: "#fbfbfc" }}
      >
        <div className="text-center mb-3">
          <img src={SERIE_A_LOGO} alt="Serie A" width="100" className="mb-2" />
          <h4 className="fw-bold">Serie A Match Form</h4>
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <h6 className="mt-2 text-primary">Basic Info</h6>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Match Time (e.g. 20:00)"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6">
            <input
              className="form-control"
              placeholder="O/U (e.g. un3.5)"
              name="ou"
              value={form.ou}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Home Team"
              name="home"
              value={form.home}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Away Team"
              name="away"
              value={form.away}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h6 className="mt-3 text-primary">Head-to-Head (last 6)</h6>
        <div className="row">
          {form.h2h.map((val, i) => (
            <div className="col-6" key={i}>
              <input
                className="form-control mb-2"
                placeholder={`H2H ${i + 1}`}
                value={val}
                onChange={(e) => handleArrayChange(e, "h2h", i)}
              />
            </div>
          ))}
        </div>

        <h6 className="mt-3 text-primary">Recent Form (last 6)</h6>
        <div className="row">
          {form.form.map((val, i) => (
            <div className="col-6" key={i}>
              <input
                className="form-control mb-2"
                placeholder={`Form ${i + 1}`}
                value={val}
                onChange={(e) => handleArrayChange(e, "form", i)}
              />
            </div>
          ))}
        </div>

        <h6 className="mt-3 text-primary">Odds (Main: 1, X, 2)</h6>
        <div className="row">
          {form.odds.main.map((val, i) => (
            <div className="col-4" key={i}>
              <input
                type="number"
                step="0.01"
                className="form-control mb-2"
                placeholder={["1", "X", "2"][i]}
                value={val}
                onChange={(e) => handleArrayChange(e, "odds", i, "main")}
              />
            </div>
          ))}
        </div>

        <h6 className="mt-3 text-primary">Odds (Double Chance: 1X, 12, X2)</h6>
        <div className="row">
          {form.odds.double.map((val, i) => (
            <div className="col-4" key={i}>
              <input
                type="number"
                step="0.01"
                className="form-control mb-2"
                placeholder={["1X", "12", "X2"][i]}
                value={val}
                onChange={(e) => handleArrayChange(e, "odds", i, "double")}
              />
            </div>
          ))}
        </div>

        <h6 className="mt-3 text-primary">Prediction</h6>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Tip (e.g. 1X)"
              name="tip"
              value={form.tip}
              onChange={handleChange}
            />
          </div>
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Home Stat (%)"
              value={form.stat.home}
              onChange={(e) => handleStatChange(e, "home")}
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Away Stat (%)"
              value={form.stat.away}
              onChange={(e) => handleStatChange(e, "away")}
            />
          </div>
          <div className="col-6 d-flex align-items-center">
            <button
              type="submit"
              className="btn btn-success w-100 fw-bold"
              disabled={loading}
            >
              {loading ? "Adding..." : "➕ Add Serie A Match"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeriaAMatchForm;
