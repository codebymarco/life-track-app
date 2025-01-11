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
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import Visibility Icon
import { makeStyles } from "@mui/styles";

// Type Definitions
type FormData = {
  date: string;
  prayMorning: boolean;
  prayEvening: boolean;
  workout: boolean;
  workoutDetails: string[];
  workoutTime: number; // New Field
  firstMeal: string; // New Field
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
  bike_time?: number;
  bike_km?: number;
  keep_ups?: number;
  wrist_grips?: number;
};

// New Type for Processed Entries
type ProcessedEntry = {
  entry: FormData;
  originalIndex: number;
};

// Styles using makeStyles
const useStyles = makeStyles({
  container: {
    padding: "8px",
  },
  tableCell: {
    padding: "16px",
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

const Entries: React.FC = () => {
  const classes = useStyles();

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
    bike_time: 0,
    bike_km: 0,
    keep_ups: 0,
    wrist_grips: 0,
    firstMeal: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // State for View Modal
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [viewEntry, setViewEntry] = useState<FormData | null>(null);

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

  // Handle View Modal Open/Close
  const handleViewOpen = (entry: FormData) => {
    setViewEntry(entry);
    setViewOpen(true);
  };
  const handleViewClose = () => {
    setViewOpen(false);
    setViewEntry(null);
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
      bike_time: 0,
      bike_km: 0,
      keep_ups: 0,
      wrist_grips: 0,
      firstMeal: "",
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
        type === "checkbox" ? checked : name === "coding" ? value : value,
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
      const updatedData = data.map((entry, idx) =>
        idx === editIndex ? entryToSave : entry
      );
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

  // Handle Delete using Original Index
  const handleDelete = (originalIndex: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    const filteredData = data.filter((_, i) => i !== originalIndex);
    setData(filteredData);
    localStorage.setItem("entries", JSON.stringify(filteredData));
  };

  // Handle Edit using Original Index
  const handleEdit = (originalIndex: number) => {
    const entry = data[originalIndex];
    setFormData({
      ...entry,
      coding: entry.coding !== undefined ? String(entry.coding) : "",
    });
    setEditIndex(originalIndex);
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

  // Sorting Function for ProcessedEntry
  const sortData = (
    data: ProcessedEntry[],
    key: keyof FormData,
    order: "asc" | "desc"
  ): ProcessedEntry[] => {
    return [...data].sort((a, b) => {
      if (a.entry[key] < b.entry[key]) return order === "asc" ? -1 : 1;
      if (a.entry[key] > b.entry[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtering Function for ProcessedEntry
  const filterData = (
    data: ProcessedEntry[],
    key: keyof FormData,
    filterValue: any
  ): ProcessedEntry[] => {
    if (filterValue === "" || filterValue === null) return data;
    return data.filter((item) => {
      if (typeof filterValue === "boolean") {
        return item.entry[key] === filterValue;
      } else if (typeof filterValue === "string") {
        return item.entry[key]
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      return item.entry[key] === filterValue;
    });
  };

  // Processed Entries with Original Indices
  const processedEntries: ProcessedEntry[] = sortData(
    filterData(
      data.map((entry, index) => ({ entry, originalIndex: index })),
      "date",
      filterDate
    ),
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
    <div className={classes.container}>
      <Typography className={classes.title} gutterBottom>
        General
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "6px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className={classes.button}
          size="small"
        >
          {editIndex !== null ? "Edit" : "Add"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          className={classes.button}
          size="small"
        >
          JSON
        </Button>
      </div>

      {/* Sorting and Filtering Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {/* Sorting */}
        <FormControl
          variant="outlined"
          size="small"
          className={classes.formControl}
        >
          <InputLabel style={{ fontSize: "0.65rem" }}>Sort</InputLabel>
          <Select
            label="Sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            classes={{ icon: classes.selectInput, select: classes.selectInput }}
          >
            <MenuItem value="asc">Asc</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </Select>
        </FormControl>

        {/* Filter by Date */}
        <TextField
          label="Filter"
          type="date"
          size="small"
          variant="outlined"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: "0.65rem" },
          }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ maxWidth: 140 }}
        />

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterDate("");
            setSortOrder("asc");
          }}
          size="small"
          className={classes.button}
        >
          Reset
        </Button>
      </div>

      {/* Modal for Adding/Editing Entries */}
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.modalBox}>
          <Typography gutterBottom style={{ fontSize: "0.85rem" }}>
            {editIndex !== null ? "Edit Entry" : "Add Entry"}
          </Typography>
          {/* Entry Form Fields */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
              style: { fontSize: "0.65rem" },
            }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.prayMorning}
                name="prayMorning"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>
                Pray Morning
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.workout}
                name="workout"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>Workout</Typography>
            }
          />
          {formData.workout && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                className={classes.textField}
                label="Workout Details"
                name="workoutDetails"
                value={formData.workoutDetails.join(",")}
                onChange={handleWorkoutDetailsChange}
                placeholder="Comma-separated"
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                className={classes.textField}
                label="Workout Time"
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
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>
                Pray Evening
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.mast}
                name="mast"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>Mast</Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.pn}
                name="pn"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>PN</Typography>
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Steps"
            type="number"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Sleep Time"
            type="number"
            name="sleepTime"
            value={formData.sleepTime}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Number of Poops"
            type="number"
            name="poop"
            value={formData.poop}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Number of Showers"
            type="number"
            name="numberOfShowers"
            value={formData.numberOfShowers}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Number of Kegels"
            type="number"
            name="no_of_kegels"
            value={formData.no_of_kegels}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Suntime"
            type="number"
            name="suntime"
            value={formData.suntime}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Jelqs"
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
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>Stretch</Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.pe}
                name="pe"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>PE</Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.kegels}
                name="kegels"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>Kegels</Typography>
            }
          />
          {/* Coding Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Coding"
            type="number"
            name="coding"
            value={formData.coding}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* bike km Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Bike km"
            type="number"
            name="bike_km"
            value={formData.bike_km}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* bike time Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Bike Time"
            type="number"
            name="bike_time"
            value={formData.bike_time}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* wrist grips Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Wrist Grips"
            type="number"
            name="wrist_grips"
            value={formData.wrist_grips}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="Keepups"
            type="number"
            name="keep_ups"
            value={formData.keep_ups}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            size="small"
            style={{
              marginTop: "6px",
              padding: "4px 8px",
              fontSize: "0.65rem",
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>

      {/* Modal for Viewing Entry Details */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box className={classes.viewModalBox}>
          <Typography
            gutterBottom
            style={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            Entry Details
          </Typography>
          {viewEntry && (
            <div>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Date:</strong> {viewEntry.date}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Pray Morning:</strong>{" "}
                {viewEntry.prayMorning ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Pray Evening:</strong>{" "}
                {viewEntry.prayEvening ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Mast:</strong> {viewEntry.mast ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>PN:</strong> {viewEntry.pn ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Steps:</strong> {viewEntry.steps}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Workout:</strong> {viewEntry.workout ? "Yes" : "No"}
              </Typography>
              {viewEntry.workout && (
                <>
                  <Typography style={{ fontSize: "0.85rem" }}>
                    <strong>Workout Details:</strong>{" "}
                    {viewEntry.workoutDetails.join(", ")}
                  </Typography>
                  <Typography style={{ fontSize: "0.85rem" }}>
                    <strong>Workout Time:</strong> {viewEntry.workoutTime}{" "}
                    minutes
                  </Typography>
                </>
              )}
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Sleep Time:</strong> {viewEntry.sleepTime} hours
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Number of Poops:</strong> {viewEntry.poop}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Number of Showers:</strong> {viewEntry.numberOfShowers}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Number of Kegels:</strong> {viewEntry.no_of_kegels}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Suntime:</strong> {viewEntry.suntime} minutes
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Jelqs:</strong> {viewEntry.jelqs} minutes
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Stretch:</strong> {viewEntry.stretch ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>PE:</strong> {viewEntry.pe ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Kegels Done:</strong> {viewEntry.kegels ? "Yes" : "No"}
              </Typography>
              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>Coding:</strong>{" "}
                {viewEntry.coding !== undefined
                  ? `${viewEntry.coding} minutes`
                  : "-"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewClose}
                size="small"
                style={{
                  marginTop: "12px",
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                }}
              >
                Close
              </Button>
            </div>
          )}
        </Box>
      </Modal>

      {/* Entries Table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>Date</TableCell>
              <TableCell className={classes.tableHeader}>Pray M</TableCell>
              <TableCell className={classes.tableHeader}>Pray E</TableCell>
              <TableCell className={classes.tableHeader}>Mast</TableCell>
              <TableCell className={classes.tableHeader}>PN</TableCell>
              <TableCell className={classes.tableHeader}>Steps</TableCell>
              <TableCell className={classes.tableHeader}>Workout</TableCell>
              {/* Removed Workout Details Column */}
              <TableCell className={classes.tableHeader}>
                Workout Time
              </TableCell>
              <TableCell className={classes.tableHeader}>Sleep</TableCell>
              <TableCell className={classes.tableHeader}>Poop</TableCell>
              <TableCell className={classes.tableHeader}>Showers</TableCell>
              <TableCell className={classes.tableHeader}>
                Kegels Count
              </TableCell>{" "}
              {/* Renamed */}
              <TableCell className={classes.tableHeader}>Suntime</TableCell>
              <TableCell className={classes.tableHeader}>Jelqs</TableCell>
              <TableCell className={classes.tableHeader}>Stretch</TableCell>
              {/* Renamed */}
              <TableCell className={classes.tableHeader}>Coding</TableCell>
              <TableCell className={classes.tableHeader}>keepsups</TableCell>
              <TableCell className={classes.tableHeader}>bike_time</TableCell>
              <TableCell className={classes.tableHeader}>bike_km</TableCell>
              <TableCell className={classes.tableHeader}>wrist_grip</TableCell>
              <TableCell className={classes.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedEntries.length > 0 ? (
              processedEntries.map(({ entry, originalIndex }) => {
                // JavaScript logic must be inside curly braces in the map callback
                const dateObject = new Date(entry.date);
                const dayOfWeek = dateObject.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const dayName = dateObject.toLocaleDateString("en-US", {
                  weekday: "long",
                });

                return (
                  <TableRow key={originalIndex}>
                    <TableCell
                      className={`${classes.tableCell} ${
                        isWeekend ? classes.weekend : classes.weekday
                      }`}
                    >
                      {entry.date} - {dayName}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.prayMorning ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.prayEvening ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.mast ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.pn ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.steps}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.workout ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.workoutTime}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.sleepTime}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.poop}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.numberOfShowers}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.no_of_kegels}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.suntime}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.jelqs}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.stretch ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.coding !== undefined ? entry.coding : "-"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.keep_ups !== undefined ? entry.keep_ups : "-"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.bike_time !== undefined ? entry.bike_time : "-"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.bike_km !== undefined ? entry.bike_km : "-"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {entry.wrist_grips !== undefined
                        ? entry.wrist_grips
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <IconButton
                        onClick={() => handleEdit(originalIndex)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(originalIndex)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleViewOpen(entry)}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={18}
                  align="center"
                  className={classes.tableCell}
                >
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Optional: Display Tracking Period and Statistics */}
      <Box className={classes.trackingBox}>
        <Typography style={{ fontSize: "0.75rem", fontWeight: "bold" }}>
          Tracking Period
        </Typography>
        <Typography style={{ fontSize: "0.65rem" }}>
          Start Date: {getStartDate()}
        </Typography>
        <Typography style={{ fontSize: "0.65rem" }}>
          Latest Date: {getLatestDate()}
        </Typography>
        {/* Additional statistics can be added here if desired */}
      </Box>
    </div>
  );
};

export default Entries;
