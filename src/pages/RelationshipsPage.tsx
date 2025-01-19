// src/RelationshipsPage.tsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Popover,
  RadioGroup,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Type Definitions
type RelationshipEntry = {
  date: string;
  people: { [name: string]: "inPerson" | "socialMedia" | null };
};

const useStyles = makeStyles({
  container: {
    padding: "8px",
  },
  modalBox: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "80vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #000",
    padding: "8px",
  },
  tableContainer: {
    marginTop: "16px",
    overflowX: "auto",
  },
  table: {
    minWidth: 800,
  },
  tableCell: {
    padding: "4px 8px",
  },
  tableHeader: {
    fontWeight: "bold",
  },
});

const RelationshipsPage: React.FC = () => {
  const classes = useStyles();

  // State Management
  const [data, setData] = useState<RelationshipEntry[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [formDate, setFormDate] = useState<string>("");
  const [formPeople, setFormPeople] = useState<{
    [name: string]: "inPerson" | "socialMedia" | null;
  }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(
    null
  );

  // Load Data from localStorage on Mount
  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("relationships") || "[]"
    ) as RelationshipEntry[];
    const storedPeople = JSON.parse(
      localStorage.getItem("people") || "[]"
    ) as string[];
    setData(storedData);
    setPeople(storedPeople);
  }, []);

  // Save Data to localStorage
  const saveData = (updatedData: RelationshipEntry[]) => {
    setData(updatedData);
    localStorage.setItem("relationships", JSON.stringify(updatedData));
  };

  const savePeople = (updatedPeople: string[]) => {
    setPeople(updatedPeople);
    localStorage.setItem("people", JSON.stringify(updatedPeople));
  };

  // Handle Modal Open/Close
  const handleOpen = () => {
    setFormDate("");
    setFormPeople(
      people.reduce((acc, person) => ({ ...acc, [person]: null }), {})
    );
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleAddPersonOpen = () => {
    setNewPersonName("");
    setAddPersonOpen(true);
  };

  const handleAddPersonClose = () => setAddPersonOpen(false);

  // Handle Add/Edit Entry
  const handleSave = () => {
    if (!formDate) {
      alert("Please select a date.");
      return;
    }

    const newEntry: RelationshipEntry = { date: formDate, people: formPeople };
    const updatedData = [...data, newEntry];
    saveData(updatedData);
  };

  // Handle Delete Entry
  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updatedData = data.filter((_, i) => i !== index);
      saveData(updatedData);
    }
  };

  // Handle Add Person
  const handleAddPerson = () => {
    if (newPersonName && !people.includes(newPersonName)) {
      const updatedPeople = [...people, newPersonName];
      savePeople(updatedPeople);
      handleAddPersonClose();
    } else if (people.includes(newPersonName)) {
      alert("This person already exists.");
    }
  };

  // Handle Download Data
  const handleDownload = () => {
    const jsonData = JSON.stringify({ data, people }, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relationships.json";
    link.click();
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" gutterBottom>
        Relationships Tracker
      </Typography>

      {/* Add Buttons */}
      <div style={{ marginBottom: "12px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          style={{ marginRight: "8px" }}
        >
          Add Day
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAddPersonOpen}
          style={{ marginRight: "8px" }}
        >
          Add Person
        </Button>
        <Button variant="outlined" color="primary" onClick={handleDownload}>
          Download JSON
        </Button>
      </div>

      {/* Modal for Adding Entry */}
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.modalBox}>
          <Typography variant="h6" gutterBottom>
            Add Entry
          </Typography>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: "12px" }}
          />
          {people.map((person) => (
            <Box
              key={person}
              display="flex"
              alignItems="center"
              marginBottom="8px"
            >
              <Typography style={{ marginRight: "8px" }}>{person}:</Typography>
              <RadioGroup
                row
                value={formPeople[person] || "none"}
                onChange={(e) =>
                  setFormPeople((prev: any) => ({
                    ...prev,
                    [person]: e.target.value === "none" ? null : e.target.value,
                  }))
                }
              >
                <FormControlLabel
                  value="inPerson"
                  control={<Radio />}
                  label="In Person"
                />
                <FormControlLabel
                  value="socialMedia"
                  control={<Radio />}
                  label="Social Media"
                />
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />
              </RadioGroup>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: "12px" }}
          >
            Save
          </Button>
        </Box>
      </Modal>

      {/* Modal for Adding Person */}
      <Modal open={addPersonOpen} onClose={handleAddPersonClose}>
        <Box className={classes.modalBox}>
          <Typography variant="h6" gutterBottom>
            Add Person
          </Typography>
          <TextField
            label="Person's Name"
            fullWidth
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            style={{ marginBottom: "12px" }}
          />
          <Button variant="contained" color="primary" onClick={handleAddPerson}>
            Add
          </Button>
        </Box>
      </Modal>

      {/* Entries Table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>Date</TableCell>
              {people.map((person) => (
                <TableCell key={person} className={classes.tableHeader}>
                  {person}
                </TableCell>
              ))}
              <TableCell className={classes.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>
                  {entry.date}
                </TableCell>
                {people.map((person) => (
                  <TableCell key={person} className={classes.tableCell}>
                    {entry.people[person] || "-"}
                  </TableCell>
                ))}
                <TableCell className={classes.tableCell}>
                  <IconButton
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedEntryIndex(index);
                    }}
                    size="small"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Popover
                    open={Boolean(anchorEl) && selectedEntryIndex === index}
                    anchorEl={anchorEl}
                    onClose={() => {
                      setAnchorEl(null);
                      setSelectedEntryIndex(null);
                    }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <Box p={1} display="flex" flexDirection="column">
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(index)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RelationshipsPage;
