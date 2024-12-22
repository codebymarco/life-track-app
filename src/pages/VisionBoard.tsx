// VisionBoard.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";

// Vision Board data type
type VisionData = {
  goal: string;
  currentStatus: string;
  goalStatus: string;
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

function VisionBoard() {
  const [open, setOpen] = useState<boolean>(false);
  const [visionData, setVisionData] = useState<VisionData[]>([]);
  const [visionForm, setVisionForm] = useState<VisionData>({
    goal: "",
    currentStatus: "",
    goalStatus: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering States
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterGoal, setFilterGoal] = useState<string>("");

  // Load Vision Board data from localStorage
  useEffect(() => {
    try {
      const storedVision = JSON.parse(localStorage.getItem("visionEntries") || "[]") as VisionData[];
      setVisionData(
        storedVision.map((entry) => ({
          ...entry,
          goal: entry.goal || "",
          currentStatus: entry.currentStatus || "",
          goalStatus: entry.goalStatus || "",
        }))
      );
    } catch {
      setVisionData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setVisionForm({ goal: "", currentStatus: "", goalStatus: "" });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setVisionForm((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSave = () => {
    if (!visionForm.goal.trim()) {
      alert("Goal cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      const updatedVision = [...visionData];
      updatedVision[editIndex] = visionForm;
      setVisionData(updatedVision);
      localStorage.setItem("visionEntries", JSON.stringify(updatedVision));
    } else {
      const newVision = [...visionData, visionForm];
      setVisionData(newVision);
      localStorage.setItem("visionEntries", JSON.stringify(newVision));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    const filteredVision = visionData.filter((_, i) => i !== index);
    setVisionData(filteredVision);
    localStorage.setItem("visionEntries", JSON.stringify(filteredVision));
  };

  const handleEdit = (index: number) => {
    setVisionForm(visionData[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(visionData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `vision_board.json`;
    link.click();
  };

  // Sorting and Filtering Functions
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

  const filterData = <T extends { [key: string]: any }>(
    data: T[],
    key: keyof T,
    filterValue: any
  ): T[] => {
    if (filterValue === "" || filterValue === null) return data;
    return data.filter((item) => {
      if (typeof filterValue === "string") {
        return item[key].toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return item[key] === filterValue;
    });
  };

  // Processed Data for Rendering
  const processedVision = sortData(
    filterData(visionData, "goal", filterGoal),
    "goal",
    sortOrder
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Vision Board
      </Typography>

      {/* Navigation Back to Home */}
      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        style={{ marginBottom: "20px" }}
      >
        Back to Home
      </Button>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Goal" : "Add Goal"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Vision Board as JSON
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
          <InputLabel>Sort by Goal</InputLabel>
          <Select
            label="Sort by Goal"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Filtering */}
        <TextField
          label="Filter by Goal"
          type="text"
          size="small"
          value={filterGoal}
          onChange={(e) => setFilterGoal(e.target.value)}
          style={{ minWidth: 200 }}
        />

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterGoal("");
            setSortOrder("asc");
          }}
        >
          Reset Filter
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
            value={visionForm.goal}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Current Status"
            name="currentStatus"
            value={visionForm.currentStatus}
            onChange={handleChange}
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Goal Status"
            name="goalStatus"
            value={visionForm.goalStatus}
            onChange={handleChange}
            multiline
            rows={3}
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
              <TableCell>Goal</TableCell>
              <TableCell>Current Status</TableCell>
              <TableCell>Goal Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedVision.length > 0 ? (
              processedVision.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.goal}</TableCell>
                  <TableCell>{row.currentStatus}</TableCell>
                  <TableCell>{row.goalStatus}</TableCell>
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
                  No vision board goals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default VisionBoard;
