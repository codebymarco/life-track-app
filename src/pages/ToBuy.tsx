// Tobuy.tsx
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Enum for Status
enum Status {
  ToBuy = "tobuy",
  Saving = "saving",
  Bought = "bought",
}

// Enum for Saving Method
enum SavingMethod {
  BankTransfer = "Bank Transfer",
  Cash = "Cash",
  OnlineSavings = "Online Savings",
  Others = "Others",
}

// Tobuy data type
type TobuyData = {
  item: string;
  status: Status;
  price: number;
  saving: number;
  savingMethod: SavingMethod;
  productLink: string;
  purchaseDate: string; // ISO Date string
};

// Type for TobuyData with original index
type TobuyDataWithIndex = TobuyData & { originalIndex: number };

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

function Tobuy() {
  const [open, setOpen] = useState<boolean>(false);
  const [tobuyData, setTobuyData] = useState<TobuyData[]>([]);
  const [tobuyForm, setTobuyForm] = useState<TobuyData>({
    item: "",
    status: Status.ToBuy,
    price: 0,
    saving: 0,
    savingMethod: SavingMethod.BankTransfer,
    productLink: "",
    purchaseDate: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering States
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<Status | "">("");

  // Load Tobuy data from localStorage
  useEffect(() => {
    try {
      const storedTobuy = JSON.parse(localStorage.getItem("tobuyEntries") || "[]") as TobuyData[];
      setTobuyData(
        storedTobuy.map((entry) => ({
          item: entry.item || "",
          status: entry.status || Status.ToBuy,
          price: entry.price || 0,
          saving: entry.saving || 0,
          savingMethod: entry.savingMethod || SavingMethod.BankTransfer,
          productLink: entry.productLink || "",
          purchaseDate: entry.purchaseDate || "",
        }))
      );
    } catch {
      setTobuyData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setTobuyForm({
      item: "",
      status: Status.ToBuy,
      price: 0,
      saving: 0,
      savingMethod: SavingMethod.BankTransfer,
      productLink: "",
      purchaseDate: "",
    });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    let updatedValue: any = value;

    // Handle number fields
    if (name === "price" || name === "saving") {
      updatedValue = Number(value);
    }

    setTobuyForm((prev) => ({
      ...prev,
      [name!]: updatedValue,
    }));
  };

  const handleSave = () => {
    // Validation
    if (!tobuyForm.item.trim()) {
      alert("Item cannot be empty.");
      return;
    }

    if (!tobuyForm.productLink.trim()) {
      alert("Product link cannot be empty.");
      return;
    }

    // Basic URL validation
    try {
      new URL(tobuyForm.productLink);
    } catch {
      alert("Please enter a valid URL for the product link.");
      return;
    }

    if (!tobuyForm.purchaseDate) {
      alert("Please select a purchase date.");
      return;
    }

    const selectedDate = new Date(tobuyForm.purchaseDate);
    const today = new Date();
    // Set time to 00:00:00 for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Purchase date cannot be in the past.");
      return;
    }

    if (tobuyForm.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (tobuyForm.saving < 0) {
      alert("Saving cannot be negative.");
      return;
    }

    if (tobuyForm.saving > tobuyForm.price) {
      alert("Saving cannot exceed the price.");
      return;
    }

    if (editIndex !== null) {
      const updatedTobuy = [...tobuyData];
      updatedTobuy[editIndex] = tobuyForm;
      setTobuyData(updatedTobuy);
      localStorage.setItem("tobuyEntries", JSON.stringify(updatedTobuy));
    } else {
      const newTobuy = [...tobuyData, tobuyForm];
      setTobuyData(newTobuy);
      localStorage.setItem("tobuyEntries", JSON.stringify(newTobuy));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const filteredTobuy = tobuyData.filter((_, i) => i !== index);
      setTobuyData(filteredTobuy);
      localStorage.setItem("tobuyEntries", JSON.stringify(filteredTobuy));
    }
  };

  const handleEdit = (index: number) => {
    setTobuyForm(tobuyData[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(tobuyData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tobuy.json`;
    link.click();
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
    return data.filter((item) => {
      if (typeof filterValue === "string") {
        return item[key] === filterValue;
      }
      return item[key] === filterValue;
    });
  };

  // Augment each item with its original index
  const tobuyDataWithIndex: TobuyDataWithIndex[] = tobuyData.map((item, index) => ({
    ...item,
    originalIndex: index,
  }));

  // Processed Data for Rendering with original indices
  const processedTobuy: TobuyDataWithIndex[] = sortData(
    filterData(tobuyDataWithIndex, "status", filterStatus),
    "item",
    sortOrder
  );

  // Calculate Totals
  const totalPrice = tobuyData.reduce((acc, item) => acc + item.price, 0);
  const totalSaving = tobuyData.reduce((acc, item) => acc + item.saving, 0);
  const totalRemaining = tobuyData.reduce(
    (acc, item) => acc + (item.price - item.saving),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        To Buy List
      </Typography>

      {/* Total Summary */}
      <Typography variant="h6" gutterBottom>
        Total Price: R{totalPrice.toFixed(2)} | Total Saving: R{totalSaving.toFixed(2)} | Remaining: R{totalRemaining.toFixed(2)}
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Item" : "Add Item"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download List as JSON
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
          <InputLabel>Sort by Item</InputLabel>
          <Select
            label="Sort by Item"
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
          <InputLabel>Filter by Status</InputLabel>
          <Select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as Status | ""
              )
            }
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={Status.ToBuy}>To Buy</MenuItem>
            <MenuItem value={Status.Saving}>Saving</MenuItem>
            <MenuItem value={Status.Bought}>Bought</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterStatus("");
            setSortOrder("asc");
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Item" : "Add Item"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Item"
            name="item"
            value={tobuyForm.item}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={tobuyForm.status}
              onChange={handleChange}
            >
              <MenuItem value={Status.ToBuy}>To Buy</MenuItem>
              <MenuItem value={Status.Saving}>Saving</MenuItem>
              <MenuItem value={Status.Bought}>Bought</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Price (Rands)"
            name="price"
            type="number"
            value={tobuyForm.price}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Current Saving (Rands)"
            name="saving"
            type="number"
            value={tobuyForm.saving}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Saving Method</InputLabel>
            <Select
              label="Saving Method"
              name="savingMethod"
              value={tobuyForm.savingMethod}
              onChange={handleChange}
            >
              <MenuItem value={SavingMethod.BankTransfer}>Bank Transfer</MenuItem>
              <MenuItem value={SavingMethod.Cash}>Cash</MenuItem>
              <MenuItem value={SavingMethod.OnlineSavings}>Online Savings</MenuItem>
              <MenuItem value={SavingMethod.Others}>Others</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Product Link"
            name="productLink"
            type="url"
            value={tobuyForm.productLink}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date to Purchase"
            name="purchaseDate"
            type="date"
            value={tobuyForm.purchaseDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
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
              <TableCell>Item</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price (R)</TableCell>
              <TableCell>Current Saving (R)</TableCell>
              <TableCell>Remaining (R)</TableCell>
              <TableCell>Saving Method</TableCell>
              <TableCell>Product Link</TableCell>
              <TableCell>Date to Purchase</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedTobuy.length > 0 ? (
              processedTobuy.map((row) => {
                const remaining = row.price - row.saving;
                return (
                  <TableRow
                    key={row.originalIndex} // Use original index as key
                    style={{
                      backgroundColor:
                        row.status === Status.Bought
                          ? "#d0f0c0" // Light green
                          : row.status === Status.Saving
                          ? "#fffacd" // Light yellow
                          : "#f08080", // Light red
                    }}
                  >
                    <TableCell>{row.item}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.price.toFixed(2)}</TableCell>
                    <TableCell>{row.saving.toFixed(2)}</TableCell>
                    <TableCell>{remaining.toFixed(2)}</TableCell>
                    <TableCell>{row.savingMethod}</TableCell>
                    <TableCell>
                      <a href={row.productLink} target="_blank" rel="noopener noreferrer">
                        View Product
                      </a>
                    </TableCell>
                    <TableCell>{new Date(row.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(row.originalIndex)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.originalIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Tobuy;
