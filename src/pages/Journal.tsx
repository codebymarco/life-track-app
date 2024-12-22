// src/JournalEntries.tsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Type Definitions
type JournalData = {
  date: string;
  body: string;
};

// Modal Styling
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const JournalEntries: React.FC = () => {
  // State Management
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [journalForm, setJournalForm] = useState<JournalData>({
    date: "",
    body: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // Load Data from localStorage on Mount
  useEffect(() => {
    try {
      const storedJournal = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      ) as JournalData[];
      setJournalData(
        storedJournal.map((entry) => ({
          date: entry.date || "",
          body: entry.body || "",
        }))
      );
    } catch {
      setJournalData([]);
    }
  }, []);

  // Handle Modal Open/Close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset Form Data
  const resetForm = () => {
    setJournalForm({
      date: "",
      body: "",
    });
    setEditIndex(null);
  };

  // Handle Form Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    setJournalForm((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  // Handle Save (Add/Edit)
  const handleSave = () => {
    // Validate Form
    if (!journalForm.date.trim()) {
      alert("Date cannot be empty.");
      return;
    }

    if (!journalForm.body.trim()) {
      alert("Journal body cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      // Edit Existing Entry
      const updatedJournal = [...journalData];
      updatedJournal[editIndex] = journalForm;
      setJournalData(updatedJournal);
      localStorage.setItem("journalEntries", JSON.stringify(updatedJournal));
    } else {
      // Add New Entry
      const newJournal = [...journalData, journalForm];
      setJournalData(newJournal);
      localStorage.setItem("journalEntries", JSON.stringify(newJournal));
    }

    handleClose();
  };

  // Handle Delete
  const handleDelete = (index: number) => {
    const confirm = window.confirm("Are you sure you want to delete this journal entry?");
    if (!confirm) return;

    const filteredJournal = journalData.filter((_, i) => i !== index);
    setJournalData(filteredJournal);
    localStorage.setItem("journalEntries", JSON.stringify(filteredJournal));
  };

  // Handle Edit
  const handleEdit = (index: number) => {
    setJournalForm(journalData[index]);
    setEditIndex(index);
    handleOpen();
  };

  // Handle Download as JSON
  const handleDownload = () => {
    const jsonData = JSON.stringify(journalData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `journalEntries.json`;
    link.click();
  };

  // Sorting Function
  const sortData = <T extends { [key: string]: any }>(
    data: T[],
    key: keyof T,
    order: "asc" | "desc"
  ): T[] => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtering Function
  const filterData = <T extends { [key: string]: any }>(
    data: T[],
    key: keyof T,
    filterValue: any
  ): T[] => {
    if (filterValue === "" || filterValue === null) return data;
    return data.filter((item) => {
      if (typeof filterValue === "boolean") {
        return item[key] === filterValue;
      } else if (typeof filterValue === "string") {
        return item[key]
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      return item[key] === filterValue;
    });
  };

  // Processed Data for Rendering
  const processedJournal = sortData(
    filterData(journalData, "date", filterDate),
    "date",
    sortOrder
  );

  // Utility Functions to Get Start and Latest Dates
  const getStartDate = () => {
    if (journalData.length === 0) return "N/A";
    const sorted = [...journalData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0].date;
  };

  const getLatestDate = () => {
    if (journalData.length === 0) return "N/A";
    const sorted = [...journalData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].date;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Journal Entries
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Journal Entry" : "Add Journal Entry"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Journal Entries as JSON
        </Button>
      </div>

      {/* Sorting and Filtering Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Sorting */}
        <FormControl variant="outlined" size="small">
          <InputLabel>Sort Order</InputLabel>
          <Select
            label="Sort Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Filter by Date */}
        <TextField
          label="Filter by Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterDate("");
            setSortOrder("asc");
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Adding/Editing Journal Entries */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Journal Entry" : "Add New Journal Entry"}
          </Typography>
          {/* Journal Form Fields */}
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="date"
            value={journalForm.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Journal Body"
            name="body"
            value={journalForm.body}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>
        </Box>
      </Modal>

      {/* Journal Entries Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Journal Body</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedJournal.length > 0 ? (
              processedJournal.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.body}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No journal entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display Tracking Period */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Tracking Period</Typography>
        <Typography variant="body1">Start Date: {getStartDate()}</Typography>
        <Typography variant="body1">Latest Date: {getLatestDate()}</Typography>
      </Box>
    </div>
  );
};

export default JournalEntries;
