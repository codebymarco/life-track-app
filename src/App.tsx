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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Form data types
type FormData = {
  date: string;
  prayMorning: boolean;
  prayEvening: boolean;
  workout: boolean;
  workoutDetails: string[]; // Keep this as an array
  mast: boolean;
  pn: boolean;
  steps: string;
  suntime: number;
  jelqs: number;
  stretch: boolean; // new attribute for stretch
  pe: boolean; // new attribute for PE
  kegels: boolean; // new attribute for kegels
  coding?: number; // ✅ Made coding optional and in minutes
};

// Diet data type
type DietData = {
  date: string;
  foods: string[];
  water: string;
};

// Journal data type
type JournalData = {
  date: string;
  body: string;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [tab, setTab] = useState<"entries" | "diet" | "journal">("entries");
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<FormData[]>([]);
  const [dietData, setDietData] = useState<DietData[]>([]);
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  
  // Modify formData to handle 'coding' as string for input purposes
  const [formData, setFormData] = useState<Omit<FormData, 'coding'> & { coding: string }>({
    date: "",
    prayMorning: false,
    prayEvening: false,
    mast: false,
    pn: false,
    steps: "",
    workout: false,
    workoutDetails: [],
    suntime: 0,
    jelqs: 0,
    stretch: false, // initialize stretch
    pe: false, // initialize PE
    kegels: false, // initialize kegels
    coding: "", // ✅ Initialize coding as empty string
  });
  const [dietForm, setDietForm] = useState<DietData>({
    date: "",
    foods: [],
    water: "",
  });
  const [journalForm, setJournalForm] = useState<JournalData>({
    date: "",
    body: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering State
  const [entriesSortOrder, setEntriesSortOrder] = useState<"asc" | "desc">("asc");
  const [entriesFilterDate, setEntriesFilterDate] = useState<string>("");

  const [dietSortOrder, setDietSortOrder] = useState<"asc" | "desc">("asc");
  const [dietFilterDate, setDietFilterDate] = useState<string>("");

  const [journalSortOrder, setJournalSortOrder] = useState<"asc" | "desc">("asc");
  const [journalFilterDate, setJournalFilterDate] = useState<string>("");

  useEffect(() => {
    try {
      const storedEntries = JSON.parse(localStorage.getItem("entries") || "[]") as FormData[];
      setData(
        storedEntries.map((entry) => ({
          ...entry,
          workoutDetails: entry.workoutDetails || [], // Ensure workoutDetails is always an array
          // Remove default 0 for coding, keep as undefined if not present
          coding: entry.coding !== undefined ? entry.coding : undefined,
        }))
      );

      const storedDiet = JSON.parse(localStorage.getItem("dietEntries") || "[]") as DietData[];
      setDietData(
        storedDiet.map((entry) => ({
          ...entry,
          foods: entry.foods || [],
          water: entry.water || "",
        }))
      );

      const storedJournal = JSON.parse(localStorage.getItem("journalEntries") || "[]") as JournalData[];
      setJournalData(storedJournal);
    } catch {
      setData([]);
      setDietData([]);
      setJournalData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      date: "",
      prayMorning: false,
      prayEvening: false,
      mast: false,
      pn: false,
      steps: "",
      workout: false,
      workoutDetails: [],
      suntime: 0,
      jelqs: 0,
      stretch: false, // reset stretch
      pe: false, // reset PE
      kegels: false, // reset kegels
      coding: "", // ✅ Reset coding to empty string
    });
    setDietForm({ date: "", foods: [], water: "" });
    setJournalForm({ date: "", body: "" });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (tab === "entries") {
      setFormData((prev) => ({
        ...prev,
        [name!]:
          type === "checkbox"
            ? checked
            : name === "coding"
            ? value // Keep 'coding' as string for input
            : value,
      }));
    } else if (tab === "diet") {
      if (name === "foods") {
        setDietForm({
          ...dietForm,
          foods: (value as string)
            .split(",")
            .map((food) => food.trim())
            .filter((food) => food !== ""),
        });
      } else {
        setDietForm({
          ...dietForm,
          [name!]: value,
        });
      }
    } else if (tab === "journal") {
      setJournalForm({
        ...journalForm,
        [name!]: value,
      });
    }
  };

  const handleSave = () => {
    if (tab === "entries") {
      // Convert 'coding' to number if possible
      const codingNumber = formData.coding ? Number(formData.coding) : undefined;
      if (isNaN(codingNumber!)) {
        alert("Please enter a valid number for Coding (minutes).");
        return;
      }

      const entryToSave: FormData = {
        ...formData,
        coding: codingNumber,
      };

      if (editIndex !== null) {
        const updatedData = [...data];
        updatedData[editIndex] = entryToSave;
        setData(updatedData);
        localStorage.setItem("entries", JSON.stringify(updatedData));
      } else {
        const newData = [...data, entryToSave];
        setData(newData);
        localStorage.setItem("entries", JSON.stringify(newData));
      }
    } else if (tab === "diet") {
      if (editIndex !== null) {
        const updatedDiet = [...dietData];
        updatedDiet[editIndex] = dietForm;
        setDietData(updatedDiet);
        localStorage.setItem("dietEntries", JSON.stringify(updatedDiet));
      } else {
        const newDiet = [...dietData, dietForm];
        setDietData(newDiet);
        localStorage.setItem("dietEntries", JSON.stringify(newDiet));
      }
    } else if (tab === "journal") {
      if (editIndex !== null) {
        const updatedJournal = [...journalData];
        updatedJournal[editIndex] = journalForm;
        setJournalData(updatedJournal);
        localStorage.setItem("journalEntries", JSON.stringify(updatedJournal));
      } else {
        const newJournal = [...journalData, journalForm];
        setJournalData(newJournal);
        localStorage.setItem("journalEntries", JSON.stringify(newJournal));
      }
    }
    handleClose();
  };

  const handleDelete = (index: number) => {
    if (tab === "entries") {
      const filteredData = data.filter((_, i) => i !== index);
      setData(filteredData);
      localStorage.setItem("entries", JSON.stringify(filteredData));
    } else if (tab === "diet") {
      const filteredDiet = dietData.filter((_, i) => i !== index);
      setDietData(filteredDiet);
      localStorage.setItem("dietEntries", JSON.stringify(filteredDiet));
    } else if (tab === "journal") {
      const filteredJournal = journalData.filter((_, i) => i !== index);
      setJournalData(filteredJournal);
      localStorage.setItem("journalEntries", JSON.stringify(filteredJournal));
    }
  };

  const handleEdit = (index: number) => {
    if (tab === "entries") {
      const entry = data[index];
      setFormData({
        ...entry,
        coding: entry.coding !== undefined ? String(entry.coding) : "", // Convert number to string for input
      });
      setEditIndex(index);
    } else if (tab === "diet") {
      setDietForm(dietData[index]);
      setEditIndex(index);
    } else if (tab === "journal") {
      setJournalForm(journalData[index]);
      setEditIndex(index);
    }
    handleOpen();
  };

  const handleDownload = (type: "entries" | "diet" | "journal") => {
    const jsonData =
      type === "entries"
        ? JSON.stringify(data, null, 2)
        : type === "diet"
        ? JSON.stringify(dietData, null, 2)
        : JSON.stringify(journalData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${type}.json`;
    link.click();
  };

  // Sorting and Filtering Functions
  const sortData = <T extends { date: string }>(
    data: T[],
    order: "asc" | "desc"
  ): T[] => {
    return [...data].sort((a, b) => {
      if (a.date < b.date) return order === "asc" ? -1 : 1;
      if (a.date > b.date) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterData = <T extends { date: string }>(
    data: T[],
    filterDate: string
  ): T[] => {
    if (!filterDate) return data;
    return data.filter((item) => item.date === filterDate);
  };

  // Processed Data for Rendering
  const processedEntries = sortData(
    filterData(data, entriesFilterDate),
    entriesSortOrder
  );
  const processedDiet = sortData(
    filterData(dietData, dietFilterDate),
    dietSortOrder
  );
  const processedJournal = sortData(
    filterData(journalData, journalFilterDate),
    journalSortOrder
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant={tab === "entries" ? "contained" : "outlined"}
          onClick={() => setTab("entries")}
        >
          Entries
        </Button>
        <Button
          variant={tab === "diet" ? "contained" : "outlined"}
          onClick={() => setTab("diet")}
          style={{ marginLeft: "10px" }}
        >
          Diet
        </Button>
        <Button
          variant={tab === "journal" ? "contained" : "outlined"}
          onClick={() => setTab("journal")}
          style={{ marginLeft: "10px" }}
        >
          Day Journal
        </Button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {tab === "entries"
            ? "Add Entry"
            : tab === "diet"
            ? "Enter Day Diet"
            : "Add Journal"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleDownload(tab)}
          style={{ marginLeft: "10px" }}
        >
          Download{" "}
          {tab === "entries"
            ? "Entries"
            : tab === "diet"
            ? "Diet"
            : "Journal"}{" "}
          as JSON
        </Button>
      </div>

      {/* Sorting and Filtering Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        {/* Sorting */}
        <FormControl variant="outlined" size="small">
          <InputLabel>Sort by Date</InputLabel>
          <Select
            label="Sort by Date"
            value={
              tab === "entries"
                ? entriesSortOrder
                : tab === "diet"
                ? dietSortOrder
                : journalSortOrder
            }
            onChange={(e) => {
              const order = e.target.value as "asc" | "desc";
              if (tab === "entries") setEntriesSortOrder(order);
              else if (tab === "diet") setDietSortOrder(order);
              else setJournalSortOrder(order);
            }}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Filtering */}
        <TextField
          label="Filter by Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={
            tab === "entries"
              ? entriesFilterDate
              : tab === "diet"
              ? dietFilterDate
              : journalFilterDate
          }
          onChange={(e) => {
            const date = e.target.value;
            if (tab === "entries") setEntriesFilterDate(date);
            else if (tab === "diet") setDietFilterDate(date);
            else setJournalFilterDate(date);
          }}
        />

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            if (tab === "entries") setEntriesFilterDate("");
            else if (tab === "diet") setDietFilterDate("");
            else setJournalFilterDate("");
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {tab === "entries" ? (
            <>
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
                <TextField
                  fullWidth
                  margin="normal"
                  label="Workout Details (comma-separated)"
                  name="workoutDetails"
                  value={formData.workoutDetails.join(",")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workoutDetails: e.target.value
                        .split(",")
                        .map((detail) => detail.trim())
                        .filter((detail) => detail !== ""),
                    })
                  }
                />
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
                label="Jeqls(strokes)"
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
              {/* ✅ Updated TextField for Coding in Minutes */}
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
            </>
          ) : tab === "diet" ? (
            <>
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
              <TextField
                fullWidth
                margin="normal"
                label="Foods (comma-separated)"
                name="foods"
                value={dietForm.foods?.join(",") || ""}
                onChange={handleChange}
              />
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
            </>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Date"
                type="date"
                name="date"
                value={journalForm.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Journal Body"
                name="body"
                value={journalForm.body}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </>
          )}
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

      {/* Tables */}
      {tab === "entries" ? (
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
                <TableCell>Suntime</TableCell>
                <TableCell>Jelqs</TableCell>
                <TableCell>Stretch</TableCell>
                <TableCell>PE</TableCell>
                <TableCell>Kegels</TableCell>
                {/* ✅ Updated Table Header for Coding in Minutes */}
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
                    <TableCell>{row.suntime}</TableCell>
                    <TableCell>{row.jelqs}</TableCell>
                    <TableCell>{row.stretch ? "Yes" : "No"}</TableCell>
                    <TableCell>{row.pe ? "Yes" : "No"}</TableCell>
                    <TableCell>{row.kegels ? "Yes" : "No"}</TableCell>
                    {/* ✅ Display Coding in Minutes */}
                    <TableCell>{row.coding !== undefined ? row.coding : "-"}</TableCell>
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
                  <TableCell colSpan={13} align="center">
                    No entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : tab === "diet" ? (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Foods</TableCell>
                <TableCell>Water (Liters)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedDiet.length > 0 ? (
                processedDiet.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.foods.join(", ")}</TableCell>
                    <TableCell>{row.water}</TableCell>
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
                    No diet entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Body</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedJournal.length > 0 ? (
                processedJournal.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.body}</TableCell>
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
                    No journal entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default App;
