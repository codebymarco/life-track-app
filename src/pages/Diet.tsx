// src/DietEntries.tsx

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
type FoodEntry = {
  food: string;
  calorie: number;
  quantity: number;
  grams?: number;
};

type DietData = {
  date: string;
  foods: FoodEntry[];
  water: string;
};

// Modal Styling
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700, // Increased width for better form layout
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Diet: React.FC = () => {
  // State Management
  const [dietData, setDietData] = useState<DietData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [dietForm, setDietForm] = useState<DietData>({
    date: "",
    foods: [
      {
        food: "",
        calorie: 0,
        quantity: 1,
        grams: undefined,
      },
    ],
    water: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // Load Data from localStorage on Mount
  useEffect(() => {
    try {
      const storedDiet = JSON.parse(localStorage.getItem("dietEntries") || "[]") as DietData[];
      setDietData(
        storedDiet.map((entry) => ({
          ...entry,
          foods: entry.foods || [
            { food: "", calorie: 0, quantity: 1, grams: undefined },
          ],
          water: entry.water || "",
        }))
      );
    } catch {
      setDietData([]);
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
    setDietForm({
      date: "",
      foods: [
        {
          food: "",
          calorie: 0,
          quantity: 1,
          grams: undefined,
        },
      ],
      water: "",
    });
    setEditIndex(null);
  };

  // Handle Form Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === "date" || name === "water") {
      setDietForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle Changes in Food Entries
  const handleFoodChange = (
    index: number,
    field: keyof FoodEntry,
    value: string | number
  ) => {
    const updatedFoods = dietForm.foods.map((food, i) =>
      i === index ? { ...food, [field]: value } : food
    );
    setDietForm({ ...dietForm, foods: updatedFoods });
  };

  // Add a New Food Entry
  const addFoodEntry = () => {
    setDietForm({
      ...dietForm,
      foods: [
        ...dietForm.foods,
        { food: "", calorie: 0, quantity: 1, grams: undefined },
      ],
    });
  };

  // Remove a Food Entry
  const removeFoodEntry = (index: number) => {
    const updatedFoods = dietForm.foods.filter((_, i) => i !== index);
    setDietForm({ ...dietForm, foods: updatedFoods });
  };

  // Handle Save (Add/Edit)
  const handleSave = () => {
    // Validate each food entry
    for (const food of dietForm.foods) {
      if (!food.food.trim()) {
        alert("Food name cannot be empty.");
        return;
      }
      if (food.calorie < 0) {
        alert("Calorie cannot be negative.");
        return;
      }
      if (food.quantity <= 0) {
        alert("Quantity must be at least 1.");
        return;
      }
      // grams are optional
    }

    if (editIndex !== null) {
      // Edit Existing Entry
      const updatedDiet = [...dietData];
      updatedDiet[editIndex] = dietForm;
      setDietData(updatedDiet);
      localStorage.setItem("dietEntries", JSON.stringify(updatedDiet));
    } else {
      // Add New Entry
      const newDiet = [...dietData, dietForm];
      setDietData(newDiet);
      localStorage.setItem("dietEntries", JSON.stringify(newDiet));
    }

    handleClose();
  };

  // Handle Delete
  const handleDelete = (index: number) => {
    const confirm = window.confirm("Are you sure you want to delete this diet entry?");
    if (!confirm) return;

    const filteredDiet = dietData.filter((_, i) => i !== index);
    setDietData(filteredDiet);
    localStorage.setItem("dietEntries", JSON.stringify(filteredDiet));
  };

  // Handle Edit
  const handleEdit = (index: number) => {
    setDietForm(dietData[index]);
    setEditIndex(index);
    handleOpen();
  };

  // Handle Download as JSON
  const handleDownload = () => {
    const jsonData = JSON.stringify(dietData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dietEntries.json`;
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
  const processedDiet = sortData(
    filterData(dietData, "date", filterDate),
    "date",
    sortOrder
  );

  // Utility Functions to Get Start and Latest Dates
  const getStartDate = () => {
    if (dietData.length === 0) return "N/A";
    const sorted = [...dietData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0].date;
  };

  const getLatestDate = () => {
    if (dietData.length === 0) return "N/A";
    const sorted = [...dietData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].date;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Diet Entries
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Diet Entry" : "Add Diet Entry"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Diet Entries as JSON
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

      {/* Modal for Adding/Editing Diet Entries */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Diet Entry" : "Add New Diet Entry"}
          </Typography>
          {/* Diet Form Fields */}
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="date"
            value={dietForm.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Typography variant="h6" gutterBottom>
            Foods
          </Typography>
          {dietForm.foods.map((foodEntry, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={2}
              marginBottom={2}
            >
              <TextField
                label="Food"
                name="food"
                value={foodEntry.food}
                onChange={(e) =>
                  handleFoodChange(index, "food", e.target.value)
                }
                required
              />
              <TextField
                label="Calorie"
                type="number"
                name="calorie"
                value={foodEntry.calorie}
                onChange={(e) =>
                  handleFoodChange(index, "calorie", Number(e.target.value))
                }
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Quantity"
                type="number"
                name="quantity"
                value={foodEntry.quantity}
                onChange={(e) =>
                  handleFoodChange(index, "quantity", Number(e.target.value))
                }
                required
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Grams (optional)"
                type="number"
                name="grams"
                value={foodEntry.grams || ""}
                onChange={(e) =>
                  handleFoodChange(index, "grams", Number(e.target.value))
                }
              />
              <IconButton
                onClick={() => removeFoodEntry(index)}
                disabled={dietForm.foods.length === 1}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" onClick={addFoodEntry}>
            Add Food
          </Button>
          <TextField
            fullWidth
            margin="normal"
            label="Water (Liters)"
            type="number"
            name="water"
            value={dietForm.water}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
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

      {/* Diet Entries Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Food</TableCell>
              <TableCell>Calorie</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Grams</TableCell>
              <TableCell>Water (Liters)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedDiet.length > 0 ? (
              processedDiet.map((entry, index) =>
                entry.foods.map((food, i) => (
                  <TableRow key={`${index}-${i}`}>
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>{entry.date}</TableCell>
                    )}
                    <TableCell>{food.food}</TableCell>
                    <TableCell>{food.calorie}</TableCell>
                    <TableCell>{food.quantity}</TableCell>
                    <TableCell>{food.grams || "-"}</TableCell>
                    {i === 0 && <TableCell rowSpan={entry.foods.length}>{entry.water}</TableCell>}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        <IconButton onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No diet entries found.
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

export default Diet;
