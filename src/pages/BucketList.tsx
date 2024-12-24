import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
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
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Bucket List Item Data Type
type BucketItem = {
  goal: string;
  category: "Travel" | "Skills" | "Personal Growth" | "Adventure" | "Other";
  completed: boolean;
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

function BucketList() {
  const [open, setOpen] = useState(false);
  const [bucketData, setBucketData] = useState<BucketItem[]>([]);
  const [bucketForm, setBucketForm] = useState<BucketItem>({
    goal: "",
    category: "Other",
    completed: false,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Load Bucket List data from localStorage
  useEffect(() => {
    const storedBucketData = JSON.parse(localStorage.getItem("bucketList") || "[]") as BucketItem[];
    setBucketData(storedBucketData);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBucketForm({ goal: "", category: "Other", completed: false });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setBucketForm((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSave = () => {
    if (!bucketForm.goal.trim()) {
      alert("Goal cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      const updatedData = [...bucketData];
      updatedData[editIndex] = bucketForm;
      setBucketData(updatedData);
      localStorage.setItem("bucketList", JSON.stringify(updatedData));
    } else {
      const newData = [...bucketData, bucketForm];
      setBucketData(newData);
      localStorage.setItem("bucketList", JSON.stringify(newData));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    const updatedData = bucketData.filter((_, i) => i !== index);
    setBucketData(updatedData);
    localStorage.setItem("bucketList", JSON.stringify(updatedData));
  };

  const toggleCompleted = (index: number) => {
    const updatedData = [...bucketData];
    updatedData[index].completed = !updatedData[index].completed;
    setBucketData(updatedData);
    localStorage.setItem("bucketList", JSON.stringify(updatedData));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        My Bucket List
      </Typography>

      {/* Add Button */}
      <div style={{ marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Goal
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Goal" : "Add Goal"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Goal"
            name="goal"
            value={bucketForm.goal}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="category"
              value={bucketForm.category}
              onChange={handleChange}
            >
              <MenuItem value="Travel">Travel</MenuItem>
              <MenuItem value="Skills">Skills</MenuItem>
              <MenuItem value="Personal Growth">Personal Growth</MenuItem>
              <MenuItem value="Adventure">Adventure</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Goal</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bucketData.length > 0 ? (
              bucketData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.goal}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => toggleCompleted(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setEditIndex(index);
                      setBucketForm(item);
                      handleOpen();
                    }}>
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
                  No goals added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BucketList;
