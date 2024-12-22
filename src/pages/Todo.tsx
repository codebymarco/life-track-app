// Todo.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Todo data type
type TodoData = {
  task: string;
  state: "todo" | "doing" | "done";
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

function Todo() {
  const [open, setOpen] = useState<boolean>(false);
  const [todoData, setTodoData] = useState<TodoData[]>([]);
  const [todoForm, setTodoForm] = useState<TodoData>({
    task: "",
    state: "todo",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering States
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterState, setFilterState] = useState<"todo" | "doing" | "done" | "">("");

  // State to track visibility of passwords (if applicable)
  // Removed since Todo doesn't handle passwords

  // Load Todo data from localStorage
  useEffect(() => {
    try {
      const storedTodo = JSON.parse(localStorage.getItem("todoEntries") || "[]") as TodoData[];
      setTodoData(
        storedTodo.map((entry) => ({
          ...entry,
          task: entry.task || "",
          state: entry.state || "todo",
        }))
      );
    } catch {
      setTodoData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setTodoForm({ task: "", state: "todo" });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setTodoForm((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSave = () => {
    if (!todoForm.task.trim()) {
      alert("Task cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      const updatedTodo = [...todoData];
      updatedTodo[editIndex] = todoForm;
      setTodoData(updatedTodo);
      localStorage.setItem("todoEntries", JSON.stringify(updatedTodo));
    } else {
      const newTodo = [...todoData, todoForm];
      setTodoData(newTodo);
      localStorage.setItem("todoEntries", JSON.stringify(newTodo));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    const filteredTodo = todoData.filter((_, i) => i !== index);
    setTodoData(filteredTodo);
    localStorage.setItem("todoEntries", JSON.stringify(filteredTodo));
  };

  const handleEdit = (index: number) => {
    setTodoForm(todoData[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(todoData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `todo.json`;
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
        return item[key] === filterValue;
      }
      return item[key] === filterValue;
    });
  };

  // Processed Data for Rendering
  const processedTodo = sortData(
    filterData(todoData, "state", filterState),
    "task",
    sortOrder
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Todo List
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Task" : "Add Task"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Todo as JSON
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
          <InputLabel>Sort by Task</InputLabel>
          <Select
            label="Sort by Task"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Filtering */}
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter by State</InputLabel>
          <Select
            label="Filter by State"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as "todo" | "doing" | "done" | "")}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="todo">Todo</MenuItem>
            <MenuItem value="doing">Doing</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterState("");
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
            {editIndex !== null ? "Edit Task" : "Add Task"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Task"
            name="task"
            value={todoForm.task}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              label="State"
              name="state"
              value={todoForm.state}
              onChange={handleChange}
            >
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="doing">Doing</MenuItem>
              <MenuItem value="done">Done</MenuItem>
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
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedTodo.length > 0 ? (
              processedTodo.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.state}</TableCell>
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
                  No todo tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Todo;
