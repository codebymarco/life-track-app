// Cooking.tsx
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

// Recipe data type
type Recipe = {
  name: string;
  teacher: string;
  ingredients: string[];
  tools: string[];
  instructions: string[];
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

function Cooking() {
  const [open, setOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeForm, setRecipeForm] = useState<Recipe>({
    name: "",
    teacher: "",
    ingredients: [],
    tools: [],
    instructions: [],
  });
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState<string>("");

  // Load recipes from localStorage
  useEffect(() => {
    try {
      const storedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]") as Recipe[];
      setRecipes(storedRecipes);
    } catch {
      setRecipes([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRecipeForm({ name: "", teacher: "", ingredients: [], tools: [], instructions: [] });
    setEditIndex(null);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewRecipe(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRecipeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayAdd = (field: "ingredients" | "tools" | "instructions") => {
    if (currentInput.trim() === "") return;
    setRecipeForm((prev) => ({
      ...prev,
      [field]: [...prev[field], currentInput],
    }));
    setCurrentInput("");
  };

  const handleArrayRemove = (field: "ingredients" | "tools" | "instructions", index: number) => {
    setRecipeForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!recipeForm.name.trim() || !recipeForm.teacher.trim()) {
      alert("Name and teacher are required.");
      return;
    }

    if (editIndex !== null) {
      const updatedRecipes = [...recipes];
      updatedRecipes[editIndex] = recipeForm;
      setRecipes(updatedRecipes);
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    } else {
      const newRecipes = [...recipes, recipeForm];
      setRecipes(newRecipes);
      localStorage.setItem("recipes", JSON.stringify(newRecipes));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
        const filteredRecipes = recipes.filter((_, i) => i !== index);
        setRecipes(filteredRecipes);
        localStorage.setItem("recipes", JSON.stringify(filteredRecipes));
    }
};

  const handleEdit = (index: number) => {
    setRecipeForm(recipes[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleView = (index: number) => {
    setViewRecipe(recipes[index]);
    setViewOpen(true);
  };

  const handleDownload = (index: number) => {
    const recipe = recipes[index];
    const textContent = `Name: ${recipe.name}\nTeacher: ${recipe.teacher}\n\nIngredients:\n${recipe.ingredients.join("\n")}\n\nTools:\n${recipe.tools.join("\n")}\n\nInstructions:\n${recipe.instructions.join("\n")}`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${recipe.name.replace(/\s+/g, "_")}.txt`;
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Recipe Manager
      </Typography>

      {/* Add Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        {editIndex !== null ? "Edit Recipe" : "Add Recipe"}
      </Button>

      {/* Modal for Viewing */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Recipe Details
          </Typography>
          {viewRecipe && (
            <>
              <Typography variant="subtitle1"><strong>Name:</strong> {viewRecipe.name}</Typography>
              <Typography variant="subtitle1"><strong>Teacher:</strong> {viewRecipe.teacher}</Typography>
              <Typography variant="subtitle1"><strong>Ingredients:</strong></Typography>
              <ul>
                {viewRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <Typography variant="subtitle1"><strong>Tools:</strong></Typography>
              <ul>
                {viewRecipe.tools.map((tool, index) => (
                  <li key={index}>{tool}</li>
                ))}
              </ul>
              <Typography variant="subtitle1"><strong>Instructions:</strong></Typography>
              <ul>
                {viewRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </>
          )}
          <Button variant="contained" color="secondary" onClick={handleViewClose} style={{ marginTop: "10px" }}>Close</Button>
        </Box>
      </Modal>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Recipe" : "Add Recipe"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Recipe Name"
            name="name"
            value={recipeForm.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Teacher"
            name="teacher"
            value={recipeForm.teacher}
            onChange={handleChange}
            required
          />

          <Typography variant="subtitle1">Ingredients</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              label="Add Ingredient"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
            <Button onClick={() => handleArrayAdd("ingredients")}>Add</Button>
          </Box>
          <ul>
            {recipeForm.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient}
                <IconButton onClick={() => handleArrayRemove("ingredients", index)}>
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>

          <Typography variant="subtitle1">Tools</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              label="Add Tool"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
            <Button onClick={() => handleArrayAdd("tools")}>Add</Button>
          </Box>
          <ul>
            {recipeForm.tools.map((tool, index) => (
              <li key={index}>
                {tool}
                <IconButton onClick={() => handleArrayRemove("tools", index)}>
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>

          <Typography variant="subtitle1">Instructions</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              label="Add Instruction"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
            <Button onClick={() => handleArrayAdd("instructions")}>Add</Button>
          </Box>
          <ul>
            {recipeForm.instructions.map((instruction, index) => (
              <li key={index}>
                {instruction}
                <IconButton onClick={() => handleArrayRemove("instructions", index)}>
                  <DeleteIcon />
                </IconButton>
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <TableRow key={index}>
                  <TableCell>{recipe.name}</TableCell>
                  <TableCell>{recipe.teacher}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(index)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDownload(index)}>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No recipes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Cooking;
