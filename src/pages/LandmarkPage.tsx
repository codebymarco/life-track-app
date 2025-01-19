import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Popover,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Type Definitions
type Landmark = {
  date: string;
  landmark: string;
  info: string;
};

// Styles using makeStyles
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
    padding: "16px",
  },
  tableContainer: {
    marginTop: "16px",
    overflowX: "auto",
  },
  table: {
    minWidth: 600,
  },
  tableCell: {
    padding: "4px 8px",
    fontSize: "0.85rem",
  },
  tableHeader: {
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
});

const LandmarkPage: React.FC = () => {
  const classes = useStyles();

  // State Management
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Landmark>({
    date: "",
    landmark: "",
    info: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(
    null
  );

  // Load Data from localStorage on Mount
  useEffect(() => {
    const storedLandmarks = JSON.parse(localStorage.getItem("landmarks") || "[]") as Landmark[];
    setLandmarks(storedLandmarks);
  }, []);

  // Handle Modal Open/Close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset Form Data
  const resetForm = () => {
    setFormData({ date: "", landmark: "", info: "" });
    setEditIndex(null);
  };

  // Handle Form Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save (Add/Edit)
  const handleSave = () => {
    if (!formData.date || !formData.landmark || !formData.info) {
      alert("All fields are required.");
      return;
    }

    if (editIndex !== null) {
      // Edit Existing Landmark
      const updatedLandmarks = landmarks.map((entry, idx) =>
        idx === editIndex ? formData : entry
      );
      setLandmarks(updatedLandmarks);
      localStorage.setItem("landmarks", JSON.stringify(updatedLandmarks));
    } else {
      // Add New Landmark
      const newLandmarks = [...landmarks, formData];
      setLandmarks(newLandmarks);
      localStorage.setItem("landmarks", JSON.stringify(newLandmarks));
    }

    handleClose();
  };

  // Handle Delete
  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this landmark?")) {
      const filteredLandmarks = landmarks.filter((_, i) => i !== index);
      setLandmarks(filteredLandmarks);
      localStorage.setItem("landmarks", JSON.stringify(filteredLandmarks));
    }
  };

  // Handle Edit
  const handleEdit = (index: number) => {
    setFormData(landmarks[index]);
    setEditIndex(index);
    handleOpen();
  };

  // Handle Download as JSON
  const handleDownload = () => {
    const jsonData = JSON.stringify(landmarks, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `landmarks.json`;
    link.click();
  };

  // Filter Landmarks by Date
  const filteredLandmarks = filterDate
    ? landmarks.filter((entry) => entry.date.includes(filterDate))
    : landmarks;

  return (
    <div className={classes.container}>
      <Typography variant="h5" gutterBottom>
        Life-Changing Landmarks
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "12px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen} size="small">
          {editIndex !== null ? "Edit" : "Add"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleDownload} size="small">
          Download
        </Button>
      </div>

      {/* Filter by Date */}
      <TextField
        label="Filter by Date"
        type="date"
        size="small"
        variant="outlined"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "12px" }}
      />

      {/* Modal for Adding/Editing Landmarks */}
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.modalBox}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Landmark" : "Add Landmark"}
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: "12px" }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Landmark"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            style={{ marginBottom: "12px" }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="How it Changed Your Life"
            name="info"
            value={formData.info}
            onChange={handleChange}
            multiline
            rows={4}
            style={{ marginBottom: "12px" }}
          />

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Landmarks Table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>Date</TableCell>
              <TableCell className={classes.tableHeader}>Landmark</TableCell>
              <TableCell className={classes.tableHeader}>Details</TableCell>
              <TableCell className={classes.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLandmarks.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>{entry.date}</TableCell>
                <TableCell className={classes.tableCell}>{entry.landmark}</TableCell>
                <TableCell className={classes.tableCell}>{entry.info}</TableCell>
                <TableCell className={classes.tableCell}>
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedEntryIndex(index);
                    }}
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
                        startIcon={<EditIcon />}
                        onClick={() => {
                          handleEdit(index);
                          setAnchorEl(null);
                        }}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          handleDelete(index);
                          setAnchorEl(null);
                        }}
                        size="small"
                      >
                        Delete
                      </Button>
                      <Button
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                          alert(
                            `Date: ${entry.date}\nLandmark: ${entry.landmark}\nDetails: ${entry.info}`
                          );
                          setAnchorEl(null);
                        }}
                        size="small"
                      >
                        View
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

export default LandmarkPage;
