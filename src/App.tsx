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
  workoutDetails: string[]; // New property for workout details
  mast: boolean;
  pn: boolean;
  steps: string;
};

// Diet data type
type DietData = {
  date: string;
  foods: string[];
  water: string; // Water intake in liters
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
  const [tab, setTab] = useState<"entries" | "diet">("entries");
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<FormData[]>([]);
  const [dietData, setDietData] = useState<DietData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    date: "",
    prayMorning: false,
    prayEvening: false,
    mast: false,
    pn: false,
    steps: "",
    workout: false,
    workoutDetails: [],
  });
  const [dietForm, setDietForm] = useState<DietData>({
    date: "",
    foods: [],
    water: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedEntries = JSON.parse(
        localStorage.getItem("entries") || "[]"
      ) as FormData[];
      setData(
        storedEntries.map((entry) => ({
          ...entry,
          workoutDetails: entry.workoutDetails || [],
        }))
      );

      const storedDiet = JSON.parse(
        localStorage.getItem("dietEntries") || "[]"
      ) as DietData[];
      setDietData(
        storedDiet.map((entry) => ({
          ...entry,
          foods: entry.foods || [],
          water: entry.water || "",
        }))
      );
    } catch {
      setData([]);
      setDietData([]);
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
    });
    setDietForm({ date: "", foods: [], water: "" });
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
          foods: value.split(",").map((food) => food.trim()), // Split by comma and trim whitespace
        });
      } else {
        setDietForm({
          ...dietForm,
          [name]: value,
        });
      }
    }
  };
  

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, arrayName: keyof FormData) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [arrayName]: value.split(","),
    });
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
    }
  };

  const handleEdit = (index: number) => {
    if (tab === "entries") {
      setFormData(data[index]);
      setEditIndex(index);
    } else if (tab === "diet") {
      setDietForm(dietData[index]);
      setEditIndex(index);
    }
    handleOpen();
  };

  const handleDownload = (type: "entries" | "diet") => {
    const jsonData = type === "entries" ? JSON.stringify(data, null, 2) : JSON.stringify(dietData, null, 2);
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
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginTop: "10px" }}
      >
        {tab === "entries" ? "Add Entry" : "Enter Day Diet"}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleDownload(tab)}
        style={{ marginLeft: "10px", marginTop: "10px" }}
      >
        Download {tab === "entries" ? "Entries" : "Diet"} as JSON
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
                value={formData.workoutDetails?.join(",") || ""}
                onChange={(e) => handleArrayChange(e, "workoutDetails")}
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
            </>
          ) : (
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
                  <TableCell>{row.workoutDetails?.join(", ") || ""}</TableCell>
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
                <TableCell>Foods</TableCell>
                <TableCell>Water (Liters)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dietData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.foods?.join(", ") || ""}</TableCell>
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
      )}
    </div>
  );
}

export default App;
