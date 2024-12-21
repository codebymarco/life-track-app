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

// Existing Form data types
type FormData = {
  date: string;
  prayMorning: boolean;
  prayEvening: boolean;
  workout: boolean;
  workoutDetails: string[];
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

// Places To Visit data type
type PlacesData = {
  place: string;
  visited: boolean;
};

// New Skills to Learn data type
type SkillsData = {
  skill: string;
  learned: boolean;
};

// New Passwords data type
type PasswordData = {
  appName: string;
  email: string;
  username: string;
  password: string;
};

// New Todo data type
type TodoData = {
  task: string;
  state: "todo" | "doing" | "done";
};

// New Notes data type
type NoteData = {
  name: string;
  body: string;
};

// Modal styling
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
  // Existing Tabs
  const [tab, setTab] = useState<
    | "entries"
    | "diet"
    | "journal"
    | "places"
    | "skills"
    | "passwords"
    | "todo"
    | "notes"
  >("entries");

  const [open, setOpen] = useState<boolean>(false);

  // Existing Data States
  const [data, setData] = useState<FormData[]>([]);
  const [dietData, setDietData] = useState<DietData[]>([]);
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  const [placesData, setPlacesData] = useState<PlacesData[]>([]);

  // New Data States
  const [skillsData, setSkillsData] = useState<SkillsData[]>([]);
  const [passwordsData, setPasswordsData] = useState<PasswordData[]>([]);
  const [todoData, setTodoData] = useState<TodoData[]>([]);
  const [notesData, setNotesData] = useState<NoteData[]>([]);

  // Existing Form States
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
    suntime: 0,
    jelqs: 0,
    stretch: false,
    pe: false,
    kegels: false,
    coding: "",
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

  const [placesForm, setPlacesForm] = useState<PlacesData>({
    place: "",
    visited: false,
  });

  // New Form States
  const [skillsForm, setSkillsForm] = useState<SkillsData>({
    skill: "",
    learned: false,
  });

  const [passwordForm, setPasswordForm] = useState<PasswordData>({
    appName: "",
    email: "",
    username: "",
    password: "",
  });

  const [todoForm, setTodoForm] = useState<TodoData>({
    task: "",
    state: "todo",
  });

  const [noteForm, setNoteForm] = useState<NoteData>({
    name: "",
    body: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Existing Sorting and Filtering State
  const [entriesSortOrder, setEntriesSortOrder] = useState<"asc" | "desc">("asc");
  const [entriesFilterDate, setEntriesFilterDate] = useState<string>("");

  const [dietSortOrder, setDietSortOrder] = useState<"asc" | "desc">("asc");
  const [dietFilterDate, setDietFilterDate] = useState<string>("");

  const [journalSortOrder, setJournalSortOrder] = useState<"asc" | "desc">("asc");
  const [journalFilterDate, setJournalFilterDate] = useState<string>("");

  // Existing Places To Visit Sorting and Filtering
  const [placesSortOrder, setPlacesSortOrder] = useState<"asc" | "desc">("asc");
  const [placesFilterVisited, setPlacesFilterVisited] =
    useState<boolean | "">("");

  // New Sorting and Filtering States

  // Skills To Learn Sorting and Filtering
  const [skillsSortOrder, setSkillsSortOrder] = useState<"asc" | "desc">("asc");
  const [skillsFilterLearned, setSkillsFilterLearned] =
    useState<boolean | "">("");

  // Passwords Sorting and Filtering
  const [passwordsSortOrder, setPasswordsSortOrder] =
    useState<"asc" | "desc">("asc");
  const [passwordsFilterApp, setPasswordsFilterApp] = useState<string>("");

  // Todo Sorting and Filtering
  const [todoSortOrder, setTodoSortOrder] = useState<"asc" | "desc">("asc");
  const [todoFilterState, setTodoFilterState] = useState<
    "todo" | "doing" | "done" | ""
  >("");

  // Notes Sorting and Filtering
  const [notesSortOrder, setNotesSortOrder] = useState<"asc" | "desc">("asc");
  const [notesFilterName, setNotesFilterName] = useState<string>("");

  useEffect(() => {
    try {
      // Existing Data Retrieval
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

      const storedJournal = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      ) as JournalData[];
      setJournalData(storedJournal);

      const storedPlaces = JSON.parse(
        localStorage.getItem("placesEntries") || "[]"
      ) as PlacesData[];
      setPlacesData(
        storedPlaces.map((entry) => ({
          ...entry,
          place: entry.place || "",
          visited: entry.visited || false,
        }))
      );

      // New Data Retrieval
      const storedSkills = JSON.parse(
        localStorage.getItem("skillsEntries") || "[]"
      ) as SkillsData[];
      setSkillsData(
        storedSkills.map((entry) => ({
          ...entry,
          skill: entry.skill || "",
          learned: entry.learned || false,
        }))
      );

      const storedPasswords = JSON.parse(
        localStorage.getItem("passwordsEntries") || "[]"
      ) as PasswordData[];
      setPasswordsData(
        storedPasswords.map((entry) => ({
          ...entry,
          appName: entry.appName || "",
          email: entry.email || "",
          username: entry.username || "",
          password: entry.password || "",
        }))
      );

      const storedTodo = JSON.parse(
        localStorage.getItem("todoEntries") || "[]"
      ) as TodoData[];
      setTodoData(
        storedTodo.map((entry) => ({
          ...entry,
          task: entry.task || "",
          state: entry.state || "todo",
        }))
      );

      const storedNotes = JSON.parse(
        localStorage.getItem("notesEntries") || "[]"
      ) as NoteData[];
      setNotesData(
        storedNotes.map((entry) => ({
          ...entry,
          name: entry.name || "",
          body: entry.body || "",
        }))
      );
    } catch {
      // Reset all data if parsing fails
      setData([]);
      setDietData([]);
      setJournalData([]);
      setPlacesData([]);
      setSkillsData([]);
      setPasswordsData([]);
      setTodoData([]);
      setNotesData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset all forms
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
      stretch: false,
      pe: false,
      kegels: false,
      coding: "",
    });
    setDietForm({ date: "", foods: [], water: "" });
    setJournalForm({ date: "", body: "" });
    setPlacesForm({ place: "", visited: false });
    setSkillsForm({ skill: "", learned: false });
    setPasswordForm({ appName: "", email: "", username: "", password: "" });
    setTodoForm({ task: "", state: "todo" });
    setNoteForm({ name: "", body: "" });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    switch (tab) {
      case "entries":
        setFormData((prev) => ({
          ...prev,
          [name!]:
            type === "checkbox"
              ? checked
              : name === "coding"
              ? value
              : value,
        }));
        break;
      case "diet":
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
        break;
      case "journal":
        setJournalForm({
          ...journalForm,
          [name!]: value,
        });
        break;
      case "places":
        if (name === "visited") {
          setPlacesForm({
            ...placesForm,
            visited: checked,
          });
        } else {
          setPlacesForm({
            ...placesForm,
            [name!]: value,
          });
        }
        break;
      case "skills":
        if (name === "learned") {
          setSkillsForm({
            ...skillsForm,
            learned: checked,
          });
        } else {
          setSkillsForm({
            ...skillsForm,
            [name!]: value,
          });
        }
        break;
      case "passwords":
        setPasswordForm({
          ...passwordForm,
          [name!]: value,
        });
        break;
      case "todo":
        if (name === "state") {
          setTodoForm({
            ...todoForm,
            state: value as "todo" | "doing" | "done",
          });
        } else {
          setTodoForm({
            ...todoForm,
            [name!]: value,
          });
        }
        break;
      case "notes":
        setNoteForm({
          ...noteForm,
          [name!]: value,
        });
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    switch (tab) {
      case "entries":
        // Convert 'coding' to number if possible
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
          const updatedData = [...data];
          updatedData[editIndex] = entryToSave;
          setData(updatedData);
          localStorage.setItem("entries", JSON.stringify(updatedData));
        } else {
          const newData = [...data, entryToSave];
          setData(newData);
          localStorage.setItem("entries", JSON.stringify(newData));
        }
        break;

      case "diet":
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
        break;

      case "journal":
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
        break;

      case "places":
        if (!placesForm.place.trim()) {
          alert("Place name cannot be empty.");
          return;
        }

        if (editIndex !== null) {
          const updatedPlaces = [...placesData];
          updatedPlaces[editIndex] = placesForm;
          setPlacesData(updatedPlaces);
          localStorage.setItem("placesEntries", JSON.stringify(updatedPlaces));
        } else {
          const newPlaces = [...placesData, placesForm];
          setPlacesData(newPlaces);
          localStorage.setItem("placesEntries", JSON.stringify(newPlaces));
        }
        break;

      case "skills":
        if (!skillsForm.skill.trim()) {
          alert("Skill name cannot be empty.");
          return;
        }

        if (editIndex !== null) {
          const updatedSkills = [...skillsData];
          updatedSkills[editIndex] = skillsForm;
          setSkillsData(updatedSkills);
          localStorage.setItem("skillsEntries", JSON.stringify(updatedSkills));
        } else {
          const newSkills = [...skillsData, skillsForm];
          setSkillsData(newSkills);
          localStorage.setItem("skillsEntries", JSON.stringify(newSkills));
        }
        break;

      case "passwords":
        if (
          !passwordForm.appName.trim() ||
          !passwordForm.email.trim() ||
          !passwordForm.username.trim() ||
          !passwordForm.password.trim()
        ) {
          alert("All fields are required.");
          return;
        }

        if (editIndex !== null) {
          const updatedPasswords = [...passwordsData];
          updatedPasswords[editIndex] = passwordForm;
          setPasswordsData(updatedPasswords);
          localStorage.setItem("passwordsEntries", JSON.stringify(updatedPasswords));
        } else {
          const newPasswords = [...passwordsData, passwordForm];
          setPasswordsData(newPasswords);
          localStorage.setItem("passwordsEntries", JSON.stringify(newPasswords));
        }
        break;

      case "todo":
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
        break;

      case "notes":
        if (!noteForm.name.trim()) {
          alert("Note name cannot be empty.");
          return;
        }

        if (editIndex !== null) {
          const updatedNotes = [...notesData];
          updatedNotes[editIndex] = noteForm;
          setNotesData(updatedNotes);
          localStorage.setItem("notesEntries", JSON.stringify(updatedNotes));
        } else {
          const newNotes = [...notesData, noteForm];
          setNotesData(newNotes);
          localStorage.setItem("notesEntries", JSON.stringify(newNotes));
        }
        break;

      default:
        break;
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    switch (tab) {
      case "entries":
        const filteredData = data.filter((_, i) => i !== index);
        setData(filteredData);
        localStorage.setItem("entries", JSON.stringify(filteredData));
        break;
      case "diet":
        const filteredDiet = dietData.filter((_, i) => i !== index);
        setDietData(filteredDiet);
        localStorage.setItem("dietEntries", JSON.stringify(filteredDiet));
        break;
      case "journal":
        const filteredJournal = journalData.filter((_, i) => i !== index);
        setJournalData(filteredJournal);
        localStorage.setItem("journalEntries", JSON.stringify(filteredJournal));
        break;
      case "places":
        const filteredPlaces = placesData.filter((_, i) => i !== index);
        setPlacesData(filteredPlaces);
        localStorage.setItem("placesEntries", JSON.stringify(filteredPlaces));
        break;
      case "skills":
        const filteredSkills = skillsData.filter((_, i) => i !== index);
        setSkillsData(filteredSkills);
        localStorage.setItem("skillsEntries", JSON.stringify(filteredSkills));
        break;
      case "passwords":
        const filteredPasswords = passwordsData.filter((_, i) => i !== index);
        setPasswordsData(filteredPasswords);
        localStorage.setItem("passwordsEntries", JSON.stringify(filteredPasswords));
        break;
      case "todo":
        const filteredTodo = todoData.filter((_, i) => i !== index);
        setTodoData(filteredTodo);
        localStorage.setItem("todoEntries", JSON.stringify(filteredTodo));
        break;
      case "notes":
        const filteredNotes = notesData.filter((_, i) => i !== index);
        setNotesData(filteredNotes);
        localStorage.setItem("notesEntries", JSON.stringify(filteredNotes));
        break;
      default:
        break;
    }
  };

  const handleEdit = (index: number) => {
    switch (tab) {
      case "entries":
        const entry = data[index];
        setFormData({
          ...entry,
          coding: entry.coding !== undefined ? String(entry.coding) : "",
        });
        break;
      case "diet":
        setDietForm(dietData[index]);
        break;
      case "journal":
        setJournalForm(journalData[index]);
        break;
      case "places":
        setPlacesForm(placesData[index]);
        break;
      case "skills":
        setSkillsForm(skillsData[index]);
        break;
      case "passwords":
        setPasswordForm(passwordsData[index]);
        break;
      case "todo":
        setTodoForm(todoData[index]);
        break;
      case "notes":
        setNoteForm(notesData[index]);
        break;
      default:
        break;
    }
    setEditIndex(index);
    handleOpen();
  };

  const handleDownload = (type:
    | "entries"
    | "diet"
    | "journal"
    | "places"
    | "skills"
    | "passwords"
    | "todo"
    | "notes") => {
    let jsonData = "";
    switch (type) {
      case "entries":
        jsonData = JSON.stringify(data, null, 2);
        break;
      case "diet":
        jsonData = JSON.stringify(dietData, null, 2);
        break;
      case "journal":
        jsonData = JSON.stringify(journalData, null, 2);
        break;
      case "places":
        jsonData = JSON.stringify(placesData, null, 2);
        break;
      case "skills":
        jsonData = JSON.stringify(skillsData, null, 2);
        break;
      case "passwords":
        jsonData = JSON.stringify(passwordsData, null, 2);
        break;
      case "todo":
        jsonData = JSON.stringify(todoData, null, 2);
        break;
      case "notes":
        jsonData = JSON.stringify(notesData, null, 2);
        break;
      default:
        break;
    }

    if (jsonData) {
      const blob = new Blob([jsonData], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${type}.json`;
      link.click();
    }
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
    return data.filter((item) => item[key] === filterValue);
  };

  // Processed Data for Rendering
  const processedEntries = sortData(
    filterData(data, "date", entriesFilterDate),
    "date",
    entriesSortOrder
  );

  const processedDiet = sortData(
    filterData(dietData, "date", dietFilterDate),
    "date",
    dietSortOrder
  );

  const processedJournal = sortData(
    filterData(journalData, "date", journalFilterDate),
    "date",
    journalSortOrder
  );

  const processedPlaces = sortData(
    filterData(placesData, "visited", placesFilterVisited),
    "place",
    placesSortOrder
  );

  // New Processed Data
  const processedSkills = sortData(
    filterData(skillsData, "learned", skillsFilterLearned),
    "skill",
    skillsSortOrder
  );

  const processedPasswords = sortData(
    filterData(passwordsData, "appName", passwordsFilterApp),
    "appName",
    passwordsSortOrder
  );

  const processedTodo = sortData(
    filterData(todoData, "state", todoFilterState),
    "task",
    todoSortOrder
  );

  const processedNotes = sortData(
    filterData(notesData, "name", notesFilterName),
    "name",
    notesSortOrder
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Tabs */}
      <div style={{ marginBottom: "10px", flexWrap: "wrap" }}>
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
        <Button
          variant={tab === "places" ? "contained" : "outlined"}
          onClick={() => setTab("places")}
          style={{ marginLeft: "10px" }}
        >
          Places to Visit
        </Button>
        <Button
          variant={tab === "skills" ? "contained" : "outlined"}
          onClick={() => setTab("skills")}
          style={{ marginLeft: "10px" }}
        >
          Skills to Learn
        </Button>
        <Button
          variant={tab === "passwords" ? "contained" : "outlined"}
          onClick={() => setTab("passwords")}
          style={{ marginLeft: "10px" }}
        >
          Passwords
        </Button>
        <Button
          variant={tab === "todo" ? "contained" : "outlined"}
          onClick={() => setTab("todo")}
          style={{ marginLeft: "10px" }}
        >
          Todo
        </Button>
        <Button
          variant={tab === "notes" ? "contained" : "outlined"}
          onClick={() => setTab("notes")}
          style={{ marginLeft: "10px" }}
        >
          Notes
        </Button>
      </div>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {tab === "entries"
            ? "Add Entry"
            : tab === "diet"
            ? "Enter Day Diet"
            : tab === "journal"
            ? "Add Journal"
            : tab === "places"
            ? "Add Place"
            : tab === "skills"
            ? "Add Skill"
            : tab === "passwords"
            ? "Add Password"
            : tab === "todo"
            ? "Add Task"
            : tab === "notes"
            ? "Add Note"
            : "Add"}
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
            : tab === "journal"
            ? "Journal"
            : tab === "places"
            ? "Places"
            : tab === "skills"
            ? "Skills"
            : tab === "passwords"
            ? "Passwords"
            : tab === "todo"
            ? "Todo"
            : tab === "notes"
            ? "Notes"
            : ""}
          {" as JSON"}
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
        {tab !== "passwords" && tab !== "todo" && tab !== "notes" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Sort by {tab === "skills" ? "Skill" : tab === "places" ? "Place" : "Date"}</InputLabel>
            <Select
              label={`Sort by ${
                tab === "skills" ? "Skill" : tab === "places" ? "Place" : "Date"
              }`}
              value={
                tab === "entries"
                  ? entriesSortOrder
                  : tab === "diet"
                  ? dietSortOrder
                  : tab === "journal"
                  ? journalSortOrder
                  : tab === "places"
                  ? placesSortOrder
                  : tab === "skills"
                  ? skillsSortOrder
                  : ""
              }
              onChange={(e) => {
                const order = e.target.value as "asc" | "desc";
                if (tab === "entries") setEntriesSortOrder(order);
                else if (tab === "diet") setDietSortOrder(order);
                else if (tab === "journal") setJournalSortOrder(order);
                else if (tab === "places") setPlacesSortOrder(order);
                else if (tab === "skills") setSkillsSortOrder(order);
              }}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        )}

        {tab === "passwords" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Sort by App Name</InputLabel>
            <Select
              label="Sort by App Name"
              value={passwordsSortOrder}
              onChange={(e) => setPasswordsSortOrder(e.target.value as "asc" | "desc")}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="asc">A to Z</MenuItem>
              <MenuItem value="desc">Z to A</MenuItem>
            </Select>
          </FormControl>
        )}

        {tab === "todo" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Sort by Task</InputLabel>
            <Select
              label="Sort by Task"
              value={todoSortOrder}
              onChange={(e) => setTodoSortOrder(e.target.value as "asc" | "desc")}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="asc">A to Z</MenuItem>
              <MenuItem value="desc">Z to A</MenuItem>
            </Select>
          </FormControl>
        )}

        {tab === "notes" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Sort by Name</InputLabel>
            <Select
              label="Sort by Name"
              value={notesSortOrder}
              onChange={(e) => setNotesSortOrder(e.target.value as "asc" | "desc")}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="asc">A to Z</MenuItem>
              <MenuItem value="desc">Z to A</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Filtering */}
        {tab !== "places" && tab !== "skills" && tab !== "passwords" && tab !== "notes" && tab !== "todo" && (
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
                : tab === "journal"
                ? journalFilterDate
                : ""
            }
            onChange={(e) => {
              const date = e.target.value;
              if (tab === "entries") setEntriesFilterDate(date);
              else if (tab === "diet") setDietFilterDate(date);
              else if (tab === "journal") setJournalFilterDate(date);
            }}
          />
        )}

        {tab === "places" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Filter by Visited</InputLabel>
            <Select
              label="Filter by Visited"
              value={placesFilterVisited}
              onChange={(e) => setPlacesFilterVisited(e.target.value as boolean | "")}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={true}>Visited</MenuItem>
              <MenuItem value={false}>Not Visited</MenuItem>
            </Select>
          </FormControl>
        )}

        {tab === "skills" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Filter by Learned</InputLabel>
            <Select
              label="Filter by Learned"
              value={skillsFilterLearned}
              onChange={(e) => setSkillsFilterLearned(e.target.value as boolean | "")}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={true}>Learned</MenuItem>
              <MenuItem value={false}>Not Learned</MenuItem>
            </Select>
          </FormControl>
        )}

        {tab === "passwords" && (
          <TextField
            label="Filter by App Name"
            type="text"
            size="small"
            value={passwordsFilterApp}
            onChange={(e) => setPasswordsFilterApp(e.target.value)}
          />
        )}

        {tab === "todo" && (
          <FormControl variant="outlined" size="small">
            <InputLabel>Filter by State</InputLabel>
            <Select
              label="Filter by State"
              value={todoFilterState}
              onChange={(e) => setTodoFilterState(e.target.value as "todo" | "doing" | "done" | "")}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="doing">Doing</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        )}

        {tab === "notes" && (
          <TextField
            label="Filter by Name"
            type="text"
            size="small"
            value={notesFilterName}
            onChange={(e) => setNotesFilterName(e.target.value)}
          />
        )}

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            // Reset all filters based on current tab
            switch (tab) {
              case "entries":
                setEntriesFilterDate("");
                break;
              case "diet":
                setDietFilterDate("");
                break;
              case "journal":
                setJournalFilterDate("");
                break;
              case "places":
                setPlacesFilterVisited("");
                break;
              case "skills":
                setSkillsFilterLearned("");
                break;
              case "passwords":
                setPasswordsFilterApp("");
                break;
              case "todo":
                setTodoFilterState("");
                break;
              case "notes":
                setNotesFilterName("");
                break;
              default:
                break;
            }
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
              {/* Existing Entry Form Fields */}
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
            </>
          ) : tab === "diet" ? (
            <>
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
          ) : tab === "journal" ? (
            <>
              {/* Journal Form Fields */}
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
          ) : tab === "places" ? (
            <>
              {/* Places To Visit Form Fields */}
              <TextField
                fullWidth
                margin="normal"
                label="Place"
                name="place"
                value={placesForm.place}
                onChange={handleChange}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={placesForm.visited}
                    name="visited"
                    onChange={handleChange}
                  />
                }
                label="Visited"
              />
            </>
          ) : tab === "skills" ? (
            <>
              {/* Skills To Learn Form Fields */}
              <TextField
                fullWidth
                margin="normal"
                label="Skill"
                name="skill"
                value={skillsForm.skill}
                onChange={handleChange}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={skillsForm.learned}
                    name="learned"
                    onChange={handleChange}
                  />
                }
                label="Learned"
              />
            </>
          ) : tab === "passwords" ? (
            <>
              {/* Passwords Form Fields */}
              <TextField
                fullWidth
                margin="normal"
                label="App Name"
                name="appName"
                value={passwordForm.appName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                name="email"
                value={passwordForm.email}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={passwordForm.username}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                name="password"
                value={passwordForm.password}
                onChange={handleChange}
                required
              />
            </>
          ) : tab === "todo" ? (
            <>
              {/* Todo Form Fields */}
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
            </>
          ) : tab === "notes" ? (
            <>
              {/* Notes Form Fields */}
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={noteForm.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Body"
                name="body"
                value={noteForm.body}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </>
          ) : null}

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
                  <TableCell colSpan={14} align="center">
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
      ) : tab === "journal" ? (
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
      ) : tab === "places" ? (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Place</TableCell>
                <TableCell>Visited</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedPlaces.length > 0 ? (
                processedPlaces.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.place}</TableCell>
                    <TableCell>{row.visited ? "Yes" : "No"}</TableCell>
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
                    No places to visit found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : tab === "skills" ? (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Skill</TableCell>
                <TableCell>Learned</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedSkills.length > 0 ? (
                processedSkills.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.skill}</TableCell>
                    <TableCell>{row.learned ? "Yes" : "No"}</TableCell>
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
                    No skills to learn found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : tab === "passwords" ? (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>App Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedPasswords.length > 0 ? (
                processedPasswords.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.appName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>
                      <input
                        type="password"
                        value={row.password}
                        readOnly
                        style={{ border: "none", background: "transparent" }}
                      />
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
                  <TableCell colSpan={5} align="center">
                    No passwords found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : tab === "todo" ? (
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
      ) : tab === "notes" ? (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Body</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processedNotes.length > 0 ? (
                processedNotes.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
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
                    No notes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
  );
}

export default App;
