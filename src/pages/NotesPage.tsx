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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { v4 as uuidv4 } from "uuid";

// Define the NotesData type with a unique identifier
type NotesData = {
  id: string; // Unique identifier
  name: string;
  body: string;
  dateCreated: string; // ISO date string
  category: string; // Note category
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

const categories = ["Personal", "Coding", "Faith", "Fitness", "Health", "Fashion"];

function NotesPage() {
  const [notesData, setNotesData] = useState<NotesData[]>([]);
  const [noteForm, setNoteForm] = useState<NotesData>({
    id: "",
    name: "",
    body: "",
    dateCreated: "",
    category: "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [viewNote, setViewNote] = useState<NotesData | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedNotes = JSON.parse(
        localStorage.getItem("notesEntries") || "[]"
      ) as NotesData[];
      setNotesData(storedNotes);
    } catch {
      setNotesData([]);
    }
  }, []);

  // Open and Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNoteForm({
      id: "",
      name: "",
      body: "",
      dateCreated: "",
      category: "",
    });
    setEditId(null);
  };

  const handleViewClose = () => setViewNote(null);

  // Handle Form Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setNoteForm({
      ...noteForm,
      [name!]: value,
    });
  };

  // Handle Save (Add or Edit)
  const handleSave = () => {
    // Validate note name, body, and category
    if (!noteForm.name.trim() || !noteForm.body.trim() || !noteForm.category) {
      alert("Name, body, and category cannot be empty.");
      return;
    }

    if (editId) {
      // Editing an existing note
      const updatedNotes = notesData.map((note) =>
        note.id === editId ? { ...noteForm, dateCreated: note.dateCreated } : note
      );
      setNotesData(updatedNotes);
      localStorage.setItem("notesEntries", JSON.stringify(updatedNotes));
    } else {
      // Adding a new note
      const newNote = {
        ...noteForm,
        id: uuidv4(),
        dateCreated: new Date().toISOString(),
      };
      const newNotes = [...notesData, newNote];
      setNotesData(newNotes);
      localStorage.setItem("notesEntries", JSON.stringify(newNotes));
    }

    handleClose();
  };

  // Handle Edit
  const handleEdit = (id: string) => {
    const noteToEdit = notesData.find((note) => note.id === id);
    if (noteToEdit) {
      setNoteForm(noteToEdit);
      setEditId(id);
      handleOpen();
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (confirmed) {
      const filteredNotes = notesData.filter((note) => note.id !== id);
      setNotesData(filteredNotes);
      localStorage.setItem("notesEntries", JSON.stringify(filteredNotes));
    }
  };

  // Filter notes by category
  const filteredNotes = filterCategory
    ? notesData.filter((note) => note.category === filterCategory)
    : notesData;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Notes
      </Typography>

      {/* Add and Filter Controls */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Note
        </Button>

        <FormControl variant="outlined" size="small">
          <InputLabel>Filter by Category</InputLabel>
          <Select
            label="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="text"
          onClick={() => setFilterCategory("")}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Note" : "Add Note"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={noteForm.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Body"
            name="body"
            value={noteForm.body}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={noteForm.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      {/* Modal for Viewing Note */}
      <Modal open={!!viewNote} onClose={handleViewClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Note Details
          </Typography>
          {viewNote && (
            <>
              <Typography variant="subtitle1"><strong>Name:</strong> {viewNote.name}</Typography>
              <Typography variant="subtitle1"><strong>Body:</strong> {viewNote.body}</Typography>
              <Typography variant="subtitle1"><strong>Category:</strong> {viewNote.category}</Typography>
              <Typography variant="subtitle1"><strong>Date Created:</strong> {new Date(viewNote.dateCreated).toLocaleString()}</Typography>
            </>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleViewClose}
            style={{ marginTop: "10px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.body}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{new Date(row.dateCreated).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setViewNote(row)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(row.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default NotesPage;
