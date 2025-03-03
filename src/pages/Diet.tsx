// src/DietEntries.tsx

import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import Visibility Icon

// Type Definitions
type FoodEntry = {
  food: string;
  calorie: number;
  quantity: number;
  grams?: number;
  takeout?: boolean;
  kfc?: boolean;
  rcl?: boolean;
  mcdonalds?: boolean;
  hot_chocolate?: number;
  ginger_beer?: number;
  apple_juice?: number;
  fruit_juice?: number;
  cranberry_juice?: number;
  orange_juice?: number;
  hot_dogs?: number;
  energade?: number;
  morning_biscut?: number;
  ginger_biscut?: number;
  yougurt?: number;
  scones?: number;
  snappers?: number;
  thunder?: number;
  fries?: boolean;
  burger?: boolean;
  choc_muffin?: number;
  switch?: boolean;
  chops?: boolean;
  roti?: boolean;
  mince_curry?: boolean;
  chicken_curry?: boolean;
  chicken_breyani?: boolean;
  rice?: boolean;
  salad?: boolean;
  coleslaw?: boolean;
  chicken?: boolean;
  puri_patha?: boolean;
  cheese?: boolean;
  oreos?: boolean;
  hot_sauce?: boolean;
  beans?: boolean;
  steak?: boolean;
  peanut_butter?: boolean;
  jam?: boolean;
  toast?: boolean;
  mutton_curry?: boolean;
  mutton_bunny?: boolean;
  chicken_pie?: boolean;
  noodles?: boolean;
  sweets?: boolean;
  pickle?: boolean;
  custard?: boolean;
  ice_cream?: boolean;
  beef_and_cauliflower_curry?: boolean;
  monster?: boolean;
  samp?: boolean;
  roco_mammas?: boolean;
  edibles?: number;
  coke?: number;
  cream_soda?: number;
  cake?: number;
  provita?: number;
  tennis_biscut?: number;
  eat_sum_more_biscut?: number;
  bread?: number;
  fanta?: number;
  soda?: boolean;
  coffee?: number;
  tea?: number;
  sugar?: number;
  kiwi?: number;
  almonds?: number;
  milk?: number;
  grapesblack?: number;
  chickenmayo?: number;
  chickenperiperi?: number;
  berriesstraw?: number;
};

type DietData = {
  date: string;
  foods: FoodEntry[];
  water: string;
  takeout?: boolean;
  fanta?: number;
  hot_chocolate?: number;
  ginger_beer?: number;
  apple_juice?: number;
  fruit_juice?: number;
  cranberry_juice?: number;
  orange_juice?: number;
  hot_dogs?: number;
  energade?: number;
  morning_biscut?: number;
  ginger_biscut?: number;
  yougurt?: number;
  scones?: number;
  snappers?: number;
  thunder?: number;
  choc_muffin?: number;
  rcl?: boolean;
  switch?: boolean;
  chops?: boolean;
  roti?: boolean;
  mince_curry?: boolean;
  chicken_curry?: boolean;
  chicken_breyani?: boolean;
  rice?: boolean;
  salad?: boolean;
  coleslaw?: boolean;
  chicken?: boolean;
  puri_patha?: boolean;
  cheese?: boolean;
  oreos?: boolean;
  hot_sauce?: boolean;
  beans?: boolean;
  steak?: boolean;
  peanut_butter?: boolean;
  jam?: boolean;
  toast?: boolean;
  mutton_curry?: boolean;
  mutton_bunny?: boolean;
  chicken_pie?: boolean;
  noodles?: boolean;
  sweets?: boolean;
  pickle?: boolean;
  custard?: boolean;
  ice_cream?: boolean;
  beef_and_cauliflower_curry?: boolean;
  monster?: boolean;
  samp?: boolean;
  fries?: boolean;
  burger?: boolean;
  kfc?: boolean;
  mcdonalds?: boolean;
  roco_mammas?: boolean;
  soda?: boolean;
  coffee?: number;
  tea?: number;
  sugar?: number;
  edibles?: number;
  coke?: number;
  cream_soda?: number;
  cake?: number;
  provita?: number;
  tennis_biscut?: number;
  eat_sum_more_biscut?: number;
  bread?: number;
  kiwi?: number;
  almonds?: number;
  milk?: number;
  chickenmayo?: number;
  chickenperiperi?: number;
  grapesblack?: number;
  berriesstraw?: number;
};

