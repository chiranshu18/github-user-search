import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Search.css";
import { FaGithub } from "react-icons/fa";
import { RingLoader } from "react-spinners";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectToProfile = (url) => () => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        handleSearch();
      } else {
        // If the search term is empty, clear the search results
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.github.com/search/users?q=${searchTerm}+in:fullname&sort=followers&order=desc`
      );
      setSearchResults(response.data.items);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <input
        className="search-input"
        autoFocus
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && <p className="error">{error}</p>}

      {searchTerm.length > 0 &&
        (loading ? (
          <RingLoader color={"#3498db"} loading={loading} size={30} />
        ) : searchResults.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="avatar-col">Avatar</th>
                  <th className="user-col">User</th>
                  <th className="avatar-col">Profile</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {searchResults.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td className="avatar-col avatar-col-item">
                        <img
                          className="avatar-img"
                          src={user.avatar_url}
                          alt="avatar"
                        />
                      </td>
                      <td className="user-col user-col-item">{user.login}</td>
                      <td className="avatar-col avatar-col-item">
                        <FaGithub
                          size={25}
                          onClick={redirectToProfile(user.html_url)}
                          className="github-icon"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-results">No results found</p>
        ))}
    </div>
  );
};

export default Search;
