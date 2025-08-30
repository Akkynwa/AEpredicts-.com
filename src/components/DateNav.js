import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const DateNav = () => {
  // Helper function to format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Get today's date
  const today = new Date();

  // Previous day (yesterday), today, and next 2 days
  const dates = [
    new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // yesterday
    today,
    new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
  ];

  return (
    <Container
      fluid
      style={{
        background: "linear-gradient(0deg, #0a1c54,#073cc2)",
        color: "white",
        fontSize: "0.9rem",
      }}
    >
      <Row className="text-center py-2">
        {dates.map((date, index) => (
          <Col key={index}>
            {date.toDateString() === today.toDateString() ? (
              <Button variant="dark" size="sm">
                All Prediction's Today ({formatDate(date)})
              </Button>
            ) : (
              formatDate(date)
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DateNav;
