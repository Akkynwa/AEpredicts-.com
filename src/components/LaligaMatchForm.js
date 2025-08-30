// src/components/LaligaMatchForm.jsx
import React, { useState } from "react";

const LaligaMatchForm = ({ onAdded }) => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    home: "",
    away: "",
    tip: "",
    ou: "",
    h2h: "",
    form: "",
    oddsMain: "",
    oddsDouble: "",
    statHome: "",
    statAway: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/laliga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date, // <-- important for grouping later
          time: form.time,
          home: form.home,
          away: form.away,
          tip: form.tip,
          ou: form.ou,
          h2h: form.h2h.split(","), // convert "1,0,1" into array
          form: form.form.split(","), // convert "W,L,D" into array
          odds: {
            main: form.oddsMain.split(","),   // "1.5,2.0,3.0"
            double: form.oddsDouble.split(",") // "1X,12,X2"
          },
          stat: {
            home: form.statHome,
            away: form.statAway
          }
        }),
      });

      onAdded(); // notify admin
      setForm({
        date: "",
        time: "",
        home: "",
        away: "",
        tip: "",
        ou: "",
        h2h: "",
        form: "",
        oddsMain: "",
        oddsDouble: "",
        statHome: "",
        statAway: ""
      });
    } catch (err) {
      console.error("Error adding La Liga match:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <div className="mb-2">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-2">
        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-2">
        <label>Home Team:</label>
        <input
          type="text"
          name="home"
          value={form.home}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-2">
        <label>Away Team:</label>
        <input
          type="text"
          name="away"
          value={form.away}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-2">
        <label>Tip:</label>
        <input
          type="text"
          name="tip"
          value={form.tip}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-2">
        <label>Over/Under:</label>
        <input
          type="text"
          name="ou"
          value={form.ou}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-2">
        <label>H2H (comma separated):</label>
        <input
          type="text"
          name="h2h"
          value={form.h2h}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. 1,0,1"
        />
      </div>

      <div className="mb-2">
        <label>Form (comma separated W/L/D):</label>
        <input
          type="text"
          name="form"
          value={form.form}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. W,L,D"
        />
      </div>

      <div className="mb-2">
        <label>Main Odds (comma separated):</label>
        <input
          type="text"
          name="oddsMain"
          value={form.oddsMain}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. 1.50,2.30,3.10"
        />
      </div>

      <div className="mb-2">
        <label>Double Chance Odds (comma separated):</label>
        <input
          type="text"
          name="oddsDouble"
          value={form.oddsDouble}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. 1X,12,X2"
        />
      </div>

      <div className="mb-2">
        <label>Home Stat:</label>
        <input
          type="text"
          name="statHome"
          value={form.statHome}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-2">
        <label>Away Stat:</label>
        <input
          type="text"
          name="statAway"
          value={form.statAway}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Add La Liga Match
      </button>
    </form>
  );
};

export default LaligaMatchForm;
