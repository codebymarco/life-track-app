import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { makeStyles } from "@mui/styles";

// Type Definitions
type JournalData = {
  date: string;
  body: string;
  travelTime?: number;
  mood?: string;
  mood2?: { hour: number; value: string }[];
  wore?: string;
  better?: string;
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

const moodModalStyle = {
  ...style,
  width: 400,
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

// Styles using makeStyles
const useStyles = makeStyles({
  container: {
    padding: "8px",
  },
  weekend: {
    backgroundColor: "dodgerblue",
    color: "white",
  },
  weekday: {
    backgroundColor: "aquamarine",
    color: "white",
  },
  title: {
    fontSize: "1.25rem", // Reduced from h5
    marginBottom: "8px",
  },
  button: {
    marginRight: "6px",
    padding: "4px 8px",
    minWidth: "80px",
    fontSize: "0.75rem",
  },
  formControl: {
    minWidth: 100,
  },
  selectInput: {
    fontSize: "0.75rem",
  },
  textField: {
    marginTop: "4px",
    marginBottom: "4px",
  },
  checkboxLabel: {
    fontSize: "0.75rem",
  },
  modalBox: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400, // Further reduced width
    maxHeight: "80vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #000",
    boxShadow: 24,
    padding: "8px", // Further reduced padding
  },
  viewModalBox: {
    // Styles for the View Modal
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Full-page width
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #000",
    boxShadow: 24,
    padding: "16px",
  },
  tableContainer: {
    marginTop: "16px",
    overflowX: "auto",
  },
  table: {
    minWidth: 800,
    fontSize: "0.65rem",
  },
  tableCell: {
    padding: "4px 8px",
    fontSize: "0.65rem",
  },
  tableHeader: {
    fontSize: "0.7rem",
    padding: "4px 8px",
  },
  trackingBox: {
    marginTop: "16px",
    fontSize: "0.7rem",
  },
});

const JournalEntries: React.FC = () => {
  const classes = useStyles();

  // State Management
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [journalForm, setJournalForm] = useState<JournalData>({
    date: "",
    body: "",
    mood: "",
    mood2: [],
    wore: "",
    better: "",
    travelTime: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalData | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // Load Data from localStorage on Mount
  useEffect(() => {
    try {
      const storedJournal = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      ) as JournalData[];
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
    setJournalForm({
      date: "",
      body: "",
      mood: "",
      wore: "",
      better: "",
      travelTime: 0,
    });
    setEditIndex(null);
  };

  // Handle Form Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    if (!journalForm.mood?.trim()) {
      alert("Journal mood cannot be empty.");
      return;
    }

    if (!journalForm.wore?.trim()) {
      alert("Journal wore cannot be empty.");
      return;
    }

    if (!journalForm.better?.trim()) {
      alert("Journal wore cannot be empty.");
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
    const confirm = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );
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

  const handleEdit = (index: number) => {
    const entry = processedJournal[index];
    const originalIndex = journalData.findIndex(
      (item) => item.date === entry.date && item.body === entry.body
    );
    if (originalIndex !== -1) {
      setJournalForm(journalData[originalIndex]);
      setEditIndex(originalIndex);
      handleOpen();
    } else {
      alert("Unable to find the selected entry.");
    }
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
      if (typeof filterValue === "string") {
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

  const [moodModalOpen, setMoodModalOpen] = useState<boolean>(false);
  const handleMoodModalOpen = () => setMoodModalOpen(true);
  const handleMoodModalClose = () => setMoodModalOpen(false);

  const [currentMood, setCurrentMood] = useState<{ hour: number; value: string }[]>(
    Array.from({ length: 24 }, (_, hour) => ({ hour, value: "" }))
  );

  const handleMoodSave = () => {
    setJournalForm((prev) => ({ ...prev, mood2: currentMood }));
    handleMoodModalClose();
  };

  const handleMoodChange = (hour: number, value: string) => {
    setCurrentMood((prev) =>
      prev.map((entry) =>
        entry.hour === hour ? { ...entry, value } : entry
      )
    );
  };

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
              <TableCell>TravelTime</TableCell>
              <TableCell>mood</TableCell>
              <TableCell>wore</TableCell>
              <TableCell>better</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedJournal.length > 0 ? (
              processedJournal.map((row, index) => {
                const dateObject = new Date(row.date);
                const dayOfWeek = dateObject.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const dayName = dateObject.toLocaleDateString("en-US", {
                  weekday: "long",
                });

                return (
                  <TableRow key={index}>
                    <TableCell
                      className={`${classes.tableCell} ${
                        isWeekend ? classes.weekend : classes.weekday
                      }`}
                    >
                      {row.date} - {dayName}
                    </TableCell>
                    <TableCell>{row.travelTime}</TableCell>
                    <TableCell>{row.mood}</TableCell>
                    <TableCell>{row.wore}</TableCell>
                    <TableCell>{row.better}</TableCell>
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
                );
              })
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
          <Typography variant="h6">
            {editIndex !== null
              ? "Edit Journal Entry"
              : "Add New Journal Entry"}
          </Typography>
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
          <TextField
            fullWidth
            margin="normal"
            label="Mood"
            name="mood"
            value={journalForm.mood}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Wore"
            name="wore"
            value={journalForm.wore}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleMoodModalOpen}
          >
            Set Mood
          </Button>{" "}
          <TextField
            fullWidth
            margin="normal"
            label="Better"
            name="better"
            value={journalForm.better}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="travel time"
            name="travelTime"
            value={journalForm.travelTime}
            onChange={handleChange}
            type="number"
            required
          />
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

      {/* Full-Page View Modal */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box sx={fullPageStyle}>
          {selectedEntry && (
            <>
              <Typography variant="h4" gutterBottom>
                Journal Entry
              </Typography>
              <Typography variant="h6">Date: {selectedEntry.date}</Typography>
              <Typography
                variant="body1"
                style={{ marginTop: "20px", whiteSpace: "pre-line" }}
              >
                {selectedEntry.body}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleViewClose}
                style={{ marginTop: "20px" }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>


      <Modal open={moodModalOpen} onClose={handleMoodModalClose}>
        <Box sx={moodModalStyle}>
          <Typography variant="h6">Set Mood for Each Hour</Typography>
          {currentMood.map(({ hour, value }) => (
            <Box key={hour} display="flex" alignItems="center" marginY={1}>
              <Typography style={{ width: "50px" }}>{hour}:00</Typography>
              <Select
                value={value}
                onChange={(e) => handleMoodChange(hour, e.target.value)}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Happy">Happy</MenuItem>
                <MenuItem value="Sad">Sad</MenuItem>
                <MenuItem value="Neutral">Neutral</MenuItem>
              </Select>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleMoodSave}
            style={{ marginTop: "10px" }}
          >
            Save Mood
          </Button>
        </Box>
      </Modal>

    </div>
  );
};

export default JournalEntries;
