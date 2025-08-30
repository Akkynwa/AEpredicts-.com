import React from "react";
import { Navbar, Nav, Container, Button, Dropdown} from "react-bootstrap";
import DateNav from "../../components/DateNav";

const HeroSection = () => {
  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar className="mx-auto" expand="lg" style={{ fontSize:"0.7rem" , background: "linear-gradient(180deg, #0b2a1a, #000000)"}}>
        <Container fluid>
          <Nav className="me-auto">
            <Nav.Link href="#predictions" style={{ color: "white" }}>
              Today's Predictions
            </Nav.Link>
            <Nav.Link href="#epl" style={{ color: "white" }}>
              England Premier League
            </Nav.Link>
            <Nav.Link href="#laliga" style={{ color: "white" }}>
              Spain La Liga
            </Nav.Link>
            <Nav.Link href="#bundesliga" style={{ color: "white" }}>
              Germany Bundesliga
            </Nav.Link>
            <Nav.Link href="#seriea" style={{ color: "white" }}>
              Italy Serie A
            </Nav.Link>
            <Nav.Link href="#ligue1" style={{ color: "white" }}>
              France Ligue 1
            </Nav.Link>
          </Nav>

          {/* Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="dark" style={{fontSize:"0.8rem"}}>Select A League</Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item href="#league1">League 1</Dropdown.Item>
              <Dropdown.Item href="#league2">League 2</Dropdown.Item>
              <Dropdown.Item href="#league3">League 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div
        style={{
        background: "linear-gradient(180deg, #0a1c54,#073cc2)",
          textAlign: "center",
          padding: "3rem 1rem",
          color: "white",
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>SURE FOOTBALL BETTING TIPS</h2>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Button variant="outline-info" size="sm">
            ⚽ Live Sports betting 
          </Button>
          <Button variant="outline-primary" size="sm">
            📱 Premium football betting tips
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <DateNav />
    </div>
  );
};

export default HeroSection;
