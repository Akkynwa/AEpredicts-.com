import React, { useState } from "react";
import { Form, Button, Col, Card } from "react-bootstrap";

const MatchForm = ({ onAddMatch }) => {
  const [formData, setFormData] = useState({
    time: "",
    home: "",
    away: "",
    tip: "",
    ou: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMatch = {
      ...formData,
      h2h: [0, 0, 0, 0, 0, 0],
      form: ["D", "D", "D", "D", "D", "D"],
      odds: {
        main: [2.00, 3.00, 3.50],
        double: [1.30, 1.40, 1.60],
      },
      stat: { home: "50%", away: "50%" },
    };

    onAddMatch(newMatch);
    setFormData({ time: "", home: "", away: "", tip: "", ou: "" });
  };

  return (
    <Card className="mb-4">
      <Card.Header>Add New Match</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="row g-2">
          <Col md={2}>
            <Form.Control
              placeholder="Time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              placeholder="Home Team"
              name="home"
              value={formData.home}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              placeholder="Away Team"
              name="away"
              value={formData.away}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              placeholder="Tip"
              name="tip"
              value={formData.tip}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              placeholder="O/U"
              name="ou"
              value={formData.ou}
              onChange={handleChange}
            />
          </Col>
          <Col xs="12" className="mt-2">
            <Button type="submit">Add Match</Button>
          </Col>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MatchForm;
