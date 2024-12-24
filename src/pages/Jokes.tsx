// Jokes.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Joke data type
type JokeData = {
  body: string;
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

function Jokes() {
  const [open, setOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [jokes, setJokes] = useState<JokeData[]>([]);
  const [jokeForm, setJokeForm] = useState<JokeData>({ body: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewJoke, setViewJoke] = useState<JokeData | null>(null);

  // Load jokes from localStorage
  useEffect(() => {
    try {
      const storedJokes = JSON.parse(localStorage.getItem("jokes") || "[]") as JokeData[];
      setJokes(storedJokes);
    } catch {
      setJokes([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setJokeForm({ body: "" });
    setEditIndex(null);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewJoke(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setJokeForm({ body: value });
  };

  const handleSave = () => {
    if (!jokeForm.body.trim()) {
      alert("Joke cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      const updatedJokes = [...jokes];
      updatedJokes[editIndex] = jokeForm;
      setJokes(updatedJokes);
      localStorage.setItem("jokes", JSON.stringify(updatedJokes));
    } else {
      const newJokes = [...jokes, jokeForm];
      setJokes(newJokes);
      localStorage.setItem("jokes", JSON.stringify(newJokes));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    const filteredJokes = jokes.filter((_, i) => i !== index);
    setJokes(filteredJokes);
    localStorage.setItem("jokes", JSON.stringify(filteredJokes));
  };

  const handleEdit = (index: number) => {
    setJokeForm(jokes[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleView = (index: number) => {
    setViewJoke(jokes[index]);
    setViewOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Jokes Page
      </Typography>

      {/* Add Joke Button */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Joke" : "Add Joke"}
        </Button>
      </div>

      {/* Modal for Adding/Editing Jokes */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Joke" : "Add Joke"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Joke"
            name="body"
            value={jokeForm.body}
            onChange={handleChange}
            multiline
            rows={4}
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

      {/* Modal for Viewing Jokes */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box sx={{ ...style, width: "90%", height: "90%" }}>
          <Typography variant="h6" gutterBottom>
            View Joke
          </Typography>
          <Typography>{viewJoke?.body}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewClose}
            style={{ marginTop: "10px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Jokes Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Joke</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jokes.length > 0 ? (
              jokes.map((joke, index) => (
                <TableRow key={index}>
                  <TableCell>{joke.body}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(index)}>
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
                  No jokes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Jokes;
