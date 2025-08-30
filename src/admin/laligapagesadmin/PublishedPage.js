// src/pages/PublishedPage.jsx
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

export default function PublishedPage({ published, loading, startEdit, deletePublished }) {
  return (
    <Card>
      <Card.Header>
        <strong>Published</strong> <Badge bg="dark">{published.length}</Badge>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div>Loading matches…</div>
        ) : published.length === 0 ? (
          <div>No published matches.</div>
        ) : (
          published.map((m) => (
            <Card key={m.id} className="mb-2 p-2">
              <div className="d-flex justify-content-between">
                <div>
                  {m.date} {m.time} — <strong>{m.home}</strong> vs <strong>{m.away}</strong> (Tip: {m.tip})
                </div>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="warning" onClick={() => startEdit(m, "published")}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => deletePublished(m.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </Card.Body>
    </Card>
  );
}
