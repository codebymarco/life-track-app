// PasswordsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Define the PasswordsData type with a unique identifier
type PasswordsData = {
  id: string; // Unique identifier
  appName: string;
  email: string;
  username: string;
  password: string; // Encrypted password
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

// Encryption Key (In a real application, manage this securely)
const ENCRYPTION_KEY = 'your-secure-key';

function PasswordsPage() {
  const [passwordsData, setPasswordsData] = useState<PasswordsData[]>([]);
  const [passwordsForm, setPasswordsForm] = useState<PasswordsData>({
    id: "",
    appName: "",
    email: "",
    username: "",
    password: "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPasswordIds, setShowPasswordIds] = useState<Set<string>>(new Set());

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedPasswords = JSON.parse(
        localStorage.getItem("passwordsEntries") || "[]"
      ) as PasswordsData[];

      // Assign unique IDs if not present and decrypt passwords
      const initializedPasswords = storedPasswords.map((entry) => ({
        id: entry.id || uuidv4(),
        appName: entry.appName || "",
        email: entry.email || "",
        username: entry.username || "",
        password: entry.password || "", // Will be decrypted when displayed
      }));
      setPasswordsData(initializedPasswords);
      localStorage.setItem("passwordsEntries", JSON.stringify(initializedPasswords));
    } catch {
      setPasswordsData([]);
    }
  }, []);

  // Open and Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPasswordsForm({
      id: "",
      appName: "",
      email: "",
      username: "",
      password: "",
    });
    setEditId(null);
  };

  // Handle Form Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setPasswordsForm({
      ...passwordsForm,
      [name!]: value,
    });
  };

  // Encrypt Password
  const encryptPassword = (password: string): string => {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  };

  // Decrypt Password
  const decryptPassword = (ciphertext: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Handle Save (Add or Edit)
  const handleSave = () => {
    // Validate form fields
    if (!passwordsForm.appName.trim()) {
      alert("App Name cannot be empty.");
      return;
    }
    if (!passwordsForm.email.trim()) {
      alert("Email cannot be empty.");
      return;
    }
    if (!passwordsForm.username.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    if (!passwordsForm.password.trim()) {
      alert("Password cannot be empty.");
      return;
    }

    if (editId) {
      // Editing an existing password
      const updatedPasswords = passwordsData.map(password =>
        password.id === editId ? { ...passwordsForm, password: encryptPassword(passwordsForm.password) } : password
      );
      setPasswordsData(updatedPasswords);
      localStorage.setItem("passwordsEntries", JSON.stringify(updatedPasswords));
    } else {
      // Adding a new password with a unique ID
      const newPassword = { 
        ...passwordsForm, 
        id: uuidv4(),
        password: encryptPassword(passwordsForm.password)
      };
      const newPasswords = [...passwordsData, newPassword];
      setPasswordsData(newPasswords);
      localStorage.setItem("passwordsEntries", JSON.stringify(newPasswords));
    }

    handleClose();
  };

  // Handle Edit
  const handleEdit = (id: string) => {
    const passwordToEdit = passwordsData.find(password => password.id === id);
    if (passwordToEdit) {
      setPasswordsForm({
        ...passwordToEdit,
        password: decryptPassword(passwordToEdit.password),
      });
      setEditId(id);
      handleOpen();
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this password?");
    if (confirmed) {
      const filteredPasswords = passwordsData.filter(password => password.id !== id);
      setPasswordsData(filteredPasswords);
      localStorage.setItem("passwordsEntries", JSON.stringify(filteredPasswords));
    }
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = (id: string) => {
    const newShowPasswordIds = new Set(showPasswordIds);
    if (newShowPasswordIds.has(id)) {
      newShowPasswordIds.delete(id);
    } else {
      newShowPasswordIds.add(id);
    }
    setShowPasswordIds(newShowPasswordIds);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Passwords
      </Typography>

      {/* Add and Download Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Add Password
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            const jsonData = JSON.stringify(passwordsData.map(pwd => ({
              ...pwd,
              password: decryptPassword(pwd.password), // Decrypt for download
            })), null, 2);
            const blob = new Blob([jsonData], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `passwords.json`;
            link.click();
          }}
          style={{ marginLeft: "10px" }}
        >
          Download as JSON
        </Button>
      </div>

      {/* Modal for Adding/Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Password" : "Add Password"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="App Name"
            name="appName"
            value={passwordsForm.appName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            value={passwordsForm.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={passwordsForm.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={passwordsForm.password}
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
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passwordsData.length > 0 ? (
              passwordsData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.appName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>
                    {showPasswordIds.has(row.id) ? decryptPassword(row.password) : "••••••••"}
                    <IconButton onClick={() => togglePasswordVisibility(row.id)}>
                      {showPasswordIds.has(row.id) ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </TableCell>
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
                <TableCell colSpan={5} align="center">
                  No passwords found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PasswordsPage;
