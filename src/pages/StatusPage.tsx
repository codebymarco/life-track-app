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
  workoutTime: number;
  suntime: number;
  jelqs: number;
  stretch: boolean;
  pe: boolean;
  kegels: boolean;
  coding?: number;
};

type EntryData2 = {
  water: number;
};

// Type Guard for EntryData
const isValidEntry = (entry: any): entry is EntryData => {
  return (
    typeof entry.date === "string" &&
    typeof entry.prayMorning === "boolean" &&
    typeof entry.prayEvening === "boolean" &&
    typeof entry.workout === "boolean" &&
    Array.isArray(entry.workoutDetails) &&
    typeof entry.mast === "boolean" &&
    typeof entry.pn === "boolean" &&
    typeof entry.steps === "number" &&
    typeof entry.workoutTime === "number" &&
    typeof entry.suntime === "number" &&
    typeof entry.jelqs === "number" &&
    typeof entry.stretch === "boolean" &&
    typeof entry.pe === "boolean" &&
    typeof entry.kegels === "boolean"
    // Add other field validations if necessary
  );
};

const StatusPage: React.FC = () => {
  // State to hold entries
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [dietEntries, setDietEntries] = useState<EntryData2[]>([]);

  // Statistics
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [averageSteps, setAverageSteps] = useState<number>(0);

  const [totalWater, setTotalWater] = useState<number>(0);
  const [averageWater, setAverageWater] = useState<number>(0);

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

  // Suntime Metrics
  const [totalWorkouttime, setTotalWorkouttime] = useState<number>(0);
  const [averageWorkouttime, setAverageWorkouttime] = useState<number>(0);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedEntries = JSON.parse(localStorage.getItem("entries") || "[]");

      const parsedEntries: EntryData[] = storedEntries
        .map((entry: any) => ({
          ...entry,
          steps: Number(entry.steps) || 0,
          workoutTime: Number(entry.workoutTime) || 0,
          jelqs: Number(entry.jelqs) || 0,
          suntime: Number(entry.suntime) || 0,
          coding: entry.coding !== undefined ? Number(entry.coding) : 0,
        }))
        .filter(isValidEntry);

      setEntries(parsedEntries);
      console.log("Loaded Entries:", parsedEntries);
    } catch (error) {
      console.error("Failed to parse entries from localStorage:", error);
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    try {
      const storedEntries2 = JSON.parse(
        localStorage.getItem("dietEntries") || "[]"
      );

      const parsedEntries: EntryData2[] = storedEntries2.map((entry: any) => ({
        water: parseFloat(entry.water) || 0, // Convert water to a float
      }));

      setDietEntries(parsedEntries);
      console.log("Loaded Diet Entries:", parsedEntries);
    } catch (error) {
      console.error("Failed to parse dietEntries from localStorage:", error);
      setDietEntries([]);
    }
  }, []);

  // Compute statistics whenever entries change
  useEffect(() => {
    if (entries.length === 0) {
      // Reset all statistics if there are no entries
      setTotalSteps(0);
      setAverageSteps(0);
      setPrayMorningCount(0);
      setPrayEveningCount(0);
      setWorkoutCount(0);
      setMastCount(0);
      setPnCount(0);
      setStretchCount(0);
      setPeCount(0);
      setKegelsCount(0);
      setTotalCodingMinutes(0);
      setAverageCodingMinutes(0);
      setTotalJelqs(0);
      setAverageJelqs(0);
      setTotalSuntime(0);
      setAverageSuntime(0);
      setTotalWorkouttime(0);
      setAverageWorkouttime(0);
      return;
    }

    // Steps Statistics
    const stepsArray = entries
      .map((entry) => entry.steps)
      .filter((step) => !isNaN(step));
    const total = stepsArray.reduce((acc, curr) => acc + curr, 0);
    const average = stepsArray.length > 0 ? total / stepsArray.length : 0;
    setTotalSteps(total);
    setAverageSteps(average);

    const workoutsArray = entries
      .map((entry) => entry.workoutTime)
      .filter((workoutTime) => !isNaN(workoutTime));
    const total2 = workoutsArray.reduce((acc, curr) => acc + curr, 0);
    const average2 =
      workoutsArray.length > 0 ? total2 / workoutsArray.length : 0; // Use total2
    setTotalWorkouttime(total2);
    setAverageWorkouttime(average2);

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
    const codingArray = entries
      .map((entry) => entry.coding || 0)
      .filter((c) => !isNaN(c));
    const totalCoding = codingArray.reduce((acc, curr) => acc + curr, 0);
    const averageCoding =
      codingArray.length > 0 ? totalCoding / codingArray.length : 0;
    setTotalCodingMinutes(totalCoding);
    setAverageCodingMinutes(averageCoding);

    // Jelqs Metrics
    const jelqsArray = entries
      .map((entry) => entry.jelqs)
      .filter((j) => !isNaN(j));
    const totalJelqs = jelqsArray.reduce((acc, curr) => acc + curr, 0);
    const averageJelqs =
      jelqsArray.length > 0 ? totalJelqs / jelqsArray.length : 0;
    setTotalJelqs(totalJelqs);
    setAverageJelqs(averageJelqs);

    // Suntime Metrics
    const suntimeArray = entries
      .map((entry) => entry.suntime)
      .filter((s) => !isNaN(s));
    const totalSuntime = suntimeArray.reduce((acc, curr) => acc + curr, 0);
    const averageSuntime =
      suntimeArray.length > 0 ? totalSuntime / suntimeArray.length : 0;
    setTotalSuntime(totalSuntime);
    setAverageSuntime(averageSuntime);

    // Debugging Logs
    console.log("Total Steps:", total);
    console.log("Average Steps:", average);
    console.log("Total Jelqs:", totalJelqs);
    console.log("Average Jelqs:", averageJelqs);
    console.log("Total Suntime:", totalSuntime);
    console.log("Average Suntime:", averageSuntime);
  }, [entries]);

  // Compute statistics whenever entries change
  useEffect(() => {
    if (dietEntries.length === 0) {
      // Reset all statistics if there are no entries
      setTotalWater(0);
      setAverageWater(0);
      return;
    }

    // Water Statistics
    const waterArray = dietEntries
      .map((entry) => entry.water)
      .filter((water) => !isNaN(water));
    const totalWaterConsumed = waterArray.reduce((acc, curr) => acc + curr, 0);
    const averageWaterConsumed =
      waterArray.length > 0 ? totalWaterConsumed / waterArray.length : 0;

    setTotalWater(totalWaterConsumed);
    setAverageWater(averageWaterConsumed);
  }, [dietEntries]);

  // Handle Download Statistics as JSON
  const handleDownload = () => {
    const stats = {
      totalSteps,
      averageSteps: Number(averageSteps.toFixed(2)),
      totalCodingMinutes,
      averageCodingMinutes: Number(averageCodingMinutes.toFixed(2)),
      totalJelqs,
      averageJelqs: Number(averageJelqs.toFixed(2)),
      totalSuntime,
      averageSuntime: Number(averageSuntime.toFixed(2)),
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
                {averageSteps.toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Water
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {totalWater}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Average Water
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {averageWater.toFixed(0)}
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

        {/* Kegels Statistics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Kegels
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
                Average Kegels per Day
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

        {/* Suntime Statistics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                workout time (minutes)
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {totalWorkouttime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Average workout per Day (minutes)
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {averageWorkouttime.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Boolean Metrics */}
        {[
          { label: "Pray Morning", count: prayMorningCount },
          { label: "Pray Evening", count: prayEveningCount },
          { label: "Workout", count: workoutCount },
          { label: "Masturbate", count: mastCount },
          { label: "Wacthed Porn", count: pnCount },
          { label: "Stretch", count: stretchCount },
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
            <YAxis
              yAxisId="left"
              label={{ value: "Steps", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Jelqs & Suntime",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="steps"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="jelqs"
              stroke="#82ca9d"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="suntime"
              stroke="#ffc658"
            />
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
