// src/pages/DraftsPage.jsx
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

export default function DraftsPage({ drafts, loading, publishDraft, startEdit, deleteDraft }) {
  return (
    <Card>
      <Card.Header>
        <strong>Drafts</strong> <Badge bg="secondary">{drafts.length}</Badge>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div>Loading drafts…</div>
        ) : drafts.length === 0 ? (
          <div>No drafts yet.</div>
        ) : (
          drafts.map((d) => (
            <Card key={d.id} className="mb-2 p-2">
              <div className="d-flex justify-content-between">
                <div>
                  {d.date} {d.time} — <strong>{d.home}</strong> vs <strong>{d.away}</strong>
                </div>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="success" onClick={() => publishDraft(d)}>Publish</Button>
                  <Button size="sm" variant="warning" onClick={() => startEdit(d, "draft")}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => deleteDraft(d.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </Card.Body>
    </Card>
  );
}
