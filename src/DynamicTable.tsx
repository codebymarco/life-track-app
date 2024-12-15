import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Button,
  Typography,
  Paper,
  Modal,
  Box,
} from '@mui/material';

interface RowData {
  date: string;
  prayMorning: boolean;
  prayNight: boolean;
  workout: boolean;
  steps: number;
}

const DynamicTable: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<RowData>({
    date: '',
    prayMorning: false,
    prayNight: false,
    workout: false,
    steps: 0,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('dynamicTableData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          console.log('Loaded from localStorage:', parsedData); // Debug log
          setRows(parsedData);
        } else {
          console.warn('Invalid data structure in localStorage:', parsedData);
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    } else {
      console.log('No data found in localStorage');
    }
  }, []);

  // Save data to localStorage whenever rows change
  useEffect(() => {
    console.log('Saving to localStorage:', rows); // Debug log
    localStorage.setItem('dynamicTableData', JSON.stringify(rows));
  }, [rows]);

  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      // Edit mode
      setFormData(rows[index]);
      setEditIndex(index);
    } else {
      // Add mode
      setFormData({
        date: '',
        prayMorning: false,
        prayNight: false,
        workout: false,
        steps: 0,
      });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      date: '',
      prayMorning: false,
      prayNight: false,
      workout: false,
      steps: 0,
    });
    setEditIndex(null);
  };

  const handleSave = () => {
    if (formData.date === '') {
      alert('Date is required!');
      return;
    }

    if (editIndex !== null) {
      // Edit existing row
      const updatedRows = [...rows];
      updatedRows[editIndex] = formData;
      setRows(updatedRows);
    } else {
      // Add new row
      const updatedRows = [...rows, formData];
      setRows(updatedRows); // Trigger useEffect to save to localStorage
    }

    handleCloseModal();
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dynamic Table with Modal
      </Typography>
      <Button variant="contained" onClick={() => handleOpenModal()} sx={{ marginBottom: 2 }}>
        Add Row
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Pray Morning</TableCell>
              <TableCell>Pray Night</TableCell>
              <TableCell>Workout</TableCell>
              <TableCell>Steps</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.prayMorning}
                    onChange={(e) =>
                      setRows((prevRows) => {
                        const updated = [...prevRows];
                        updated[index].prayMorning = e.target.checked;
                        return updated;
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.prayNight}
                    onChange={(e) =>
                      setRows((prevRows) => {
                        const updated = [...prevRows];
                        updated[index].prayNight = e.target.checked;
                        return updated;
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.workout}
                    onChange={(e) =>
                      setRows((prevRows) => {
                        const updated = [...prevRows];
                        updated[index].workout = e.target.checked;
                        return updated;
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.steps}
                    onChange={(e) =>
                      setRows((prevRows) => {
                        const updated = [...prevRows];
                        updated[index].steps = parseInt(e.target.value) || 0;
                        return updated;
                      })
                    }
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(index)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding/Editing Rows */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? 'Edit Row' : 'Add Row'}
          </Typography>
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <div>
            <Checkbox
              checked={formData.prayMorning}
              onChange={(e) =>
                setFormData({ ...formData, prayMorning: e.target.checked })
              }
            />
            Pray Morning
          </div>
          <div>
            <Checkbox
              checked={formData.prayNight}
              onChange={(e) =>
                setFormData({ ...formData, prayNight: e.target.checked })
              }
            />
            Pray Night
          </div>
          <div>
            <Checkbox
              checked={formData.workout}
              onChange={(e) =>
                setFormData({ ...formData, workout: e.target.checked })
              }
            />
            Workout
          </div>
          <TextField
            label="Steps"
            type="number"
            value={formData.steps}
            onChange={(e) =>
              setFormData({ ...formData, steps: parseInt(e.target.value) || 0 })
            }
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default DynamicTable;
