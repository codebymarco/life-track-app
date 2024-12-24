import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

type Exercise = {
  name: string;
  reps: string;
};

type WorkoutData = {
  workoutName: string;
  exercises: Exercise[];
};

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

function Workout() {
  const [open, setOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [workoutForm, setWorkoutForm] = useState<WorkoutData>({
    workoutName: "",
    exercises: [],
  });
  const [viewWorkout, setViewWorkout] = useState<WorkoutData | null>(null);
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    reps: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedWorkout = JSON.parse(localStorage.getItem("workoutEntries") || "[]") as WorkoutData[];
      setWorkoutData(storedWorkout);
    } catch {
      setWorkoutData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setWorkoutForm({ workoutName: "", exercises: [] });
    setEditIndex(null);
    setNewExercise({ name: "", reps: "" });
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewWorkout(null);
  };

  const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addExercise = () => {
    if (!newExercise.name.trim() || !newExercise.reps.trim()) {
      alert("Exercise name and reps cannot be empty.");
      return;
    }
    setWorkoutForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
    setNewExercise({ name: "", reps: "" });
  };

  const removeExercise = (index: number) => {
    setWorkoutForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!workoutForm.workoutName.trim()) {
      alert("Workout name cannot be empty.");
      return;
    }

    if (editIndex !== null) {
      const updatedWorkout = [...workoutData];
      updatedWorkout[editIndex] = workoutForm;
      setWorkoutData(updatedWorkout);
      localStorage.setItem("workoutEntries", JSON.stringify(updatedWorkout));
    } else {
      const newWorkout = [...workoutData, workoutForm];
      setWorkoutData(newWorkout);
      localStorage.setItem("workoutEntries", JSON.stringify(newWorkout));
    }

    handleClose();
  };

  const handleEdit = (index: number) => {
    setWorkoutForm(workoutData[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDelete = (index: number) => {
    const filteredWorkout = workoutData.filter((_, i) => i !== index);
    setWorkoutData(filteredWorkout);
    localStorage.setItem("workoutEntries", JSON.stringify(filteredWorkout));
  };

  const handleView = (workout: WorkoutData) => {
    setViewWorkout(workout);
    setViewOpen(true);
  };

  const handleDownload = (workout: WorkoutData) => {
    const textData = `Workout Name: ${workout.workoutName}\n\nExercises:\n${workout.exercises
      .map((exercise, index) => `${index + 1}. ${exercise.name} - ${exercise.reps}`)
      .join("\n")}`;
    const blob = new Blob([textData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${workout.workoutName}.txt`;
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Workout Tracker
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Workout
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Workout" : "Add Workout"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Workout Name"
            name="workoutName"
            value={workoutForm.workoutName}
            onChange={handleWorkoutChange}
            required
          />
          <Typography variant="subtitle1" gutterBottom>
            Exercises
          </Typography>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <TextField
              label="Exercise Name"
              name="name"
              value={newExercise.name}
              onChange={handleExerciseChange}
              required
            />
            <TextField
              label="Reps"
              name="reps"
              value={newExercise.reps}
              onChange={handleExerciseChange}
              required
            />
            <Button variant="outlined" onClick={addExercise}>
              Add
            </Button>
          </div>
          <ul>
            {workoutForm.exercises.map((exercise, index) => (
              <li key={index}>
                {exercise.name} - {exercise.reps}{" "}
                <Button size="small" onClick={() => removeExercise(index)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
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

      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {viewWorkout?.workoutName}
          </Typography>
          <ul>
            {viewWorkout?.exercises.map((exercise, index) => (
              <li key={index}>
                {exercise.name} - {exercise.reps}
              </li>
            ))}
          </ul>
          <Button variant="text" onClick={handleViewClose}>
            Close
          </Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Workout Name</TableCell>
              <TableCell>Exercises</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workoutData.length > 0 ? (
              workoutData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.workoutName}</TableCell>
                  <TableCell>
                    {row.exercises.slice(0, 2).map((ex) => `${ex.name} (${ex.reps})`).join(", ")}
                    {row.exercises.length > 2 && " ..."}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(row)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDownload(row)}>
                      <DownloadIcon />
                    </IconButton>
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
                  No workouts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Workout;
