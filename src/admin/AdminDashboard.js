import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const sidebarItems = [
    'UI Elements',
    'Form elements',
    'Charts',
    'Tables',
    'Icons',
    'User Pages',
    'Error pages',
    'Documentation',
  ];

  // Sample data - you would replace this with actual data from your backend
  const statCards = [
    {
      title: "epl",
      value: 4006,
      percent: '10.00%',
      days: '30 days',
      bgColor: 'linear-gradient(135deg, #3D195B,rgb(20, 2, 32))', // English Purple
      flag: 'https://flagcdn.com/w40/gb-eng.png',
      route: '/admin/epl',
      publishedMatches: 12,
      liveMatches: 3,
      upcomingMatches: 8
    },
    {
      title: 'laliga',
      value: 61344,
      percent: '22.00%',
      days: '30 days',
      bgColor: 'linear-gradient(135deg, #800000, #2c0909)', // Spanish Red
      flag: 'https://flagcdn.com/w40/es.png',
      route: '/admin/laliga',
      publishedMatches: 15,
      liveMatches: 5,
      upcomingMatches: 10
    },
    {
      title: 'others',
      value: 34040,
      percent: '2.00%',
      days: '30 days',
      bgColor: 'linear-gradient(135deg, #1E90FF, #0047AB)', // European Blue
      flag: 'https://flagcdn.com/w40/eu.png',
      route: '/admin/others',
      publishedMatches: 8,
      liveMatches: 2,
      upcomingMatches: 6
    },
    {
      title: 'bundesliga',
      value: 47033,
      percent: '0.22%',
      days: '30 days',
      bgColor: 'linear-gradient(135deg,#4d0b07, #8B0000)', // German Red/Black
      flag: 'https://flagcdn.com/w40/de.png',
      route: '/admin/bundesliga',
      publishedMatches: 11,
      liveMatches: 4,
      upcomingMatches: 7
    },
    {
      title: 'league1',
      value: 47033,
      percent: '0.22%',
      days: '30 days',
      bgColor: 'linear-gradient(135deg, #0055A4,rgb(3, 47, 102))', // French Blue
      flag: 'https://flagcdn.com/w40/fr.png',
      route: '/admin/league1',
      publishedMatches: 9,
      liveMatches: 1,
      upcomingMatches: 8
    },
    {
      title: 'seriaA',
      value: 47033,
      percent: '0.22%',
      days: '30 days',
      bgColor: 'linear-gradient(180deg,rgb(5, 7, 97),rgb(31, 1, 112))', // Italian Green
      flag: 'https://flagcdn.com/w40/it.png',
      route: '/admin/seriaa',
      publishedMatches: 14,
      liveMatches: 6,
      upcomingMatches: 8
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <Container fluid className="p-0" style={{ minHeight: '100vh', backgroundColor: '#f5f7fb' }}>
      <Row noGutters>
        {/* Sidebar */}
        <Col md={2} style={{ backgroundColor: '#4c3ecf', minHeight: '100vh', color: 'white' }}>
          <h5 className="p-3">Dashboard</h5>
          <ListGroup variant="flush">
            {sidebarItems.map((item, index) => (
              <ListGroup.Item
                key={index}
                style={{ backgroundColor: '#4c3ecf', color: 'white', cursor: 'pointer' }}
              >
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          {/* Header */}
          <Row className="mb-4 align-items-center justify-content-between">
            <Col>
              <h4>Welcome bro</h4>
              <p>
                All systems are running smoothly!{' '}
                <span className="text-primary"></span>
              </p>
            </Col>
            <Col md="auto">
              <Button variant="light">{new Date().toLocaleDateString()}</Button>
            </Col>
          </Row>

          {/* Weather & Image Section */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="p-4">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3>🌤️ 31°C</h3>
                    <p className="mb-0">Chicago, Illinois</p>
                  </div>
                  <img
                    src="https://www.svgrepo.com/show/354141/family-trip.svg"
                    alt="family"
                    height="100"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row>
            {statCards.map((card, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card 
                  style={{ 
                    cursor: 'pointer', 
                    height: '100%',
                    background: card.bgColor,
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleCardClick(card.route)}
                >
                  {/* Flag in top-right corner */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    <img 
                      src={card.flag} 
                      alt={`${card.title} flag`} 
                      style={{ 
                        width: '30px', 
                        height: '20px', 
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>

                  <Card.Body className="p-3">
                    <Card.Title className="text-capitalize mb-2" style={{ fontSize: '1.2rem', paddingRight: '40px' }}>
                      {card.title}
                    </Card.Title>
                    
                    {/* Match Statistics */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Published:</small>
                        <Badge bg="light" text="dark">{card.publishedMatches}</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Live:</small>
                        <Badge bg="danger">{card.liveMatches}</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small>Upcoming:</small>
                        <Badge bg="warning" text="dark">{card.upcomingMatches}</Badge>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Total Value:</span>
                        <h5 className="mb-0">{card.value.toLocaleString()}</h5>
                      </div>
                      <small className="d-block text-end">{card.percent} ({card.days})</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;