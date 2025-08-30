import React from "react";
import { Navbar, Nav, Container} from "react-bootstrap";
import { Cart, Moon } from "react-bootstrap-icons";
import { useCart } from "../pages/HomePage/CartContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { cart } = useCart();

  return (
    <Navbar
      expand="lg"
      style={{
        background: "linear-gradient(180deg, #0a1c54,#073cc2)",
        padding: "0.4rem 1rem",
      }}
      variant="dark"
    >
      <Container fluid>
        {/* Logo & Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          style={{ color: "white", fontWeight: "600", fontSize: "0.95rem" }}
        >
          <img
            alt="logo"
            src="https://i.supaimg.com/835ad601-ef5b-449b-a354-5cab625e4841.png"
            style={{
              marginRight: "8px",
              width: "32px",
              height: "32px",
              objectFit: "contain",
            }}
          />
          AEpredicts.com
        </Navbar.Brand>

        {/* Collapse Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto" style={{ fontSize: "0.85rem" }}>
            <Nav.Link as={Link} to="/" style={{ color: "white" }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/" style={{ color: "white" }}>
              Football
            </Nav.Link>
            <Nav.Link as={Link} to="/basketball" style={{ color: "white" }}>
              Basketball
            </Nav.Link>
            <Nav.Link as={Link} to="/hockey" style={{ color: "white" }}>
              Hockey
            </Nav.Link>
          </Nav>

          {/* Icons & Actions */}
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center text-white">
              <Cart size={18} />
              <span className="ms-1" style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                Bet Slip ({cart.length})
              </span>
            </Nav.Link>
            <Nav.Link href="#dark" style={{ color: "white" }}>
              <Moon size={18} />
            </Nav.Link>
            <Link to="/add" className="btn btn-sm btn-outline-light">
              Latest Winning
            </Link>
            <Link to="/admin" className="btn btn-sm btn-outline-light">
              Admin
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
