// Finances.tsx
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Finance data type
type Purchase = {
  name: string;
  price: number;
};

type FinanceData = {
  date: string;
  items: Purchase[];
  total: number;
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

function Finances() {
  const [open, setOpen] = useState<boolean>(false);
  const [financeData, setFinanceData] = useState<FinanceData[]>([]);
  const [financeForm, setFinanceForm] = useState<FinanceData>({
    date: "",
    items: [],
    total: 0,
  });
  const [newItem, setNewItem] = useState<Purchase>({ name: "", price: 0 });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  // Load finance data from localStorage
  useEffect(() => {
    try {
      const storedFinance = JSON.parse(
        localStorage.getItem("financeEntries") || "[]"
      ) as FinanceData[];
      const validatedFinance = storedFinance.map((entry) => ({
        ...entry,
        total: entry.total || entry.items.reduce((sum, item) => sum + item.price, 0),
      }));
      setFinanceData(validatedFinance);
    } catch {
      setFinanceData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setFinanceForm({ date: "", items: [], total: 0 });
    setNewItem({ name: "", price: 0 });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFinanceForm((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const addItem = () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      alert("Item name cannot be empty and price must be greater than 0.");
      return;
    }
    const updatedItems = [...financeForm.items, newItem];
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
    setFinanceForm((prev) => ({
      ...prev,
      items: updatedItems,
      total: updatedTotal,
    }));
    setNewItem({ name: "", price: 0 });
  };

  const handleSave = () => {
    if (!financeForm.date.trim() || financeForm.items.length === 0) {
      alert("Date and at least one item are required.");
      return;
    }

    if (financeData.some((entry) => entry.date === financeForm.date && editIndex === null)) {
      alert("A record already exists for this date. Please choose a different date or edit the existing record.");
      return;
    }

    if (editIndex !== null) {
      const updatedFinance = [...financeData];
      updatedFinance[editIndex] = financeForm;
      setFinanceData(updatedFinance);
      localStorage.setItem("financeEntries", JSON.stringify(updatedFinance));
    } else {
      const newFinance = [...financeData, financeForm];
      setFinanceData(newFinance);
      localStorage.setItem("financeEntries", JSON.stringify(newFinance));
    }

    handleClose();
  };

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const filteredFinance = financeData.filter((_, i) => i !== deleteIndex);
      setFinanceData(filteredFinance);
      localStorage.setItem("financeEntries", JSON.stringify(filteredFinance));
      setDeleteIndex(null);
    }
  };

  const handleView = (index: number) => {
    setViewIndex(index);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
  };

  const filteredData = financeData.filter((record) => {
    const recordDate = new Date(record.date).getTime();
    const from = fromDate ? new Date(fromDate).getTime() : null;
    const to = toDate ? new Date(toDate).getTime() : null;

    return (
      (!from || recordDate >= from) &&
      (!to || recordDate <= to)
    );
  });

  const totalSpending = filteredData.reduce((total, record) => {
    return total + (record.total || 0);
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Finances
      </Typography>

      {/* Add Button */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Record" : "Add Record"}
        </Button>
      </div>

      {/* Date Range Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
        <Typography variant="h6" style={{ marginLeft: "20px" }}>
          Total Spending: R {totalSpending.toFixed(2)}
        </Typography>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Edit Record" : "Add Record"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            name="date"
            type="date"
            value={financeForm.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="Item Name"
              name="name"
              value={newItem.name}
              onChange={handleItemChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Price (R)"
              name="price"
              type="number"
              value={newItem.price}
              onChange={handleItemChange}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={addItem}
              style={{ marginTop: "10px" }}
            >
              Add Item
            </Button>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            {financeForm.items.length > 0 && (
              <ul>
                {financeForm.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - R {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            <Typography variant="h6" style={{ marginTop: "10px" }}>
              Total: R {financeForm.total.toFixed(2)}
            </Typography>
          </Box>
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

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewIndex !== null}
        onClose={() => setViewIndex(null)}
      >
        <DialogTitle>View Record</DialogTitle>
        {viewIndex !== null && (
          <DialogContent>
            <Typography variant="h6">Date: {financeData[viewIndex].date}</Typography>
            <Typography variant="h6" style={{ marginTop: "10px" }}>
              Items:
            </Typography>
            <ul>
              {financeData[viewIndex].items.map((item, index) => (
                <li key={index}>
                  {item.name} - R {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <Typography variant="h6" style={{ marginTop: "10px" }}>
              Total: R {financeData[viewIndex].total.toFixed(2)}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setViewIndex(null)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total (R)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    {row.items.map((item, i) => (
                      <div key={i}>
                        {item.name} - R {item.price.toFixed(2)}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>R {(row.total || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleView(index)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No finance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Finances;
