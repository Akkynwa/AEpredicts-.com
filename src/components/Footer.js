import React from "react";
import { Container, Row, Col, Nav, Image } from "react-bootstrap";
import { Facebook, Linkedin, Twitter, Telegram } from "react-bootstrap-icons";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0a1c54, #073cc2)",
        color: "white",
        paddingTop: "3rem",
        paddingBottom: "2rem",
      }}
    >
      <Container>
        {/* Logo + Title */}
        <Row className="mb-4 text-center text-md-start align-items-center">
          <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start align-items-center">
            <Image
              src="https://i.supaimg.com/835ad601-ef5b-449b-a354-5cab625e4841.png" // replace with your logo
              alt="Logo"
              roundedCircle
              style={{
              marginRight: "8px",
              width: "32px",
              height: "32px",
              objectFit: "contain",
            }}
            />
            <h1 className="h3 mb-0 fw-bold">AEpredicts.com</h1>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end mt-3 mt-md-0">
            <div className="bg-success px-3 py-2 rounded d-inline-block">
              <strong>90%+ Win Rate</strong> | Accurate Predictions
            </div>
          </Col>
        </Row>

        {/* Content Sections */}
        <Row className="g-4">
          {/* Quick Links */}
          <Col md={4}>
            <h5 className="mb-3">Quick Links</h5>
            <Nav className="flex-column">
              {[
                ["About Bet-Predict", "#"],
                ["Terms & Conditions", "#"],
                ["Privacy Policy", "#"],
                ["Disclaimer", "#"],
              ].map(([label, link], idx) => (
                <Nav.Link
                  key={idx}
                  href={link}
                  style={{ color: "white", padding: 0, marginBottom: "8px" }}
                >
                  {label}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Contact */}
          <Col md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <p>
              <a
                href="mailto:sfintultech@gmail.com"
                style={{ color: "white", textDecoration: "none" }}
              >
                sfintultech@gmail.com
              </a>
            </p>

            <h5 className="mb-3">Follow Us</h5>
            <p className="mb-0">Stay updated with our latest predictions</p>
          </Col>

          {/* Social Media */}
          <Col md={4} className="text-center text-md-start">
            <h5 className="mb-3">Social Media</h5>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start mb-3">
              <Facebook size={26} />
              <Linkedin size={26} />
              <Twitter size={26} />
              <Telegram size={26} />
            </div>
          </Col>
        </Row>

        {/* Divider */}
        <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Copyright */}
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © {year} AEpredicts.com All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
