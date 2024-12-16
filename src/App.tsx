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
  stretch: boolean; // new attribute for stretch
  pe: boolean; // new attribute for PE
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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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
  const [formData, setFormData] = useState<FormData>({
    date: "",
    prayMorning: false,
    prayEvening: false,
    mast: false,
    pn: false,
    steps: "",
    workout: false,
    workoutDetails: [],
    suntime: 0,
    stretch: false, // initialize stretch
    pe: false, // initialize PE
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

  useEffect(() => {
    try {
      const storedEntries = JSON.parse(localStorage.getItem("entries") || "[]") as FormData[];
      setData(storedEntries.map((entry) => ({
        ...entry,
        workoutDetails: entry.workoutDetails || [], // Ensure workoutDetails is always an array
      })));

      const storedDiet = JSON.parse(localStorage.getItem("dietEntries") || "[]") as DietData[];
      setDietData(storedDiet.map((entry) => ({
        ...entry,
        foods: entry.foods || [],
        water: entry.water || "",
      })));

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
      stretch: false, // reset stretch
      pe: false, // reset PE
    });
    setDietForm({ date: "", foods: [], water: "" });
    setJournalForm({ date: "", body: "" });
    setEditIndex(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (tab === "entries") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else if (tab === "diet") {
      if (name === "foods") {
        setDietForm({
          ...dietForm,
          foods: value.split(",").map((food) => food.trim()),
        });
      } else {
        setDietForm({
          ...dietForm,
          [name]: value,
        });
      }
    } else if (tab === "journal") {
      setJournalForm({
        ...journalForm,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    if (tab === "entries") {
      if (editIndex !== null) {
        const updatedData = [...data];
        updatedData[editIndex] = formData;
        setData(updatedData);
        localStorage.setItem("entries", JSON.stringify(updatedData));
      } else {
        setData([...data, formData]);
        localStorage.setItem("entries", JSON.stringify([...data, formData]));
      }
    } else if (tab === "diet") {
      if (editIndex !== null) {
        const updatedDiet = [...dietData];
        updatedDiet[editIndex] = dietForm;
        setDietData(updatedDiet);
        localStorage.setItem("dietEntries", JSON.stringify(updatedDiet));
      } else {
        setDietData([...dietData, dietForm]);
        localStorage.setItem("dietEntries", JSON.stringify([...dietData, dietForm]));
      }
    } else if (tab === "journal") {
      if (editIndex !== null) {
        const updatedJournal = [...journalData];
        updatedJournal[editIndex] = journalForm;
        setJournalData(updatedJournal);
        localStorage.setItem("journalEntries", JSON.stringify(updatedJournal));
      } else {
        setJournalData([...journalData, journalForm]);
        localStorage.setItem("journalEntries", JSON.stringify([...journalData, journalForm]));
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
      setFormData(data[index]);
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

  return (
    <div>
      <div>
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

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginTop: "10px" }}
      >
        {tab === "entries" ? "Add Entry" : tab === "diet" ? "Enter Day Diet" : "Add Journal"}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleDownload(tab)}
        style={{ marginLeft: "10px", marginTop: "10px" }}
      >
        Download {tab === "entries" ? "Entries" : tab === "diet" ? "Diet" : "Journal"} as JSON
      </Button>

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
              <TextField
                fullWidth
                margin="normal"
                label="Workout Details (comma-separated)"
                name="workoutDetails"
                value={formData.workoutDetails.join(",")}
                onChange={(e) => setFormData({
                  ...formData,
                  workoutDetails: e.target.value.split(",").map((detail) => detail.trim())
                })}
              />
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
              />
              <TextField
                fullWidth
                margin="normal"
                label="Suntime"
                type="number"
                name="suntime"
                value={formData.suntime}
                onChange={handleChange}
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
                <TableCell>Stretch</TableCell>
                <TableCell>PE</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
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
                  <TableCell>{row.stretch ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.pe ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
              {dietData.map((row, index) => (
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
              ))}
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
              {journalData.map((row, index) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default App;
