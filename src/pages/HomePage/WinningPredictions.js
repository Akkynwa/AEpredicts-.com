import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/winning-predictions";

const WinningPredictions = () => {
  const [matches, setMatches] = useState([]);

  // ✅ Load all predictions
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch(console.error);
  }, []);

  // ✅ Delete prediction
  const handleDelete = (id) => {
    if (!window.confirm("Delete this prediction?")) return;

    fetch(`${API}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => setMatches(data)) // updated list returned
      .catch(console.error);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Latest Winning Predictions</h3>
        <Link to="/winning-predictions/new" className="btn btn-success">
          ➕ Add Prediction
        </Link>
      </div>

      <Table bordered hover responsive striped>
        <thead className="table-success">
          <tr>
            <th>Date</th>
            <th>League</th>
            <th>Home</th>
            <th>Away</th>
            <th>Tip</th>
            <th>Score</th>
            <th>Odd</th>
            <th>Outcome</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{match.date}</td>
              <td>{match.league}</td>
              <td>{match.home}</td>
              <td>{match.away}</td>
              <td>{match.tip}</td>
              <td>{match.score}</td>
              <td>{match.odd}</td>
              <td>{match.outcome}</td>
              <td>
                <div className="d-flex gap-2">
                  <Link
                    to={`/winning-predictions/edit?id=${match.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </Link>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(match.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default WinningPredictions;
