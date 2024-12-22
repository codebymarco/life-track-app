// src/EntriesPage.tsx

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

// Type Definitions
type FormData = {
  date: string;
  prayMorning: boolean;
  prayEvening: boolean;
  workout: boolean;
  workoutDetails: string[];
  workoutTime: number; // New Field
  sleepTime: number; // New Field
  poop: number; // New Field
  numberOfShowers: number; // New Field
  no_of_kegels: number; // New Field
  mast: boolean;
  pn: boolean;
  steps: string;
  suntime: number;
  jelqs: number;
  stretch: boolean;
  pe: boolean;
  kegels: boolean;
  coding?: number;
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

const Entries: React.FC = () => {
  // State Management
  const [data, setData] = useState<FormData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    Omit<FormData, "coding"> & { coding: string }
  >({
    date: "",
    prayMorning: false,
    prayEvening: false,
    mast: false,
    pn: false,
    steps: "",
    workout: false,
    workoutDetails: [],
    workoutTime: 0, // New Field
    sleepTime: 0, // New Field
    poop: 0, // New Field
    numberOfShowers: 0, // New Field
    no_of_kegels: 0, // New Field
    suntime: 0,
    jelqs: 0,
    stretch: false,
    pe: false,
    kegels: false,
    coding: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // Load Data from localStorage on Mount
  useEffect(() => {
    try {
      const storedEntries = JSON.parse(
        localStorage.getItem("entries") || "[]"
      ) as FormData[];
      setData(
        storedEntries.map((entry) => ({
          ...entry,
          workoutDetails: entry.workoutDetails || [],
          coding: entry.coding !== undefined ? entry.coding : undefined,
        }))
      );
    } catch {
      setData([]);
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
    setFormData({
      date: "",
      prayMorning: false,
      prayEvening: false,
      mast: false,
      pn: false,
      steps: "",
      workout: false,
      workoutDetails: [],
      workoutTime: 0, // New Field
      sleepTime: 0, // New Field
      poop: 0, // New Field
      numberOfShowers: 0, // New Field
      no_of_kegels: 0, // New Field
      suntime: 0,
      jelqs: 0,
      stretch: false,
      pe: false,
      kegels: false,
      coding: "",
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

    setFormData((prev) => ({
      ...prev,
      [name!]:
        type === "checkbox"
          ? checked
          : name === "coding"
          ? value
          : value,
    }));
  };

  // Handle Changes in Workout Details
  const handleWorkoutDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const details = e.target.value
      .split(",")
      .map((detail) => detail.trim())
      .filter((detail) => detail !== "");
    setFormData((prev) => ({
      ...prev,
      workoutDetails: details,
    }));
  };

  // Handle Save (Add/Edit)
  const handleSave = () => {
    // Validate Coding Field
    const codingNumber = formData.coding ? Number(formData.coding) : undefined;
    if (formData.coding && isNaN(codingNumber!)) {
      alert("Please enter a valid number for Coding (minutes).");
      return;
    }

    const entryToSave: FormData = {
      ...formData,
      coding: formData.coding ? codingNumber : undefined,
    };

    if (editIndex !== null) {
      // Edit Existing Entry
      const updatedData = [...data];
      updatedData[editIndex] = entryToSave;
      setData(updatedData);
      localStorage.setItem("entries", JSON.stringify(updatedData));
    } else {
      // Add New Entry
      const newData = [...data, entryToSave];
      setData(newData);
      localStorage.setItem("entries", JSON.stringify(newData));
    }

    handleClose();
  };

  // Handle Delete
  const handleDelete = (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    const filteredData = data.filter((_, i) => i !== index);
    setData(filteredData);
    localStorage.setItem("entries", JSON.stringify(filteredData));
  };

  // Handle Edit
  const handleEdit = (index: number) => {
    const entry = data[index];
    setFormData({
      ...entry,
      coding: entry.coding !== undefined ? String(entry.coding) : "",
    });
    setEditIndex(index);
    handleOpen();
  };

  // Handle Download as JSON
  const handleDownload = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `entries.json`;
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
  const processedEntries = sortData(
    filterData(data, "date", filterDate),
    "date",
    sortOrder
  );

  // Utility Functions to Get Start and Latest Dates
  const getStartDate = () => {
    if (data.length === 0) return "N/A";
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0].date;
  };

  const getLatestDate = () => {
    if (data.length === 0) return "N/A";
    const sorted = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].date;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        General
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Entry" : "Add Entry"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Entries as JSON
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

      {/* Modal for Adding/Editing Entries */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Entry" : "Add New Entry"}
          </Typography>
          {/* Entry Form Fields */}
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.prayMorning}
                name="prayMorning"
                onChange={handleChange}
              />
            }
            label="Pray Morning"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.workout}
                name="workout"
                onChange={handleChange}
              />
            }
            label="Workout"
          />
          {formData.workout && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Workout Details (comma-separated)"
                name="workoutDetails"
                value={formData.workoutDetails.join(",")}
                onChange={handleWorkoutDetailsChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Workout Time (minutes)"
                type="number"
                name="workoutTime"
                value={formData.workoutTime}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.prayEvening}
                name="prayEvening"
                onChange={handleChange}
              />
            }
            label="Pray Evening"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.mast}
                name="mast"
                onChange={handleChange}
              />
            }
            label="Mast"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.pn}
                name="pn"
                onChange={handleChange}
              />
            }
            label="PN"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Steps"
            type="number"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sleep Time (hours)"
            type="number"
            name="sleepTime"
            value={formData.sleepTime}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Number of Poops"
            type="number"
            name="poop"
            value={formData.poop}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Number of Showers"
            type="number"
            name="numberOfShowers"
            value={formData.numberOfShowers}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Number of Kegels (5-second hold)"
            type="number"
            name="no_of_kegels"
            value={formData.no_of_kegels}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Suntime (minutes)"
            type="number"
            name="suntime"
            value={formData.suntime}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Jelqs (strokes)"
            type="number"
            name="jelqs"
            value={formData.jelqs}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.stretch}
                name="stretch"
                onChange={handleChange}
              />
            }
            label="Stretch"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.pe}
                name="pe"
                onChange={handleChange}
              />
            }
            label="PE"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.kegels}
                name="kegels"
                onChange={handleChange}
              />
            }
            label="Kegels"
          />
          {/* Coding Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Coding (minutes)"
            type="number"
            name="coding"
            value={formData.coding}
            onChange={handleChange}
            inputProps={{ min: 0 }}
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

      {/* Entries Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Pray Morning</TableCell>
              <TableCell>Pray Evening</TableCell>
              <TableCell>Mast</TableCell>
              <TableCell>PN</TableCell>
              <TableCell>Steps</TableCell>
              <TableCell>Workout</TableCell>
              <TableCell>Workout Details</TableCell>
              <TableCell>Workout Time (min)</TableCell> {/* New Field */}
              <TableCell>Sleep Time (hrs)</TableCell> {/* New Field */}
              <TableCell>Poop</TableCell> {/* New Field */}
              <TableCell>Number of Showers</TableCell> {/* New Field */}
              <TableCell>No. of Kegels</TableCell> {/* New Field */}
              <TableCell>Suntime</TableCell>
              <TableCell>Jelqs</TableCell>
              <TableCell>Stretch</TableCell>
              <TableCell>PE</TableCell>
              <TableCell>Kegels</TableCell>
              <TableCell>Coding (minutes)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedEntries.length > 0 ? (
              processedEntries.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.prayMorning ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.prayEvening ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.mast ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.pn ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.steps}</TableCell>
                  <TableCell>{row.workout ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.workoutDetails.join(", ")}</TableCell>
                  <TableCell>{row.workoutTime}</TableCell> {/* New Field */}
                  <TableCell>{row.sleepTime}</TableCell> {/* New Field */}
                  <TableCell>{row.poop}</TableCell> {/* New Field */}
                  <TableCell>{row.numberOfShowers}</TableCell> {/* New Field */}
                  <TableCell>{row.no_of_kegels}</TableCell> {/* New Field */}
                  <TableCell>{row.suntime}</TableCell>
                  <TableCell>{row.jelqs}</TableCell>
                  <TableCell>{row.stretch ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.pe ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.kegels ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {row.coding !== undefined ? row.coding : "-"}
                  </TableCell>
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
                <TableCell colSpan={19} align="center">
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Optional: Display Tracking Period and Statistics */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Tracking Period</Typography>
        <Typography variant="body1">Start Date: {getStartDate()}</Typography>
        <Typography variant="body1">Latest Date: {getLatestDate()}</Typography>

        {/* Additional statistics can be added here if desired */}
      </Box>
    </div>
  );
};

export default Entries;
