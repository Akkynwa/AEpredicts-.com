import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
  Clock,
  Trophy,
  BarChart,
  Lightning,
  GraphUp,
  Dice5,
} from "react-bootstrap-icons";
import { useCart } from "./CartContext";


const BundesligaMatchCard = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addPick } = useCart();

  // Construct the API URL using the environment variable
  // No trailing slash here, it will be added in the fetch call
  const API_BASE_URL = process.env.REACT_APP_API_URL; 

  // Fetch matches from backend
  const fetchMatches = () => {
    setLoading(true);
    // Use the base URL and append the league path
    fetch(`${API_BASE_URL}/bundesliga`) 
      .then((res) => {
        if (!res.ok) {
          // If response is not ok, try to get error message from response body
          return res.text().then(text => { throw new Error(`HTTP error! status: ${res.status}, message: ${text}`) });
        }
        return res.json();
      })
      .then((data) => {
        // Your backend returns an array directly for the league endpoint
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          // Handle cases where the response is not an array (e.g., an error object)
          console.error("Received unexpected data format:", data);
          setMatches([]); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setMatches([]); // Clear matches on error
        setLoading(false);
      });
  };

  useEffect(() => {
    // Ensure the API URL is set before fetching
    if (API_BASE_URL) {
      fetchMatches();
    } else {
      console.error("REACT_APP_API_URL environment variable is not set.");
      setLoading(false); // Stop loading if URL is missing
    }
  }, [API_BASE_URL]); // Re-run if API_BASE_URL changes

  // ... (rest of your component code remains the same)
  // Table Headers
  const headers = [
      { label: "Time", icon: <Clock />, xs: 3, md: 1 },
      { label: "Fixture", icon: <Trophy />, xs: 3, md: 2 },
      { label: "H2H", icon: <BarChart />, xs: 0, md: 2 },
      { label: "Form", icon: <GraphUp />, xs: 0, md: 2 },
      { label: "Odds", icon: <Dice5 />, xs: 0, md: 2 },
      { label: "Tip", icon: <Lightning />, xs: 3, md: 1 },
      { label: "Stat", icon: <BarChart />, xs: 0, md: 1 },
      { label: "O/U", icon: <GraphUp />, xs: 3, md: 1 },
    ];

  // Mobile visible headers
  // const mobileVisible = ["Time", "Fixture", "Tip", "O/U"];

  return (
    <Container fluid className="my-4">
      {loading ? (
        <p>Loading...</p>
      ) : matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <Card
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* League Header */}
          <Card.Header
            style={{
              background: "linear-gradient(180deg, #DA291C, #8B0000)",               
              color: "white",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            padding: "1.9rem 1rem",

            }}
          >
            <div className="d-flex align-items-center gap-2">
              <img
                src="https://flagcdn.com/w20/de.png"
                alt="flag"
                  style={{ width: "24px", height: "16px" }}
                />
              German Bundesliga
            </div>
            <Badge bg="dark">{matches.length} Matches</Badge>
          </Card.Header>

          <Card.Body>
            {/* Table Header */}
            <Row
              className="text-center fw-bold mb-2"
              style={{ fontSize: "0.85rem", borderBottom: "1px solid #eee" }}
            >
              {headers.map((h, i) => (
                <Col
                    key={i}
                    xs={h.xs > 0 ? h.xs : undefined}
                    md={h.md}
                    className={h.xs === 0 ? "d-none d-md-block" : ""}
                  >
                  {h.icon} {h.label}
                </Col>
              ))}
            </Row>

            {/* Matches */}
            {matches.map((m, idx) => (
              <Row
                key={idx}
                className="text-center align-items-center py-2"
                style={{
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {/* Time */}
                <Col xs={3} md={1}>
                  <strong>{m.time}</strong>
                </Col>

                {/* Fixture */}
                <Col xs={3} md={2}>
                  <div>{m.home}</div>
                  <div style={{ fontWeight: "bold" }}>VS</div>
                  <div>{m.away}</div>
                </Col>

                {/* H2H */}
                <Col xs={0} md={2} className="d-none d-md-block">
                  <div className="d-flex justify-content-center gap-1">
                    {m.h2h?.map((num, i) => (
                      <div
                        key={i}
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#e3f2fd",
                          fontSize: "0.7rem",
                          borderRadius: "3px",
                        }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </Col>

                {/* Form */}
                <Col xs={0} md={2} className="d-none d-md-block">
                  <div className="d-flex justify-content-center gap-1">
                    {m.form?.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          color:
                            f === "W" ? "green" : f === "L" ? "red" : "#999",
                          fontWeight: "bold",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </Col>

                {/* Odds */}
                <Col xs={0} md={2} className="d-none d-md-block">
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center gap-2">
                      {m.odds?.main?.map((odd, i) => (
                        <span key={i}>{odd}</span>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center gap-2">
                      {m.odds?.double?.map((odd, i) => (
                        <span key={i}>{odd}</span>
                      ))}
                    </div>
                  </div>
                </Col>

                {/* Tip */}
                <Col xs={3} md={1}>
                  <Button size="sm" variant="primary"
                  onClick={() =>
                    addPick({
                      type: "Tip",
                      match: `${m.home} vs ${m.away}`,
                      value: m.tip,
                    })
                  }>
                    {m.tip}
                  </Button>
                </Col>

                {/* Stat */}
                <Col xs={0} md={1} className="d-none d-md-block">
                  <div
                    style={{
                      backgroundColor: "#e8f5e9",
                      color: "green",
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      padding: "4px",
                    }}
                  >
                    Home {m.stat?.home}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#e8f5e9",
                      color: "green",
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      padding: "4px",
                    }}
                  >
                    Away {m.stat?.away}
                  </div>
                </Col>

                {/* O/U */}
                <Col xs={3} md={1}>
                  <div
                  onClick={() =>
                    addPick({
                      type: "O/U",
                      match: `${m.home} vs ${m.away}`,
                      value: m.ou,
                    })
                  }
                    style={{
                      backgroundColor: "#f3e5f5",
                      color: "purple",
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      padding: "4px",
                    }}
                  >
                    O/U <br /> {m.ou}
                  </div>
                </Col>
              </Row>
            ))}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default BundesligaMatchCard;