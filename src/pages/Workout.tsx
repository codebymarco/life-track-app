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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Type Definitions
type FormData = {
  date: string;
  deltRaiseFoward: number;
  deltRaiseSide: number;
  pullupsUnder: number;
  pullupsOver: number;
  bicepCurls: number;
  bicepCurlsReverse: number;
  workout: boolean;
  nose: boolean;
  kneeTucks: boolean;
  workoutTime: number; // New Field
  calfRaise: number; // New Field
  pushUps: number; // New Field
  legRaise: number; // New Field
  kickOuts: number; // New Field
  crunches: number;
  obliques: number;
  crunchesReverse: number;
  bikeDistance: number;
  bikeTime: number;
  wristGrips: number;
  footballkeepUps: number;
  footballAtw: number;
  footballAtwLeft: number;
  stretch: boolean;
  squats: number;
  sitDown: number;
  steps: number;
  lunges: number;
  tricepCurls: number;
  hammerCurls: number;
  masai: number;
  footballkneeUps: number;
  indoor: number;
};

// New Type for Processed Entries
type ProcessedEntry = {
  entry: FormData;
  originalIndex: number;
};

// Styles using makeStyles
const useStyles = makeStyles({
  weekend: {
    backgroundColor: "dodgerblue",
    color: "white",
  },
  weekday: {
    backgroundColor: "aquamarine",
    color: "white",
  },
  container: {
    padding: "8px",
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

const Workout: React.FC = () => {
  const classes = useStyles();

  // State Management
  const [data, setData] = useState<FormData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    date: "",
    pullupsOver: 0,
    pullupsUnder: 0,
    bicepCurlsReverse: 0,
    deltRaiseFoward: 0,
    steps: 0,
    deltRaiseSide: 0,
    bicepCurls: 0,
    workout: false,
    nose: false,
    kneeTucks: false,
    workoutTime: 0, // New Field
    calfRaise: 0, // New Field
    pushUps: 0, // New Field
    legRaise: 0, // New Field
    crunches: 0, // New Field
    obliques: 0, // New Field
    kickOuts: 0, // New Field
    crunchesReverse: 0,
    bikeDistance: 0,
    bikeTime: 0,
    wristGrips: 0,
    footballkeepUps: 0,
    footballkneeUps: 0,
    indoor: 0,
    footballAtw: 0,
    footballAtwLeft: 0,
    stretch: false,
    squats: 0,
    sitDown: 0,
    lunges: 0,
    hammerCurls: 0,
    tricepCurls: 0,
    masai: 0,
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
        localStorage.getItem("workoutEntries") || "[]"
      ) as FormData[];
      setData(
        storedEntries.map((entry) => ({
          ...entry,
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
      deltRaiseFoward: 0,
      steps: 0,
      deltRaiseSide: 0,
      bicepCurls: 0,
      workout: false,
      nose: false,
      kneeTucks: false,
      workoutTime: 0, // New Field
      calfRaise: 0, // New Field
      pushUps: 0, // New Field
      legRaise: 0, // New Field
      crunches: 0, // New Field
      obliques: 0, // New Field
      kickOuts: 0, // New Field
      crunchesReverse: 0,
      bikeDistance: 0,
      bikeTime: 0,
      wristGrips: 0,
      footballkeepUps: 0,
      footballkneeUps: 0,
      indoor: 0,
      footballAtw: 0,
      footballAtwLeft: 0,
      stretch: false,
      squats: 0,
      sitDown: 0,
      lunges: 0,
      hammerCurls: 0,
      tricepCurls: 0,
      masai: 0,
      pullupsUnder: 0,
      pullupsOver: 0,
      bicepCurlsReverse: 0,
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

  // Handle Save (Add/Edit)
  const handleSave = () => {
    const entryToSave: FormData = {
      ...formData,
    };

    if (editIndex !== null) {
      // Edit Existing Entry
      const updatedData = data.map((entry, idx) =>
        idx === editIndex ? entryToSave : entry
      );
      setData(updatedData);
      localStorage.setItem("workoutEntries", JSON.stringify(updatedData));
    } else {
      // Add New Entry
      const newData = [...data, entryToSave];
      setData(newData);
      localStorage.setItem("workoutEntries", JSON.stringify(newData));
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
    localStorage.setItem("workoutEntries", JSON.stringify(filteredData));
  };

  // Handle Edit using Original Index
  const handleEdit = (originalIndex: number) => {
    const entry = data[originalIndex];
    setFormData({
      ...entry,
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
    link.download = `workoutEntries.json`;
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
        Workout
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
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="deltRaiseFoward"
            type="number"
            name="deltRaiseFoward"
            value={formData.deltRaiseFoward}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="deltRaiseSide"
            type="number"
            name="deltRaiseSide"
            value={formData.deltRaiseSide}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="bicepCurls"
            type="number"
            name="bicepCurls"
            value={formData.bicepCurls}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="steps"
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
            label="workoutTime"
            type="number"
            name="workoutTime"
            value={formData.workoutTime}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="calfRaise"
            type="number"
            name="calfRaise"
            value={formData.calfRaise}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="pushUps"
            type="number"
            name="pushUps"
            value={formData.pushUps}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="legRaise"
            type="number"
            name="legRaise"
            value={formData.legRaise}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="kickOuts"
            type="number"
            name="kickOuts"
            value={formData.kickOuts}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="crunches"
            type="number"
            name="crunches"
            value={formData.crunches}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="obliques"
            type="number"
            name="obliques"
            value={formData.obliques}
            onChange={handleChange}
            inputProps={{ min: 0 }}
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

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.nose}
                name="nose"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>Nose</Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.kneeTucks}
                name="kneeTucks"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography className={classes.checkboxLabel}>
                kneeTucks
              </Typography>
            }
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

          {/* bike km Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="bikeDistance"
            type="number"
            name="bikeDistance"
            value={formData.bikeDistance}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* bike time Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="bikeTime"
            type="number"
            name="bikeTime"
            value={formData.bikeTime}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* pullupsOver */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="pullupsOver"
            type="number"
            name="pullupsOver"
            value={formData.pullupsOver}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* pullupsUnder */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="pullupsUnder"
            type="number"
            name="pullupsUnder"
            value={formData.pullupsUnder}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* pullupsUnder */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="bicepCurlsReverse"
            type="number"
            name="bicepCurlsReverse"
            value={formData.bicepCurlsReverse}
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
            name="wristGrips"
            value={formData.wristGrips}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* wrist grips Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="crunchesReverse"
            type="number"
            name="crunchesReverse"
            value={formData.crunchesReverse}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* wrist grips Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="footballkeepUps"
            type="number"
            name="footballkeepUps"
            value={formData.footballkeepUps}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="footballkneeUps"
            type="number"
            name="footballkneeUps"
            value={formData.footballkneeUps}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="indoor"
            type="number"
            name="indoor"
            value={formData.indoor}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* wrist grips Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="footballAtw"
            type="number"
            name="footballAtw"
            value={formData.footballAtw}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="footballAtwLeft"
            type="number"
            name="footballAtwLeft"
            value={formData.footballAtwLeft}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* wrist grips Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="wristGrips"
            type="number"
            name="wristGrips"
            value={formData.wristGrips}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="squats"
            type="number"
            name="squats"
            value={formData.squats}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="sitDown"
            type="number"
            name="sitDown"
            value={formData.sitDown}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="lunges"
            type="number"
            name="lunges"
            value={formData.lunges}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="hammerCurls"
            type="number"
            name="hammerCurls"
            value={formData.hammerCurls}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="tricepCurls"
            type="number"
            name="tricepCurls"
            value={formData.tricepCurls}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          {/* keepups Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className={classes.textField}
            label="masai"
            type="number"
            name="masai"
            value={formData.masai}
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
                <strong>steps:</strong> {viewEntry.steps || "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>delt Raise Foward:</strong>{" "}
                {viewEntry.deltRaiseFoward ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>bicepCurls:</strong>{" "}
                {viewEntry.bicepCurls ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>workout:</strong>{" "}
                {viewEntry.workout ? <CheckCircleIcon /> : <CancelIcon />}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>nose:</strong>{" "}
                {viewEntry.nose ? <CheckCircleIcon /> : <CancelIcon />}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>kneeTucks:</strong>{" "}
                {viewEntry.kneeTucks ? <CheckCircleIcon /> : <CancelIcon />}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>workoutTime:</strong>{" "}
                {viewEntry.workoutTime ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>calfRaise:</strong> {viewEntry.calfRaise ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>pushUps:</strong> {viewEntry.pushUps ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>legRaise:</strong> {viewEntry.legRaise ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>crunches:</strong> {viewEntry.crunches ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>obliques:</strong> {viewEntry.obliques ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>kickOuts:</strong> {viewEntry.kickOuts ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>crunchesReverse:</strong>{" "}
                {viewEntry.crunchesReverse ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>bikeDistance:</strong>{" "}
                {viewEntry.bikeDistance ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>bikeTime:</strong> {viewEntry.bikeTime ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>wristGrips:</strong>{" "}
                {viewEntry.wristGrips ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>footballkeepUps:</strong>{" "}
                {viewEntry.footballkeepUps ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>footballkneeUps:</strong>{" "}
                {viewEntry.footballkneeUps ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>indoor:</strong> {viewEntry.indoor ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>footballAtw:</strong>{" "}
                {viewEntry.footballAtw ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>footballAtwLeft:</strong>{" "}
                {viewEntry.footballAtwLeft ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>stretch:</strong>{" "}
                {viewEntry.stretch ? <CheckCircleIcon /> : <CancelIcon />}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>squats:</strong> {viewEntry.squats ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>sitDown:</strong> {viewEntry.sitDown ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>lunges:</strong> {viewEntry.lunges ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>hammerCurls:</strong>{" "}
                {viewEntry.hammerCurls ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>tricepCurls:</strong>{" "}
                {viewEntry.tricepCurls ? "Yes" : "No"}
              </Typography>

              <Typography style={{ fontSize: "0.85rem" }}>
                <strong>masai:</strong> {viewEntry.masai ? "Yes" : "No"}
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
              <TableCell className={classes.tableHeader}>actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedEntries.length > 0 ? (
              processedEntries.map(({ entry, originalIndex }) => {
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
                      {/* Added View Button */}
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
                  colSpan={18} // Updated colSpan after removing one column
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

export default Workout;
