import { useState, useEffect } from "react";
import { challengeService } from "../services/challengeService";

export function useChallengeFilters() {
  const [language, setLanguage] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    challengeService
      .getAll({ language, difficulty, search })
      .then((data) => setResults(data.items))
      .catch(() => setError("Failed to load challenges."))
      .finally(() => setLoading(false));
  }, [language, difficulty, search]);

  return {
    language,
    difficulty,
    search,
    setLanguage,
    setDifficulty,
    setSearch,
    results,
    loading,
    error,
  };
}