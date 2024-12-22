// src/StatusPage.tsx

import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type EntryData = {
  date: string;
  prayMorning: boolean;
  prayEvening: boolean;
  workout: boolean;
  workoutDetails: string[];
  mast: boolean;
  pn: boolean;
  steps: number;
  suntime: number;
  jelqs: number;
  stretch: boolean;
  pe: boolean;
  kegels: boolean;
  coding?: number;
};

const StatusPage: React.FC = () => {
  // State to hold entries
  const [entries, setEntries] = useState<EntryData[]>([]);

  // Statistics
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [averageSteps, setAverageSteps] = useState<number>(0);

  // Boolean Metrics Counts
  const [prayMorningCount, setPrayMorningCount] = useState<number>(0);
  const [prayEveningCount, setPrayEveningCount] = useState<number>(0);
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const [mastCount, setMastCount] = useState<number>(0);
  const [pnCount, setPnCount] = useState<number>(0);
  const [stretchCount, setStretchCount] = useState<number>(0);
  const [peCount, setPeCount] = useState<number>(0);
  const [kegelsCount, setKegelsCount] = useState<number>(0);

  // Coding Metrics
  const [totalCodingMinutes, setTotalCodingMinutes] = useState<number>(0);
  const [averageCodingMinutes, setAverageCodingMinutes] = useState<number>(0);

  // Jelqs Metrics
  const [totalJelqs, setTotalJelqs] = useState<number>(0);
  const [averageJelqs, setAverageJelqs] = useState<number>(0);

  // Suntime Metrics
  const [totalSuntime, setTotalSuntime] = useState<number>(0);
  const [averageSuntime, setAverageSuntime] = useState<number>(0);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedEntries = JSON.parse(
        localStorage.getItem("entries") || "[]"
      ) as EntryData[];
      setEntries(storedEntries);
    } catch {
      setEntries([]);
    }
  }, []);

  // Compute statistics whenever entries change
  useEffect(() => {
    // Steps Statistics
    const stepsArray = entries.map((entry) => entry.steps);
    const total = stepsArray.reduce((acc, curr) => acc + curr, 0);
    const average = entries.length > 0 ? total / entries.length : 0;
    setTotalSteps(total);
    setAverageSteps(average);

    // Boolean Metrics Counts
    setPrayMorningCount(entries.filter((entry) => entry.prayMorning).length);
    setPrayEveningCount(entries.filter((entry) => entry.prayEvening).length);
    setWorkoutCount(entries.filter((entry) => entry.workout).length);
    setMastCount(entries.filter((entry) => entry.mast).length);
    setPnCount(entries.filter((entry) => entry.pn).length);
    setStretchCount(entries.filter((entry) => entry.stretch).length);
    setPeCount(entries.filter((entry) => entry.pe).length);
    setKegelsCount(entries.filter((entry) => entry.kegels).length);

    // Coding Metrics
    const codingArray = entries.map((entry) => entry.coding || 0);
    const totalCoding = codingArray.reduce((acc, curr) => acc + curr, 0);
    const averageCoding = entries.length > 0 ? totalCoding / entries.length : 0;
    setTotalCodingMinutes(totalCoding);
    setAverageCodingMinutes(averageCoding);

    // Jelqs Metrics
    const jelqsArray = entries.map((entry) => entry.jelqs || 0);
    const totalJelqs = jelqsArray.reduce((acc, curr) => acc + curr, 0);
    const averageJelqs = entries.length > 0 ? totalJelqs / entries.length : 0;
    setTotalJelqs(totalJelqs);
    setAverageJelqs(averageJelqs);

    // Suntime Metrics
    const suntimeArray = entries.map((entry) => entry.suntime || 0);
    const totalSuntime = suntimeArray.reduce((acc, curr) => acc + curr, 0);
    const averageSuntime =
      entries.length > 0 ? totalSuntime / entries.length : 0;
    setTotalSuntime(totalSuntime);
    setAverageSuntime(averageSuntime);
  }, [entries]);

  // Handle Download Statistics as JSON
  const handleDownload = () => {
    const stats = {
      totalSteps,
      averageSteps: averageSteps.toFixed(2),
      totalCodingMinutes,
      averageCodingMinutes: averageCodingMinutes.toFixed(2),
      totalJelqs,
      averageJelqs: averageJelqs.toFixed(2),
      totalSuntime,
      averageSuntime: averageSuntime.toFixed(2),
      prayMorningCount,
      prayEveningCount,
      workoutCount,
      mastCount,
      pnCount,
      stretchCount,
      peCount,
      kegelsCount,
      timestamp: new Date().toISOString(),
    };
    const jsonData = JSON.stringify(stats, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `status_${new Date().toISOString()}.json`;
    link.click();
  };

  // Prepare data for charts
  const chartData = entries.map((entry) => ({
    date: entry.date,
    steps: entry.steps,
    jelqs: entry.jelqs,
    suntime: entry.suntime,
  }));

  // Calculate Percentages
  const totalEntries = entries.length;
  const calculatePercentage = (count: number) =>
    totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(2) : "0.00";

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Status
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3}>
        {/* Steps Statistics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Steps
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {totalSteps}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Average Steps
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {averageSteps.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Coding Statistics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Coding Minutes
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {totalCodingMinutes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Average Coding Minutes
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {averageCodingMinutes.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Jelqs Statistics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Jelqs
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {totalJelqs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Average Jelqs per Day
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {averageJelqs.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Suntime Statistics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Suntime (minutes)
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {totalSuntime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Average Suntime per Day (minutes)
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {averageSuntime.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Boolean Metrics */}
        {[
          { label: "Pray Morning", count: prayMorningCount },
          { label: "Pray Evening", count: prayEveningCount },
          { label: "Workout", count: workoutCount },
          { label: "Mast", count: mastCount },
          { label: "PN", count: pnCount },
          { label: "Stretch", count: stretchCount },
          { label: "PE", count: peCount },
          { label: "Kegels", count: kegelsCount },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  {metric.count} / {totalEntries} (
                  {calculatePercentage(metric.count)}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Metrics Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: "Steps", angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Jelqs & Suntime", angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="jelqs" stroke="#82ca9d" />
            <Line yAxisId="right" type="monotone" dataKey="suntime" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Download Button */}
      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download Status as JSON
        </Button>
      </Box>
    </Box>
  );
};

export default StatusPage;
