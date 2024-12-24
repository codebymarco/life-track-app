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
import VisibilityIcon from "@mui/icons-material/Visibility";

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

// Full-Page Modal Styling
const fullPageStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  overflowY: "auto",
};

const JournalEntries: React.FC = () => {
  // State Management
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [journalForm, setJournalForm] = useState<JournalData>({ date: "", body: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalData | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // Load Data from localStorage on Mount
  useEffect(() => {
    try {
      const storedJournal = JSON.parse(localStorage.getItem("journalEntries") || "[]") as JournalData[];
      setJournalData(storedJournal);
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

  const handleViewClose = () => setViewOpen(false);

  // Reset Form Data
  const resetForm = () => {
    setJournalForm({ date: "", body: "" });
    setEditIndex(null);
  };

  // Handle Form Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setJournalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Save (Add/Edit)
  const handleSave = () => {
    if (!journalForm.date.trim()) {
      alert("Date cannot be empty.");
      return;
    }

    if (!journalForm.body.trim()) {
      alert("Journal body cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      const updatedJournal = [...journalData];
      updatedJournal[editIndex] = journalForm;
      setJournalData(updatedJournal);
      localStorage.setItem("journalEntries", JSON.stringify(updatedJournal));
    } else {
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

  // Handle View
  const handleView = (entry: JournalData) => {
    setSelectedEntry(entry);
    setViewOpen(true);
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
  const sortData = <T extends { [key: string]: any }>(data: T[], key: keyof T, order: "asc" | "desc"): T[] => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtering Function
  const filterData = <T extends { [key: string]: any }>(data: T[], key: keyof T, filterValue: any): T[] => {
    if (filterValue === "" || filterValue === null) return data;
    return data.filter((item) => {
      if (typeof filterValue === "string") {
        return item[key].toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return item[key] === filterValue;
    });
  };

  // Processed Data for Rendering
  const processedJournal = sortData(filterData(journalData, "date", filterDate), "date", sortOrder);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Journal Entries
      </Typography>

      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Journal Entry
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

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedJournal.length > 0 ? (
              processedJournal.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(row)}>
                      <VisibilityIcon />
                    </IconButton>
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
                <TableCell colSpan={2} align="center">
                  No journal entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">{editIndex !== null ? "Edit Journal Entry" : "Add New Journal Entry"}</Typography>
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
          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: "10px" }}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Full-Page View Modal */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box sx={fullPageStyle}>
          {selectedEntry && (
            <>
              <Typography variant="h4" gutterBottom>
                Journal Entry
              </Typography>
              <Typography variant="h6">Date: {selectedEntry.date}</Typography>
              <Typography variant="body1" style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
                {selectedEntry.body}
              </Typography>
              <Button variant="outlined" color="primary" onClick={handleViewClose} style={{ marginTop: "20px" }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default JournalEntries;
