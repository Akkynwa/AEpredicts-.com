import React, { useState } from "react";
import { Container, Card, Button, ListGroup, Modal } from "react-bootstrap";
import { useCart } from "../pages/HomePage/CartContext";
import jsPDF from "jspdf";

// Helper: convert an image URL to a Data URL so jsPDF can embed it safely
const toDataURL = async (url) => {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const BetSlip = () => {
  const { cart, removePick, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Put your real logo URL (or import a local image and use it directly)
  const logoUrl = "https://via.placeholder.com/240x72.png?text=Fulltime+Predict";

  const generatePDF = async () => {
    setDownloading(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // Try to load the logo as a DataURL
      let y = 12;
      try {
        const dataUrl = await toDataURL(logoUrl);
        // Center the logo
        const logoW = 60; // mm
        const logoH = 18; // mm
        const xCentered = (pageWidth - logoW) / 2;
        doc.addImage(dataUrl, "PNG", xCentered, y, logoW, logoH);
        y += logoH + 6;
      } catch {
        // Fallback: text title if logo fails to load
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Bet-Predict", pageWidth / 2, y + 6, { align: "center" });
        y += 18;
      }

      // Title + date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Bet Slip Receipt", pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const when = new Date().toLocaleString();
      doc.text(`Generated on: ${when}`, pageWidth / 2, y, { align: "center" });
      y += 6;

      // Divider
      doc.setDrawColor(200);
      doc.line(20, y, pageWidth - 20, y);
      y += 8;

      // Header row
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Match", 20, y);
      doc.text("Type", pageWidth - 70, y);
      doc.text("Pick", pageWidth - 30, y);
      y += 6;
      doc.setDrawColor(230);
      doc.line(20, y, pageWidth - 20, y);
      y += 6;

      // Items
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lineHeight = 6;

      cart.forEach((pick, idx) => {
        // Wrap long match names
        const matchLines = doc.splitTextToSize(`${idx + 1}. ${pick.match}`, pageWidth - 110);
        // Match
        doc.text(matchLines, 20, y);
        // Type & Pick aligned to right columns
        doc.text(String(pick.type), pageWidth - 70, y);
        doc.text(String(pick.value), pageWidth - 30, y);

        // Move Y by the tallest block
        y += Math.max(matchLines.length * lineHeight, lineHeight);

        // Add page if reaching bottom
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      // Footer thanks
      y += 10;
      doc.setDrawColor(200);
      doc.line(20, y, pageWidth - 20, y);
      y += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Thank you for using Bet-Predict", pageWidth / 2, y, { align: "center" });

      doc.save("BetSlip.pdf");
    } catch (e) {
      console.error(e);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="fw-bold">AE-Slip ({cart.length})</Card.Header>

        <ListGroup variant="flush">
          {cart.map((pick, idx) => (
            <ListGroup.Item
              key={idx}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{pick.match}</strong> <br />
                {pick.type}: {pick.value}
              </div>
              <Button variant="danger" size="sm" onClick={() => removePick(idx)}>
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {cart.length > 0 && (
          <Card.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={clearCart}>
              Clear
            </Button>
            <Button variant="success" onClick={handleShow}>
              Place Bet
            </Button>
          </Card.Footer>
        )}
      </Card>

      {/* Receipt Preview Modal */}
      <Modal show={showModal} onHide={handleClose} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>AE Slip Preview</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Preview card styled like a receipt */}
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div className="text-center mb-2">
              <img
                src={logoUrl}
                alt="Company Logo"
                style={{ maxWidth: 220, height: "auto" }}
              />
            </div>
            <div className="text-center text-muted" style={{ fontSize: "0.9rem" }}>
              {new Date().toLocaleString()}
            </div>

            <hr />

            <ListGroup>
              {cart.map((pick, idx) => (
                <ListGroup.Item key={idx}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{idx + 1}. {pick.match}</strong>
                      <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                        {pick.type}
                      </div>
                    </div>
                    <div className="fw-bold">{pick.value}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="text-center mt-3 fw-bold text-success">
              Thank you for using AEPredicts.com
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={generatePDF} disabled={downloading}>
            {downloading ? "Preparing..." : "Download Receipt"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BetSlip;
