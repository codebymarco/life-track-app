// SkillsPage.tsx
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
import { v4 as uuidv4 } from 'uuid';

// Define the SkillsData type with a unique identifier
type SkillsData = {
  id: string; // Unique identifier
  skill: string;
  learned: boolean;
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

function SkillsPage() {
  const [skillsData, setSkillsData] = useState<SkillsData[]>([]);
  const [skillsForm, setSkillsForm] = useState<SkillsData>({
    id: "",
    skill: "",
    learned: false,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedSkills = JSON.parse(
        localStorage.getItem("skillsEntries") || "[]"
      ) as SkillsData[];

      // Assign unique IDs if not present
      const initializedSkills = storedSkills.map((entry) => ({
        id: entry.id || uuidv4(),
        skill: entry.skill || "",
        learned: entry.learned || false,
      }));
      setSkillsData(initializedSkills);
      localStorage.setItem("skillsEntries", JSON.stringify(initializedSkills));
    } catch {
      setSkillsData([]);
    }
  }, []);

  // Open and Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSkillsForm({
      id: "",
      skill: "",
      learned: false,
    });
    setEditId(null);
  };

  // Handle Form Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSkillsForm({
      ...skillsForm,
      [name!]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Save (Add or Edit)
  const handleSave = () => {
    // Validate skill name
    if (!skillsForm.skill.trim()) {
      alert("Skill name cannot be empty.");
      return;
    }

    if (editId) {
      // Editing an existing skill
      const updatedSkills = skillsData.map(skill =>
        skill.id === editId ? skillsForm : skill
      );
      setSkillsData(updatedSkills);
      localStorage.setItem("skillsEntries", JSON.stringify(updatedSkills));
    } else {
      // Adding a new skill with a unique ID
      const newSkill = { ...skillsForm, id: uuidv4() };
      const newSkills = [...skillsData, newSkill];
      setSkillsData(newSkills);
      localStorage.setItem("skillsEntries", JSON.stringify(newSkills));
    }

    handleClose();
  };

  // Handle Edit
  const handleEdit = (id: string) => {
    const skillToEdit = skillsData.find(skill => skill.id === id);
    if (skillToEdit) {
      setSkillsForm(skillToEdit);
      setEditId(id);
      handleOpen();
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this skill?");
    if (confirmed) {
      const filteredSkills = skillsData.filter(skill => skill.id !== id);
      setSkillsData(filteredSkills);
      localStorage.setItem("skillsEntries", JSON.stringify(filteredSkills));
    }
  };

  // Sorting and Filtering
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterLearned, setFilterLearned] = useState<boolean | "">("");

  // Function to sort data
  const sortData = (data: SkillsData[], order: "asc" | "desc"): SkillsData[] => {
    return [...data].sort((a, b) => {
      if (a.skill.toLowerCase() < b.skill.toLowerCase()) return order === "asc" ? -1 : 1;
      if (a.skill.toLowerCase() > b.skill.toLowerCase()) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Function to filter data
  const filterData = (data: SkillsData[], learnedFilter: boolean | ""): SkillsData[] => {
    if (learnedFilter === "") return data;
    return data.filter(skill => skill.learned === learnedFilter);
  };

  // Processed Data for Rendering
  const processedSkills = sortData(filterData(skillsData, filterLearned), sortOrder);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Skills to Learn
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Add Skill
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            const jsonData = JSON.stringify(skillsData, null, 2);
            const blob = new Blob([jsonData], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `skills_to_learn.json`;
            link.click();
          }}
          style={{ marginLeft: "10px" }}
        >
          Download as JSON
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
          <InputLabel>Sort by Skill</InputLabel>
          <Select
            label="Sort by Skill"
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
          <InputLabel>Filter by Learned</InputLabel>
          <Select
            label="Filter by Learned"
            value={filterLearned}
            onChange={(e) =>
              setFilterLearned(e.target.value as boolean | "")
            }
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={true}>Learned</MenuItem>
            <MenuItem value={false}>Not Learned</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setSortOrder("asc");
            setFilterLearned("");
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Skill" : "Add Skill"}
          </Typography>
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
              <TableCell>Skill</TableCell>
              <TableCell>Learned</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedSkills.length > 0 ? (
              processedSkills.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.skill}</TableCell>
                  <TableCell>{row.learned ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(row.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}>
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
    </div>
  );
}

export default SkillsPage;