import React, { useEffect, useState } from "react";

const Home = () => {
  const [last5PrayMorning, setLast5PrayMorning] = useState([]);
  const [last5PrayEvening, setLast5PrayEvening] = useState([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem("entries");
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries)) {
          // Sort entries by date descending (newest first)
          const sortedEntries = parsedEntries.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          // Take the latest 5 entries
          const last5Entries = sortedEntries.slice(0, 5);
          // Map prayMorning and prayEvening booleans to "yes" or "no"
          const prayMorningValues = last5Entries.map((entry) =>
            entry.prayMorning ? "yes" : "no"
          );
          const prayEveningValues = last5Entries.map((entry) =>
            entry.prayEvening ? "yes" : "no"
          );
          setLast5PrayMorning(prayMorningValues);
          setLast5PrayEvening(prayEveningValues);
        }
      } catch (error) {
        console.error("Error parsing entries from localStorage:", error);
      }
    }
  }, []);

  // Inline style objects
  const containerStyle = {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const headerStyle = {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  };

  const sectionStyle = {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#555",
  };

  const spanStyle = {
    display: "inline-block",
    marginRight: "10px",
    padding: "5px 10px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    fontSize: "16px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Statistics</h1>
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Pray Morning</h2>
        <div>
          {last5PrayMorning.map((value, index) => (
            <span key={index} style={spanStyle}>
              {value}
            </span>
          ))}
        </div>
      </div>
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Pray Evening</h2>
        <div>
          {last5PrayEvening.map((value, index) => (
            <span key={index} style={spanStyle}>
              {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
