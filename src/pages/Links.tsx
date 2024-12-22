// Links.tsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";

// Links data type
type LinkData = {
  appName: string;
  url: string;
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

function Links() {
  const [open, setOpen] = useState<boolean>(false);
  const [linksData, setLinksData] = useState<LinkData[]>([]);
  const [linksForm, setLinksForm] = useState<LinkData>({
    appName: "",
    url: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Sorting and Filtering States
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterApp, setFilterApp] = useState<string>("");

  // Load Links data from localStorage
  useEffect(() => {
    try {
      const storedLinks = JSON.parse(localStorage.getItem("linksEntries") || "[]") as LinkData[];
      setLinksData(
        storedLinks.map((entry) => ({
          ...entry,
          appName: entry.appName || "",
          url: entry.url || "",
        }))
      );
    } catch {
      setLinksData([]);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setLinksForm({ appName: "", url: "" });
    setEditIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setLinksForm((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSave = () => {
    if (!linksForm.appName.trim() || !linksForm.url.trim()) {
      alert("App Name and URL are required.");
      return;
    }

    // Validate URL format
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)" + // protocol
        "(([a-zA-Z0-9$-_@.&+!*\(\),]|(%[0-9a-fA-F]{2}))+)" + // domain name and path
        "(\\/?|\\S+)$",
      "i"
    );
    if (!urlPattern.test(linksForm.url)) {
      alert("Please enter a valid URL (must start with http:// or https://).");
      return;
    }

    if (editIndex !== null) {
      const updatedLinks = [...linksData];
      updatedLinks[editIndex] = linksForm;
      setLinksData(updatedLinks);
      localStorage.setItem("linksEntries", JSON.stringify(updatedLinks));
    } else {
      const newLinks = [...linksData, linksForm];
      setLinksData(newLinks);
      localStorage.setItem("linksEntries", JSON.stringify(newLinks));
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    const filteredLinks = linksData.filter((_, i) => i !== index);
    setLinksData(filteredLinks);
    localStorage.setItem("linksEntries", JSON.stringify(filteredLinks));
  };

  const handleEdit = (index: number) => {
    setLinksForm(linksData[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(linksData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `links.json`;
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
        return item[key].toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return item[key] === filterValue;
    });
  };

  // Processed Data for Rendering
  const processedLinks = sortData(
    filterData(linksData, "appName", filterApp),
    "appName",
    sortOrder
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Links Manager
      </Typography>

      {/* Navigation Back to Home */}
      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        style={{ marginBottom: "20px" }}
      >
        Back to Home
      </Button>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {editIndex !== null ? "Edit Link" : "Add Link"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
          style={{ marginLeft: "10px" }}
        >
          Download Links as JSON
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
          <InputLabel>Sort by App Name</InputLabel>
          <Select
            label="Sort by App Name"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Filtering */}
        <TextField
          label="Filter by App Name"
          type="text"
          size="small"
          value={filterApp}
          onChange={(e) => setFilterApp(e.target.value)}
          style={{ minWidth: 200 }}
        />

        {/* Reset Filter Button */}
        <Button
          variant="text"
          onClick={() => {
            setFilterApp("");
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
            {editIndex !== null ? "Edit Link" : "Add Link"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="App Name"
            name="appName"
            value={linksForm.appName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="URL"
            name="url"
            value={linksForm.url}
            onChange={handleChange}
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
              <TableCell>App Name</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedLinks.length > 0 ? (
              processedLinks.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.appName}</TableCell>
                  <TableCell>
                    <a href={row.url} target="_blank" rel="noopener noreferrer">
                      {row.url}
                    </a>
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
                <TableCell colSpan={3} align="center">
                  No links found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Links;
