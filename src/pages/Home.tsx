import React, { useEffect, useState } from "react";

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [workoutEntries, setWorkoutEntries] = useState([]);
  const [selectedType, setSelectedType] = useState("prayMorning");
  const [daysToShow, setDaysToShow] = useState(5);

  // Retrieve entries for prayMorning, prayEvening, and coding
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
          setEntries(sortedEntries);
        }
      } catch (error) {
        console.error("Error parsing entries from localStorage:", error);
      }
    }
  }, []);

  // Retrieve workoutEntries for steps
  useEffect(() => {
    const storedWorkoutEntries = localStorage.getItem("workoutEntries");
    if (storedWorkoutEntries) {
      try {
        const parsedWorkoutEntries = JSON.parse(storedWorkoutEntries);
        if (Array.isArray(parsedWorkoutEntries)) {
          // Sort workoutEntries by date descending (newest first)
          const sortedWorkoutEntries = parsedWorkoutEntries.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setWorkoutEntries(sortedWorkoutEntries);
        }
      } catch (error) {
        console.error("Error parsing workoutEntries from localStorage:", error);
      }
    }
  }, []);

  // Select the appropriate data source based on selectedType
  let displayedValues = [];
  if (selectedType === "steps") {
    displayedValues = workoutEntries.slice(0, daysToShow).map((entry) => entry.steps);
  } else {
    displayedValues = entries.slice(0, daysToShow).map((entry) => {
      const value = entry[selectedType];
      if (typeof value === "boolean") {
        return value ? "yes" : "no";
      }
      return value;
    });
  }

  // Determine the display title based on the selected type
  let displayTitle = "";
  if (selectedType === "prayMorning") displayTitle = "Pray Morning";
  else if (selectedType === "prayEvening") displayTitle = "Pray Evening";
  else if (selectedType === "coding") displayTitle = "Coding";
  else if (selectedType === "steps") displayTitle = "Steps";

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

  const controlsStyle = {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  };

  const labelStyle = {
    fontSize: "16px",
    color: "#333",
  };

  const selectStyle = {
    marginLeft: "10px",
    padding: "8px",
    fontSize: "16px",
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
      <div style={controlsStyle}>
        <label style={labelStyle}>
          Select Data:
          <select
            style={selectStyle}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="prayMorning">Pray Morning</option>
            <option value="prayEvening">Pray Evening</option>
            <option value="coding">Coding</option>
            <option value="steps">Steps</option>
          </select>
        </label>
        <label style={labelStyle}>
          Select Number of Days:
          <select
            style={selectStyle}
            value={daysToShow}
            onChange={(e) => setDaysToShow(parseInt(e.target.value, 10))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
      <div style={sectionStyle}>
        <h2 style={titleStyle}>{displayTitle}</h2>
        <div>
          {displayedValues.map((value, index) => (
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
