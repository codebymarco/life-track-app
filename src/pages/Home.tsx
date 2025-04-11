import React, { useEffect, useState } from "react";

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [workoutEntries, setWorkoutEntries] = useState([]);
  const [selectedType, setSelectedType] = useState("prayMorning");
  const [daysToShow, setDaysToShow] = useState(5);
  const [displayData, setDisplayData] = useState([]);

  // Retrieve entries for prayMorning, prayEvening, and coding
  useEffect(() => {
    const storedEntries = localStorage.getItem("entries");
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries)) {
          setEntries(parsedEntries);
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
          setWorkoutEntries(parsedWorkoutEntries);
        }
      } catch (error) {
        console.error("Error parsing workoutEntries from localStorage:", error);
      }
    }
  }, []);

  // Generate display data with placeholders for missing days
  useEffect(() => {
    // Generate array of dates from today backwards
    const generateDateArray = (days) => {
      const dateArray = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dateArray.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      }
      return dateArray;
    };

    // Generate the date array
    const dates = generateDateArray(daysToShow);
    
    // Map dates to values with placeholders for missing days
    const values = dates.map(dateStr => {
      if (selectedType === "steps") {
        // Find workout entry for this date
        const entry = workoutEntries.find(e => e.date.split('T')[0] === dateStr);
        return {
          date: dateStr,
          value: entry ? entry.steps : "—" // Use dash as placeholder
        };
      } else {
        // Find regular entry for this date
        const entry = entries.find(e => e.date.split('T')[0] === dateStr);
        if (!entry) return { date: dateStr, value: "—" }; // Use dash as placeholder
        
        const value = entry[selectedType];
        if (typeof value === "boolean") {
          return { date: dateStr, value: value ? "yes" : "no" };
        }
        return { date: dateStr, value: value || "—" };
      }
    });
    
    setDisplayData(values);
  }, [entries, workoutEntries, selectedType, daysToShow]);

  // Determine the display title based on the selected type
  let displayTitle = "";
  if (selectedType === "prayMorning") displayTitle = "Pray Morning";
  else if (selectedType === "prayEvening") displayTitle = "Pray Evening";
  else if (selectedType === "coding") displayTitle = "Coding";
  else if (selectedType === "sleepTime") displayTitle = "Sleep";
  else if (selectedType === "jelqs") displayTitle = "Jelqs";
  else if (selectedType === "suntime") displayTitle = "Suntime";
  else if (selectedType === "steps") displayTitle = "Steps";
  else if (selectedType === "bookSummary") displayTitle = "Book Summary";

  // Function to get value color based on type
  const getValueColor = (value) => {
    if (value === "yes") return "#4CAF50"; // Green for positive
    if (value === "no") return "#F44336"; // Red for negative
    if (value === "—") return "#E0E0E0"; // Light gray for placeholders
    
    // For numeric values in steps, sleep time etc.
    if (!isNaN(value)) {
      const num = Number(value);
      
      // For steps (assuming goal is 10000)
      if (selectedType === "steps") {
        if (num >= 10000) return "#4CAF50"; // Green for goal achieved
        if (num >= 7500) return "#FFC107"; // Yellow/amber for close
        return "#F44336"; // Red for low
      }

      // For steps (assuming goal is 10000)
      if (selectedType === "workoutTime") {
        if (num >= 10000) return "#4CAF50"; // Green for goal achieved
        if (num >= 7500) return "#FFC107"; // Yellow/amber for close
        return "#F44336"; // Red for low
      }
      
      // For sleep time (assuming 7-8 hours is ideal)
      if (selectedType === "sleepTime") {
        if (num >= 7 && num <= 9) return "#4CAF50"; // Green for ideal
        if (num >= 6 && num < 7) return "#FFC107"; // Yellow for borderline
        return "#F44336"; // Red for too little or too much
      }
    }
    
    return "#2196F3"; // Default blue for other values
  };

  return (
    <div className="statistics-container">
      <h1 className="statistics-header">Statistics</h1>
      
      <div className="controls-container">
        <div className="control-group">
          <label className="control-label">
            Select Data:
            <select
              className="control-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="prayMorning">Pray Morning</option>
              <option value="prayEvening">Pray Evening</option>
              <option value="coding">Coding</option>
              <option value="sleepTime">Sleep</option>
              <option value="bookSummary">Book Summary</option>
              <option value="suntime">Suntime</option>
              <option value="steps">Steps</option>
            </select>
          </label>
        </div>
        
        <div className="control-group">
          <label className="control-label">
            Days to Show:
            <select
              className="control-select"
              value={daysToShow}
              onChange={(e) => setDaysToShow(parseInt(e.target.value, 10))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="data-section">
        <h2 className="section-title">{displayTitle}</h2>
        <div className="values-container">
          {displayData.map((item, index) => (
            <div 
              key={index} 
              className="value-badge"
              style={{ backgroundColor: getValueColor(item.value) }}
              title={item.date} // Add date as tooltip
            >
              {item.value}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Global styles */
        .statistics-container {
          padding: 2rem;
          background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        /* Header styles */
        .statistics-header {
          text-align: center;
          color: #343a40;
          margin-bottom: 2rem;
          font-size: 2.2rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #dee2e6;
          padding-bottom: 1rem;
        }

        /* Controls container */
        .controls-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .control-group {
          flex: 1 1 300px;
          max-width: 100%;
        }

        .control-label {
          font-size: 1rem;
          color: #495057;
          font-weight: 500;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-select {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ced4da;
          border-radius: 6px;
          background-color: white;
          width: 100%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .control-select:focus {
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        /* Data section */
        .data-section {
          background-color: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .data-section:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #343a40;
          border-left: 5px solid #007bff;
          padding-left: 1rem;
        }

        /* Values display */
        .values-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .value-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 4rem;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          color: white;
          font-weight: 500;
          font-size: 1rem;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          cursor: default; /* Show pointer on hover for the tooltip */
        }

        .value-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
          .statistics-container {
            padding: 1.5rem;
          }
          
          .controls-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .control-group {
            width: 100%;
          }
          
          .value-badge {
            min-width: 3rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;