// Modal Styling
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700, // Increased width for better form layout
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Styles using makeStyles
const useStyles = makeStyles({
  container: {
    padding: "8px",
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

const Diet: React.FC = () => {
  const classes = useStyles();

  // State Management
  const [dietData, setDietData] = useState<DietData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [dietForm, setDietForm] = useState<DietData>({
    date: "",
    foods: [
      {
        food: "",
        calorie: 0,
        quantity: 1,
        grams: undefined,
      },
    ],
    takeout: false,
    fanta: 0,
    hot_chocolate: 0,
    ginger_beer: 0,
    apple_juice: 0,
    fruit_juice: 0,
    cranberry_juice: 0,
    orange_juice: 0,
    hot_dogs: 0,
    energade: 0,
    morning_biscut: 0,
    ginger_biscut: 0,
    yougurt: 0,
    scones: 0,
    snappers: 0,
    thunder: 0,
    choc_muffin: 0,
    rcl: false,
    switch: false,
    chops: false,
    roti: false,
    mince_curry: false,
    chicken_curry: false,
    chicken_breyani: false,
    rice: false,
    salad: false,
    coleslaw: false,
    chicken: false,
    puri_patha: false,
    cheese: false,
    oreos: false,
    hot_sauce: false,
    beans: false,
    steak: false,
    peanut_butter: false,
    jam: false,
    toast: false,
    mutton_curry: false,
    mutton_bunny: false,
    chicken_pie: false,
    noodles: false,
    sweets: false,
    pickle: false,
    custard: false,
    ice_cream: false,
    beef_and_cauliflower_curry: false,
    monster: false,
    samp: false,
    fries: false,
    burger: false,
    kfc: false,
    mcdonalds: false,
    roco_mammas: false,
    coffee: 0,
    tea: 0,
    soda: false,
    sugar: 0,
    water: "",
    edibles: 0,
    coke: 0,
    cream_soda: 0,
    cake: 0,
    provita: 0,
    tennis_biscut: 0,
    eat_sum_more_biscut: 0,
    bread: 0,
    kiwi: 0,
    almonds: 0,
    milk: 0,
    grapesblack: 0,
    berriesstraw: 0,
    chickenmayo: 0,
    chickenperiperi: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering State
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDate, setFilterDate] = useState<string>("");

  // Load Data from localStorage on Mount
  useEffect(() => {
    try {
      const storedDiet = JSON.parse(
        localStorage.getItem("dietEntries") || "[]"
      ) as DietData[];
      setDietData(
        storedDiet.map((entry) => ({
          ...entry,
          foods: entry.foods || [
            { food: "", calorie: 0, quantity: 1, grams: undefined },
          ],
          water: entry.water || "",
        }))
      );
    } catch {
      setDietData([]);
    }
  }, []);

  // Handle Modal Open/Close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset Form Data
  const resetForm = () => {
    setDietForm({
      date: "",
      foods: [
        {
          food: "",
          calorie: 0,
          quantity: 1,
          grams: undefined,
        },
      ],
      water: "",
    });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setDietForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Changes in Food Entries
  const handleFoodChange = (
    index: number,
    field: keyof FoodEntry,
    value: string | number
  ) => {
    const updatedFoods = dietForm.foods.map((food, i) =>
      i === index ? { ...food, [field]: value } : food
    );
    setDietForm({ ...dietForm, foods: updatedFoods });
  };

  // Add a New Food Entry
  const addFoodEntry = () => {
    setDietForm({
      ...dietForm,
      foods: [
        ...dietForm.foods,
        { food: "", calorie: 0, quantity: 1, grams: undefined },
      ],
    });
  };

  // Remove a Food Entry
  const removeFoodEntry = (index: number) => {
    const updatedFoods = dietForm.foods.filter((_, i) => i !== index);
    setDietForm({ ...dietForm, foods: updatedFoods });
  };

  // Handle Save (Add/Edit)
  const handleSave = () => {
    // Validate each food entry
    for (const food of dietForm.foods) {
      if (!food.food.trim()) {
        alert("Food name cannot be empty.");
        return;
      }
      if (food.calorie < 0) {
        alert("Calorie cannot be negative.");
        return;
      }
      if (food.quantity <= 0) {
        alert("Quantity must be at least 1.");
        return;
      }
      // grams are optional
    }

    if (editIndex !== null) {
      // Edit Existing Entry
      const updatedDiet = [...dietData];
      updatedDiet[editIndex] = dietForm;
      setDietData(updatedDiet);
      localStorage.setItem("dietEntries", JSON.stringify(updatedDiet));
    } else {
      // Add New Entry
      const newDiet = [...dietData, dietForm];
      setDietData(newDiet);
      localStorage.setItem("dietEntries", JSON.stringify(newDiet));
    }

    handleClose();
  };

  // Handle Delete
  const handleDelete = (index: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this diet entry?"
    );
    if (!confirm) return;

    const filteredDiet = dietData.filter((_, i) => i !== index);
    setDietData(filteredDiet);
    localStorage.setItem("dietEntries", JSON.stringify(filteredDiet));
  };

  // Handle Edit
  const handleEdit = (index: number) => {
    setDietForm(dietData[index]);
    setEditIndex(index);
    handleOpen();
  };

  // Handle Download as JSON
  const handleDownload = () => {
    const jsonData = JSON.stringify(dietData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dietEntries.json`;
    link.click();
  };

  // Sorting Function
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

  // Filtering Function
  const filterData = <T extends { [key: string]: any }>(
    data: T[],
    key: keyof T,
    filterValue: any
  ): T[] => {
    if (filterValue === "" || filterValue === null) return data;
    return data.filter((item) => {
      if (typeof filterValue === "boolean") {
        return item[key] === filterValue;
      } else if (typeof filterValue === "string") {
        return item[key]
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      return item[key] === filterValue;
    });
  };

  // Processed Data for Rendering
  const processedDiet = sortData(
    filterData(dietData, "date", filterDate),
    "date",
    sortOrder
  );

  // Utility Functions to Get Start and Latest Dates
  const getStartDate = () => {
    if (dietData.length === 0) return "N/A";
    const sorted = [...dietData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0].date;
  };

  const getLatestDate = () => {
    if (dietData.length === 0) return "N/A";
    const sorted = [...dietData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].date;
  };

  // State for View Modal
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [viewEntry, setViewEntry] = useState<DietData | null>(null);
  console.log(viewEntry);
  // Handle View Modal Open/Close
  const handleViewOpen = (entry: DietData) => {
    setViewEntry(entry);
    setViewOpen(true);
  };
  const handleViewClose = () => {
    setViewOpen(false);
    setViewEntry(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Diet Entries
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Diet Entry" : "Add Diet Entry"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Diet Entries as JSON
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
          <InputLabel>Sort Order</InputLabel>
          <Select
            label="Sort Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Filter by Date */}
        <TextField
          label="Filter by Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterDate("");
            setSortOrder("asc");
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Viewing Entry Details */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box>
          <Typography
            gutterBottom
            style={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            diet Details
          </Typography>
        </Box>
      </Modal>

      {/* Modal for Adding/Editing Diet Entries */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Diet Entry" : "Add New Diet Entry"}
          </Typography>
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
          <Typography variant="h6" gutterBottom>
            Foods
          </Typography>
          {dietForm.foods.map((foodEntry, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={2}
              marginBottom={2}
            >
              <TextField
                label="Food"
                name="food"
                value={foodEntry.food}
                onChange={(e) =>
                  handleFoodChange(index, "food", e.target.value)
                }
                required
              />
              <TextField
                label="Calorie"
                type="number"
                name="calorie"
                value={foodEntry.calorie}
                onChange={(e) =>
                  handleFoodChange(index, "calorie", Number(e.target.value))
                }
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Quantity"
                type="number"
                name="quantity"
                value={foodEntry.quantity}
                onChange={(e) =>
                  handleFoodChange(index, "quantity", Number(e.target.value))
                }
                required
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Grams (optional)"
                type="number"
                name="grams"
                value={foodEntry.grams || ""}
                onChange={(e) =>
                  handleFoodChange(index, "grams", Number(e.target.value))
                }
              />
              <IconButton
                onClick={() => removeFoodEntry(index)}
                disabled={dietForm.foods.length === 1}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" onClick={addFoodEntry}>
            Add Food
          </Button>
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

          <TextField
            fullWidth
            margin="normal"
            label="hot choc cups"
            type="number"
            name="hot_chocolate"
            value={dietForm.hot_chocolate}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="ginger_beer"
            type="number"
            name="ginger_beer"
            value={dietForm.ginger_beer}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="apple_juice"
            type="number"
            name="apple_juice"
            value={dietForm.apple_juice}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="fruit_juice"
            type="number"
            name="fruit_juice"
            value={dietForm.fruit_juice}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="cranberry_juice"
            type="number"
            name="cranberry_juice"
            value={dietForm.cranberry_juice}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="orange_juice"
            type="number"
            name="orange_juice"
            value={dietForm.orange_juice}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="hot_dogs"
            type="number"
            name="hot_dogs"
            value={dietForm.hot_dogs}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="energade"
            type="number"
            name="energade"
            value={dietForm.energade}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="morning_biscut"
            type="number"
            name="morning_biscut"
            value={dietForm.morning_biscut}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="ginger_biscut"
            type="number"
            name="ginger_biscut"
            value={dietForm.ginger_biscut}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="yougurt"
            type="number"
            name="yougurt"
            value={dietForm.yougurt}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="scones"
            type="number"
            name="scones"
            value={dietForm.scones}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="snappers"
            type="number"
            name="snappers"
            value={dietForm.snappers}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="thunder"
            type="number"
            name="thunder"
            value={dietForm.thunder}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="choc_muffin"
            type="number"
            name="choc_muffin"
            value={dietForm.choc_muffin}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="fanta"
            type="number"
            name="fanta"
            value={dietForm.fanta}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.takeout}
                name="takeout"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>Takeout</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.rcl}
                name="rcl"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>rcl</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.switch}
                name="switch"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>switch</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.chops}
                name="chops"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>chops</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.roti}
                name="roti"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>roti</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.mince_curry}
                name="mince_curry"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>mince_curry</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.chicken_curry}
                name="chicken_curry"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>chicken_curry</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.chicken_breyani}
                name="chicken_breyani"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>chicken_breyani</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.rice}
                name="rice"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>rice</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.salad}
                name="salad"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>salad</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.coleslaw}
                name="coleslaw"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>coleslaw</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.chicken}
                name="chicken"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>chicken</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.puri_patha}
                name="puri_patha"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>puri_patha</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.cheese}
                name="cheese"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>cheese</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.oreos}
                name="oreos"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>oreos</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.hot_sauce}
                name="hot_sauce"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>hot_sauce</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.beans}
                name="beans"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>beans</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.steak}
                name="steak"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>steak</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.peanut_butter}
                name="peanut_butter"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>peanut_butter</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.jam}
                name="jam"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>jam</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.toast}
                name="toast"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>toast</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.mutton_curry}
                name="mutton_curry"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>mutton_curry</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.mutton_bunny}
                name="mutton_bunny"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>mutton_bunny</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.chicken_pie}
                name="chicken_pie"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>chicken_pie</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.noodles}
                name="noodles"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>noodles</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.sweets}
                name="sweets"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>sweets</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.pickle}
                name="pickle"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>pickle</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.custard}
                name="custard"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>custard</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.ice_cream}
                name="ice_cream"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>ice_cream</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.beef_and_cauliflower_curry}
                name="beef_and_cauliflower_curry"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>beef_and_cauliflower_curry</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.monster}
                name="monster"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>monster</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.samp}
                name="samp"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>samp</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.fries}
                name="fries"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>fries</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.burger}
                name="burger"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>burger</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.kfc}
                name="kfc"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>kfc</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.mcdonalds}
                name="mcdonalds"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>mcdonalds</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.roco_mammas}
                name="roco_mammas"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>roco_mammas</Typography>}
          />

          <TextField
            fullWidth
            margin="normal"
            label="sugar"
            type="number"
            name="sugar"
            value={dietForm.sugar}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="coffee"
            type="number"
            name="coffee"
            value={dietForm.coffee}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="tea"
            type="number"
            name="tea"
            value={dietForm.tea}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="edibles"
            type="number"
            name="edibles"
            value={dietForm.edibles}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="coke"
            type="number"
            name="coke"
            value={dietForm.coke}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="cream_soda"
            type="number"
            name="cream_soda"
            value={dietForm.cream_soda}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="cake"
            type="number"
            name="cake"
            value={dietForm.cake}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="provita"
            type="number"
            name="provita"
            value={dietForm.provita}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="tennis_biscut"
            type="number"
            name="tennis_biscut"
            value={dietForm.tennis_biscut}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="eat_sum_more_biscut"
            type="number"
            name="eat_sum_more_biscut"
            value={dietForm.eat_sum_more_biscut}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="bread"
            type="number"
            name="bread"
            value={dietForm.bread}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="kiwi"
            type="number"
            name="kiwi"
            value={dietForm.kiwi}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="almonds"
            type="number"
            name="almonds"
            value={dietForm.almonds}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="milk"
            type="number"
            name="milk"
            value={dietForm.milk}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="grapesblack"
            type="number"
            name="grapesblack"
            value={dietForm.grapesblack}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="berriesstraw"
            type="number"
            name="berriesstraw"
            value={dietForm.berriesstraw}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="chickenmayo"
            type="number"
            name="chickenmayo"
            value={dietForm.chickenmayo}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="chickenperiperi"
            type="number"
            name="chickenperiperi"
            value={dietForm.chickenperiperi}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.1" }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dietForm.soda}
                name="soda"
                onChange={handleChange}
                size="small"
              />
            }
            label={<Typography>soda</Typography>}
          />

          {/* Save Button */}
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

      {/* Diet Entries Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              {/*              
              <TableCell>Food</TableCell>
              <TableCell>Calorie</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Grams</TableCell>
              <TableCell>Takeout</TableCell>
              <TableCell>Fanta</TableCell>
              <TableCell>hot_chocolate</TableCell>
              <TableCell>ginger_beer</TableCell>
              <TableCell>apple_juice</TableCell>
              <TableCell>cranberry_juice</TableCell>
              <TableCell>orange_juice</TableCell>
              <TableCell>morning_biscut</TableCell>
              <TableCell>yougurt</TableCell>
              <TableCell>snappers</TableCell>
              <TableCell>thunder</TableCell>
              <TableCell>choc_muffin</TableCell>
              <TableCell>rcl</TableCell>
              <TableCell>switch</TableCell>
              <TableCell>chops</TableCell>
              <TableCell>roti</TableCell>
              <TableCell>mince_curry</TableCell>
              <TableCell>monster</TableCell>
              <TableCell>samp</TableCell>
              <TableCell>fries</TableCell>
              <TableCell>burger</TableCell>
              <TableCell>kfc</TableCell>
              <TableCell>mcdonalds</TableCell>
              <TableCell>roco_mammas</TableCell>
              <TableCell>soda</TableCell>
              <TableCell>coffee</TableCell>
              <TableCell>tea</TableCell>
              <TableCell>sugar</TableCell>
              <TableCell>edibles</TableCell>
              <TableCell>coke</TableCell>
              <TableCell>cream_soda</TableCell>
              <TableCell>cake</TableCell>
              <TableCell>provita</TableCell>
              <TableCell>tennis_biscut</TableCell>
              <TableCell>eat_sum_more_biscut</TableCell>
              <TableCell>bread</TableCell>
              <TableCell>kiwi</TableCell>
              <TableCell>almonds</TableCell>
              <TableCell>milk</TableCell>
              <TableCell>grapesblack</TableCell>
              <TableCell>berriesstraw</TableCell>
              <TableCell>chickenmayo</TableCell>
              <TableCell>chickenperiperi</TableCell> */}
              <TableCell>Water (Liters)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedDiet.length > 0 ? (
              processedDiet.map((entry, index) => {
                const dateObject = new Date(entry.date);
                const dayOfWeek = dateObject.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const dayName = dateObject.toLocaleDateString("en-US", {
                  weekday: "long",
                });

                return entry.foods.map((_, i) => (
                  <TableRow key={`${index}-${i}`}>
                    {i === 0 && (
                      <TableCell
                        className={`${classes.tableCell} ${
                          isWeekend ? classes.weekend : classes.weekday
                        }`}
                        rowSpan={entry.foods.length}
                      >
                        {entry.date} - {dayName}
                      </TableCell>
                    )}
                    {/*   
                    <TableCell>{food.food}</TableCell>
                    <TableCell>{food.calorie}</TableCell>
                    <TableCell>{food.quantity}</TableCell>
                    <TableCell>{food.grams || "-"}</TableCell>
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.takeout ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.fanta ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.hot_chocolate ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.ginger_beer ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.apple_juice ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.cranberry_juice ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.orange_juice ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.morning_biscut ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.yougurt ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.snappers ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.thunder ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.choc_muffin ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.rcl ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.switch ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.chops ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.roti ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.mince_curry ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.monster ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.samp ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.fries ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.burger ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.kfc ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.mcdonalds ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.roco_mammas ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.soda ? <CheckCircleIcon /> : <CancelIcon />}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.coffee || 0}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.tea || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.sugar || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.edibles || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.coke || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.cream_soda || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.cake || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.provita || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.tennis_biscut || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.eat_sum_more_biscut || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.bread || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.kiwi || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.almonds || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.milk || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.grapesblack || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.berriesstraw || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.chickenmayo || 0}
                      </TableCell>
                    )}

                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.chickenperiperi || 0}
                      </TableCell>
                    )}
 */}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        {entry.water || 0}
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={entry.foods.length}>
                        <IconButton onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleViewOpen(entry)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ));
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No diet entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display Tracking Period */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Tracking Period</Typography>
        <Typography variant="body1">Start Date: {getStartDate()}</Typography>
        <Typography variant="body1">Latest Date: {getLatestDate()}</Typography>
      </Box>
    </div>
  );
};

export default Diet;
