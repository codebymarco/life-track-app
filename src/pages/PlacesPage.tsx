// PlacesPage.tsx
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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { v4 as uuidv4 } from 'uuid';

// Define the PlacesData type with a unique identifier
type PlacesData = {
  id: string; // Unique identifier
  place: string;
  visited: boolean;
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

function PlacesPage() {
  const [placesData, setPlacesData] = useState<PlacesData[]>([]);
  const [placesForm, setPlacesForm] = useState<PlacesData>({
    id: "",
    place: "",
    visited: false,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedPlaces = JSON.parse(
        localStorage.getItem("placesEntries") || "[]"
      ) as PlacesData[];

      // Assign unique IDs if not present
      const initializedPlaces = storedPlaces.map((entry) => ({
        id: entry.id || uuidv4(),
        place: entry.place || "",
        visited: entry.visited || false,
      }));
      setPlacesData(initializedPlaces);
      localStorage.setItem("placesEntries", JSON.stringify(initializedPlaces));
    } catch {
      setPlacesData([]);
    }
  }, []);

  // Open and Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPlacesForm({
      id: "",
      place: "",
      visited: false,
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
    setPlacesForm({
      ...placesForm,
      [name!]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Save (Add or Edit)
  const handleSave = () => {
    // Validate place name
    if (!placesForm.place.trim()) {
      alert("Place name cannot be empty.");
      return;
    }

    if (editId) {
      // Editing an existing place
      const updatedPlaces = placesData.map(place =>
        place.id === editId ? placesForm : place
      );
      setPlacesData(updatedPlaces);
      localStorage.setItem("placesEntries", JSON.stringify(updatedPlaces));
    } else {
      // Adding a new place with a unique ID
      const newPlace = { ...placesForm, id: uuidv4() };
      const newPlaces = [...placesData, newPlace];
      setPlacesData(newPlaces);
      localStorage.setItem("placesEntries", JSON.stringify(newPlaces));
    }

    handleClose();
  };

  // Handle Edit
  const handleEdit = (id: string) => {
    const placeToEdit = placesData.find(place => place.id === id);
    if (placeToEdit) {
      setPlacesForm(placeToEdit);
      setEditId(id);
      handleOpen();
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this place?");
    if (confirmed) {
      const filteredPlaces = placesData.filter(place => place.id !== id);
      setPlacesData(filteredPlaces);
      localStorage.setItem("placesEntries", JSON.stringify(filteredPlaces));
    }
  };

  // Sorting and Filtering
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterVisited, setFilterVisited] = useState<boolean | "">("");

  // Function to sort data
  const sortData = (data: PlacesData[], order: "asc" | "desc"): PlacesData[] => {
    return [...data].sort((a, b) => {
      if (a.place.toLowerCase() < b.place.toLowerCase()) return order === "asc" ? -1 : 1;
      if (a.place.toLowerCase() > b.place.toLowerCase()) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Function to filter data
  const filterData = (data: PlacesData[], visitedFilter: boolean | ""): PlacesData[] => {
    if (visitedFilter === "") return data;
    return data.filter(place => place.visited === visitedFilter);
  };

  // Processed Data for Rendering
  const processedPlaces = sortData(filterData(placesData, filterVisited), sortOrder);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Places to Visit
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Add Place
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            const jsonData = JSON.stringify(placesData, null, 2);
            const blob = new Blob([jsonData], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `places_to_visit.json`;
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
          <InputLabel>Sort by Place</InputLabel>
          <Select
            label="Sort by Place"
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
          <InputLabel>Filter by Visited</InputLabel>
          <Select
            label="Filter by Visited"
            value={filterVisited}
            onChange={(e) =>
              setFilterVisited(e.target.value as boolean | "")
            }
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={true}>Visited</MenuItem>
            <MenuItem value={false}>Not Visited</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setSortOrder("asc");
            setFilterVisited("");
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Place" : "Add Place"}
          </Typography>
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
              <TableCell>Place</TableCell>
              <TableCell>Visited</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedPlaces.length > 0 ? (
              processedPlaces.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.place}</TableCell>
                  <TableCell>{row.visited ? "Yes" : "No"}</TableCell>
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
                  No places to visit found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PlacesPage;
