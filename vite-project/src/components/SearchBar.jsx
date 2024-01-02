import { useState } from "react";
const SearchBar = ({ setData, setError, setIsLoading }) => {
  const [search, setSearch] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`http://localhost:8080/api/cars?q=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => setError(err.message));
  };
  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for a car"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
