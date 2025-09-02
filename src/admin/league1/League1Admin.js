import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Form } from "react-bootstrap";
import { Clock, Trophy, BarChart, Lightning, GraphUp, Dice5 } from "react-bootstrap-icons";

const API_BASE = process.env.REACT_APP_API_URL;
const API_PUBLISHED = `${API_BASE}/league1`;
const API_DRAFTS = `${API_BASE}/drafts`;

const DEFAULT_MATCH = {
  date: "",
  time: "",
  home: "",
  away: "",
  h2h: ["", "", "", "", "", ""],
  form: ["", "", "", "", "", ""],
  odds: { main: ["", "", ""], double: ["", "", ""] },
  tip: "",
  stat: { home: "", away: "" },
  ou: "",
};

export default function League1Admin() {

  const [form, setForm] = useState(DEFAULT_MATCH);
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // edit state
  const [editTarget, setEditTarget] = useState(null); // {source: "draft"|"published", id: number}
  const isEditing = !!editTarget;

  // --- Fetch helpers ---
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [pubRes, draftRes] = await Promise.all([fetch(API_PUBLISHED), fetch(API_DRAFTS)]);
      const pubData = await pubRes.json();
      const draftData = await draftRes.json();
      setPublished(Array.isArray(pubData) ? pubData : []);
      setDrafts(Array.isArray(draftData) ? draftData : []);
    } catch (e) {
      console.error("Fetch error:", e);
      setPublished([]);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  
const handleSaveDraft = async (e) => {
  e.preventDefault();
  await fetch("API_DRAFTS", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      league: "league1",   // so we know which league later
      ...DEFAULT_MATCH,
    }),
  });
  alert("Draft saved successfully!");
};
  // --- Form handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleArrayChange = (field, idx, value, subfield) => {
    if (field === "odds") {
      setForm((f) => ({
        ...f,
        odds: {
          ...f.odds,
          [subfield]: f.odds[subfield].map((v, i) => (i === idx ? value : v)),
        },
      }));
    } else {
      setForm((f) => ({
        ...f,
        [field]: f[field].map((v, i) => (i === idx ? value : v)),
      }));
    }
  };

  const handleStatChange = (team, value) => {
    setForm((f) => ({ ...f, stat: { ...f.stat, [team]: value } }));
  };

  const resetForm = () => {
    setForm(DEFAULT_MATCH);
    setEditTarget(null);
  };

  // --- Save / Publish / Edit / Delete ---
  const saveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(API_DRAFTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save draft");
      await fetchAll();
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Could not save draft.");
    } finally {
      setSaving(false);
    }
  };

  const publishNow = async () => {
    setSaving(true);
    try {
      const payload = normalizeForSave(form);
      const res = await fetch(API_PUBLISHED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to publish");
      await fetchAll();
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Could not publish match.");
    } finally {
      setSaving(false);
    }
  };

  const publishDraft = async (draft) => {
    try {
      // send to published
      const payload = normalizeForSave(draft);
      const pubRes = await fetch(API_PUBLISHED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!pubRes.ok) throw new Error("Publish failed");

      // delete draft
      await fetch(`${API_DRAFTS}/${draft.id}`, { method: "DELETE" });

      await fetchAll();
    } catch (e) {
      console.error(e);
      alert("Could not publish draft.");
    }
  };

  const deleteDraft = async (id) => {
    if (!window.confirm("Delete this draft?")) return;
    await fetch(`${API_DRAFTS}/${id}`, { method: "DELETE" });
    await fetchAll();
  };

  const deletePublished = async (id) => {
    if (!window.confirm("Delete this published match?")) return;
    await fetch(`${API_PUBLISHED}/${id}`, { method: "DELETE" });
    await fetchAll();
  };

  const startEdit = (item, source) => {
    setForm(stripId(item));
    setEditTarget({ source, id: item.id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const targetApi = editTarget.source === "published" ? API_PUBLISHED : API_DRAFTS;
      const payload = normalizeForSave(form);

      const res = await fetch(`${targetApi}/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      await fetchAll();
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  // --- Helpers to keep data clean ---
  const normalizeForSave = (m) => {
    // Convert numeric strings in odds to numbers if possible
    const toNum = (v) => (v === "" ? "" : isNaN(Number(v)) ? v : Number(v));
    return {
      ...m,
      odds: {
        main: m.odds.main.map(toNum),
        double: m.odds.double.map(toNum),
      },
    };
  };

  const stripId = (m) => {
    const { id, ...rest } = m;
    return rest;
  };

  // --- Live preview card ---
  const headers = useMemo(
    () => [
      { label: "Time", icon: <Clock /> },
      { label: "Fixture", icon: <Trophy /> },
      { label: "H2H", icon: <BarChart /> },
      { label: "Form", icon: <GraphUp /> },
      { label: "Odds", icon: <Dice5 /> },
      { label: "Tip", icon: <Lightning /> },
      { label: "Stat", icon: <BarChart /> },
      { label: "O/U", icon: <GraphUp /> },
    ],
    []
  );

  return (
    <Container className="py-4">
      <h2 className="mb-3">Admin • League 1</h2>

      {/* FORM + PREVIEW */}
      <Row className="g-4">
        <Col md={6}>
          <Card style={{ borderRadius: 12, overflow: "hidden", background: "#f9fbff" }}>
            <Card.Header className="d-flex align-items-center gap-2" style={{ background: "#102a43", color: "white" }}>
              <img
                src="https://flagcdn.com/w20/fr.png"
                alt="FR"
                style={{ width: 24, height: 16, borderRadius: 2 }}
              />
              <strong>{isEditing ? "Edit Match" : "Add New Match"}</strong>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  isEditing ? saveEdit() : saveDraft();
                }}
              >
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Time (HH:mm)</Form.Label>
                    <Form.Control
                      placeholder="14:30"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Home</Form.Label>
                    <Form.Control name="home" value={form.home} onChange={handleChange} required />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Away</Form.Label>
                    <Form.Control name="away" value={form.away} onChange={handleChange} required />
                  </Col>
                </Row>

                <hr />

                <Form.Label>H2H (last 6)</Form.Label>
                <Row className="g-2">
                  {form.h2h.map((v, i) => (
                    <Col xs={4} md={2} key={`h2h-${i}`}>
                      <Form.Control
                        placeholder={`H${i + 1}`}
                        value={v}
                        onChange={(e) => handleArrayChange("h2h", i, e.target.value)}
                      />
                    </Col>
                  ))}
                </Row>

                <Form.Label className="mt-3">Form (last 6) — W/D/L</Form.Label>
                <Row className="g-2">
                  {form.form.map((v, i) => (
                    <Col xs={4} md={2} key={`form-${i}`}>
                      <Form.Control
                        placeholder={`F${i + 1}`}
                        value={v}
                        onChange={(e) => handleArrayChange("form", i, e.target.value)}
                      />
                    </Col>
                  ))}
                </Row>

                <Row className="g-2 mt-3">
                  <Col md={6}>
                    <Form.Label>Main Odds (1, X, 2)</Form.Label>
                    {["1", "X", "2"].map((lbl, i) => (
                      <Form.Control
                        key={`main-${i}`}
                        className="mb-2"
                        placeholder={lbl}
                        value={form.odds.main[i]}
                        onChange={(e) => handleArrayChange("odds", i, e.target.value, "main")}
                      />
                    ))}
                  </Col>
                  <Col md={6}>
                    <Form.Label>Double Chance (1X, 12, X2)</Form.Label>
                    {["1X", "12", "X2"].map((lbl, i) => (
                      <Form.Control
                        key={`double-${i}`}
                        className="mb-2"
                        placeholder={lbl}
                        value={form.odds.double[i]}
                        onChange={(e) => handleArrayChange("odds", i, e.target.value, "double")}
                      />
                    ))}
                  </Col>
                </Row>

                <Row className="g-2 mt-2">
                  <Col md={6}>
                    <Form.Label>Tip</Form.Label>
                    <Form.Control name="tip" value={form.tip} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>O/U (e.g. un3.5)</Form.Label>
                    <Form.Control name="ou" value={form.ou} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Home Stat (%)</Form.Label>
                    <Form.Control
                      placeholder="45%"
                      value={form.stat.home}
                      onChange={(e) => handleStatChange("home", e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Away Stat (%)</Form.Label>
                    <Form.Control
                      placeholder="55%"
                      value={form.stat.away}
                      onChange={(e) => handleStatChange("away", e.target.value)}
                    />
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-3">
                  <Button type="submit"  onClick={handleSaveDraft} disabled={saving} variant={isEditing ? "warning" : "secondary"}>
                    {isEditing ? (saving ? "Saving..." : "Save Changes") : (saving ? "Saving Draft..." : "Save to Drafts")}
                  </Button>
                  {!isEditing && (
                    <Button type="button" disabled={saving} onClick={publishNow}>
                      {saving ? "Publishing..." : "Publish Now"}
                    </Button>
                  )}
                  <Button type="button" variant="outline-secondary" onClick={resetForm}>
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* LIVE PREVIEW */}
        <Col md={6}>
          <Card style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.08)" }}>
            <Card.Header
              style={{
                background: "linear-gradient(90deg, #003366, #004b8d)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <img src="https://flagcdn.com/w20/fr.png" alt="flag" style={{ width: 24, height: 16 }} />
                French League 1 — Preview
              </div>
              <Badge bg="dark">1 Match</Badge>
            </Card.Header>

            <Card.Body>
              {/* header row */}
              <Row className="text-center fw-bold mb-2" style={{ fontSize: "0.85rem", borderBottom: "1px solid #eee" }}>
                {headers.map((h, i) => (
                  <Col
                    xs={["Time", "Fixture", "Tip", "O/U"].includes(h.label) ? 3 : 0}
                    md={i === 1 ? 2 : 1}
                    key={i}
                    className={["Time", "Fixture", "Tip", "O/U"].includes(h.label) ? "" : "d-none d-md-block"}
                  >
                    {h.icon} {h.label}
                  </Col>
                ))}
              </Row>

              {/* one preview row */}
              <Row className="text-center align-items-center py-2" style={{ fontSize: "0.9rem", borderBottom: "1px solid #f1f1f1" }}>
                <Col xs={3} md={1}>
                  <div style={{ fontSize: 11, color: "#667" }}>{form.date || "YYYY-MM-DD"}</div>
                  <strong>{form.time || "--:--"}</strong>
                </Col>

                <Col xs={3} md={2}>
                  <div>{form.home || "Home"}</div>
                  <div style={{ fontWeight: "bold" }}>VS</div>
                  <div>{form.away || "Away"}</div>
                </Col>

                <Col xs={0} md={2} className="d-none d-md-block">
                  <div className="d-flex justify-content-center gap-1">
                    {form.h2h.map((num, i) => (
                      <div
                        key={i}
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#e3f2fd",
                          fontSize: "0.7rem",
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {num || "-"}
                      </div>
                    ))}
                  </div>
                </Col>

                <Col xs={0} md={2} className="d-none d-md-block">
                  <div className="d-flex justify-content-center gap-1">
                    {form.form.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          color: f === "W" ? "green" : f === "L" ? "red" : "#999",
                          fontWeight: "bold",
                        }}
                      >
                        {f || "-"}
                      </span>
                    ))}
                  </div>
                </Col>

                <Col xs={0} md={2} className="d-none d-md-block">
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center gap-2">
                      {form.odds.main.map((odd, i) => (
                        <span key={i}>{odd || "-"}</span>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center gap-2">
                      {form.odds.double.map((odd, i) => (
                        <span key={i}>{odd || "-"}</span>
                      ))}
                    </div>
                  </div>
                </Col>

                <Col xs={3} md={1}>
                  <Button size="sm" variant="primary">{form.tip || "Tip"}</Button>
                </Col>

                <Col xs={0} md={1} className="d-none d-md-block">
                  <div style={{ backgroundColor: "#e8f5e9", color: "green", fontSize: "0.75rem", borderRadius: 6, padding: 4 }}>
                    Home {form.stat.home || "-"}
                  </div>
                  <div style={{ backgroundColor: "#e8f5e9", color: "green", fontSize: "0.75rem", borderRadius: 6, padding: 4 }}>
                    Away {form.stat.away || "-"}
                  </div>
                </Col>

                <Col xs={3} md={1}>
                  <div style={{ backgroundColor: "#f3e5f5", color: "purple", fontSize: "0.75rem", borderRadius: 6, padding: 4 }}>
                    O/U <br /> {form.ou || "-"}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* DRAFTS & PUBLISHED */}
      <Row className="g-4 mt-2">
        <Col md={6}>
          <Card style={{ borderRadius: 12 }}>
            <Card.Header className="d-flex align-items-center gap-2">
              <strong>Drafts</strong>
              <Badge bg="secondary">{drafts.length}</Badge>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div>Loading drafts…</div>
              ) : drafts.length === 0 ? (
                <div>No drafts yet.</div>
              ) : (
                drafts.map((d) => (
                  <Card key={d.id} className="mb-2 p-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div style={{ fontSize: 12, color: "#667" }}>{d.date} {d.time}</div>
                        <strong>{d.home}</strong> vs <strong>{d.away}</strong>
                      </div>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="success" onClick={() => publishDraft(d)}>
                          Publish
                        </Button>
                        <Button size="sm" variant="warning" onClick={() => startEdit(d, "draft")}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => deleteDraft(d.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card style={{ borderRadius: 12 }}>
            <Card.Header className="d-flex align-items-center gap-2">
              <strong>Published</strong>
              <Badge bg="dark">{published.length}</Badge>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div>Loading matches…</div>
              ) : published.length === 0 ? (
                <div>No published matches.</div>
              ) : (
                published.map((m) => (
                  <Card key={m.id} className="mb-2 p-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div style={{ fontSize: 12, color: "#667" }}>{m.date} {m.time}</div>
                        <strong>{m.home}</strong> vs <strong>{m.away}</strong> &nbsp; • Tip: <em>{m.tip}</em> • O/U: <em>{m.ou}</em>
                      </div>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="warning" onClick={() => startEdit(m, "published")}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => deletePublished(m.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}