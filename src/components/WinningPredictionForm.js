import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = "http://localhost:5000/winning-predictions";

const WinningPredictionForm = () => {
  const [newMatch, setNewMatch] = useState({
    date: "",
    league: "",
    home: "",
    away: "",
    tip: "",
    score: "",
    odd: "",
    outcome: ""
  });

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // if editing
  const navigate = useNavigate();

  // ✅ Load match if editing
  useEffect(() => {
    if (id) {
      fetch(`${API}`)
        .then((res) => res.json())
        .then((data) => {
          const match = data.find((m) => String(m.id) === String(id));
          if (match) setNewMatch(match);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => {
    setNewMatch({ ...newMatch, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = id ? "PUT" : "POST";
    const url = id ? `${API}/${id}` : API;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMatch),
    })
      .then((res) => res.json())
      .then(() => navigate("/winning-predictions")) // go back to list
      .catch(console.error);
  };

  return (
    <div>
      <h4 className="mb-3">{id ? "Edit Prediction" : "Add New Prediction"}</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="g-2">
          <Col>
            <Form.Control
              required
              name="date"
              placeholder="Date"
              value={newMatch.date}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              required
              name="league"
              placeholder="League"
              value={newMatch.league}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              required
              name="home"
              placeholder="Home Team"
              value={newMatch.home}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              required
              name="away"
              placeholder="Away Team"
              value={newMatch.away}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="g-2 mt-2">
          <Col>
            <Form.Control
              name="tip"
              placeholder="Tip"
              value={newMatch.tip}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              name="score"
              placeholder="Score"
              value={newMatch.score}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              name="odd"
              placeholder="Odd"
              value={newMatch.odd}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              name="outcome"
              placeholder="Outcome"
              value={newMatch.outcome}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="d-flex gap-2 mt-3">
          <Button type="submit" variant="primary">
            {id ? "Save Changes" : "Add Prediction"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/winning-predictions")}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WinningPredictionForm;
