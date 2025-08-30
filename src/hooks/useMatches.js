// src/hooks/useMatches.js
import { useState, useEffect } from "react";

const useMatches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("src/data/matches.json")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Error loading matches:", err));
  }, []);

  return matches;
};

export default useMatches;
