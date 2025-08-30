// src/pages/MatchForm.jsx
import React from "react";
import { Card, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { Clock, Trophy, BarChart, Lightning, GraphUp, Dice5 } from "react-bootstrap-icons";

export default function MatchForm({ form, isEditing, saving, handleChange, handleArrayChange, handleStatChange, resetForm, saveDraft, publishNow, saveEdit }) {
  return (
    <Row className="g-4">
      {/* FORM */}
      <Col md={6}>
        <Card>
          <Card.Header>
            {isEditing ? "Edit Match" : "Add New Match"}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={(e) => { 
              e.preventDefault(); 
              isEditing ? saveEdit() : saveDraft(); 
            }}>
              {/* Inputs... same as you already have */}
              <Row className="g-2">
                <Col md={6}>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
                </Col>
                <Col md={6}>
                  <Form.Label>Time</Form.Label>
                  <Form.Control name="time" value={form.time} onChange={handleChange} required />
                </Col>
              </Row>

              <Row className="g-2 mt-2">
                <Col md={6}><Form.Control name="home" placeholder="Home Team" value={form.home} onChange={handleChange} /></Col>
                <Col md={6}><Form.Control name="away" placeholder="Away Team" value={form.away} onChange={handleChange} /></Col>
              </Row>

              {/* Buttons */}
              <div className="d-flex gap-2 mt-3">
                <Button type="submit" variant={isEditing ? "warning" : "secondary"} disabled={saving}>
                  {isEditing ? (saving ? "Saving..." : "Save Changes") : (saving ? "Saving Draft..." : "Save to Drafts")}
                </Button>
                {!isEditing && (
                  <Button type="button" onClick={publishNow} disabled={saving}>
                    {saving ? "Publishing..." : "Publish Now"}
                  </Button>
                )}
                <Button type="button" variant="outline-secondary" onClick={resetForm}>Reset</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* PREVIEW */}
      <Col md={6}>
        <Card>
          <Card.Header>
            Spanish La Liga — Preview <Badge bg="dark">1</Badge>
          </Card.Header>
          <Card.Body>
            <Row className="text-center">
              <Col>{form.date || "YYYY-MM-DD"}</Col>
              <Col>{form.time || "--:--"}</Col>
              <Col>{form.home || "Home"} vs {form.away || "Away"}</Col>
              <Col><Button size="sm">{form.tip || "Tip"}</Button></Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
