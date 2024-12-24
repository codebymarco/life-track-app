// Memories.tsx
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
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Memory data type
type MemoryData = {
  title: string;
  description: string;
  date: string;
};

// Modal styling
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

function Memories() {
  const [open, setOpen] = useState<boolean>(false);
  const [memoriesData, setMemoriesData] = useState<MemoryData[]>([]);
  const [memoryForm, setMemoryForm] = useState<MemoryData>({
    title: "",
    description: "",
    date: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Load Memories data from localStorage
  useEffect(() => {
    try {
      const storedMemories = JSON.parse(localStorage.getItem("memoriesEntries") || "[]") as MemoryData[];
      setMemoriesData(storedMemories);
    } catch {
      setMemoriesData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMemoryForm({ title: "", description: "", date: "" });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMemoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!memoryForm.title.trim() || !memoryForm.description.trim() || !memoryForm.date.trim()) {
      alert("All fields are required.");
      return;
    }

    if (editIndex !== null) {
      const updatedMemories = [...memoriesData];
      updatedMemories[editIndex] = memoryForm;
      setMemoriesData(updatedMemories);
      localStorage.setItem("memoriesEntries", JSON.stringify(updatedMemories));
    } else {
      const newMemories = [...memoriesData, memoryForm];
      setMemoriesData(newMemories);
      localStorage.setItem("memoriesEntries", JSON.stringify(newMemories));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    const filteredMemories = memoriesData.filter((_, i) => i !== index);
    setMemoriesData(filteredMemories);
    localStorage.setItem("memoriesEntries", JSON.stringify(filteredMemories));
  };

  const handleEdit = (index: number) => {
    setMemoryForm(memoriesData[index]);
    setEditIndex(index);
    handleOpen();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Memories
      </Typography>

      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Memory" : "Add Memory"}
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Memory" : "Add Memory"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={memoryForm.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={memoryForm.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={memoryForm.date}
            onChange={handleChange}
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memoriesData.length > 0 ? (
              memoriesData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.date}</TableCell>
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
                <TableCell colSpan={4} align="center">
                  No memories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Memories;
