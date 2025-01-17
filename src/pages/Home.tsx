import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import CodeIcon from "@mui/icons-material/Code";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsMmaIcon from "@mui/icons-material/SportsMma"; // Proxy icon for prayer
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import StraightenIcon from "@mui/icons-material/Straighten";

const Home: React.FC = () => {
  const [data, setData] = useState<FormData[]>([]);
  const [data2, setData2] = useState<FormData[]>([]);
  const [pmTotal, setPmTotal] = useState<number>(0);
  const [pnTotal, setPnTotal] = useState<number>(0);
  const [workoutTotal, setWorkoutTotal] = useState<number>(0);
  const [jelqsTotal, setJelqsTotal] = useState<number>(0);
  const [jelqsAverage, setJelqsAverage] = useState<number>(0);

  const [pornTotal, setPornTotal] = useState<number>(0);
  const [masturbateTotal, setMasturbateTotal] = useState<number>(0);

  const [sunTotal, setSunTotal] = useState<number>(0);
  const [sunAverage, setSunAverage] = useState<number>(0);

  const [workoutTimeTotal, setWorkoutTimeTotal] = useState<number>(0);
  const [workoutTimeAverage, setWorkoutTimeAverage] = useState<number>(0);

  const [sleepTotal, setSleepTotal] = useState<number>(0);
  const [sleepAverage, setSleepAverage] = useState<number>(0);

  const [poopTotal, setPoopTotal] = useState<number>(0);
  const [poopAverage, setPoopAverage] = useState<number>(0);

  const [stepsTotal, setStepsTotal] = useState<number>(0);
  const [stepsAverage, setStepsAverage] = useState<number>(0);

  const [waterTotal, setWaterTotal] = useState<number>(0);
  const [waterAverage, setWaterAverage] = useState<number>(0);

  useEffect(() => {
    try {
      const storedEntries2 = JSON.parse(
        localStorage.getItem("dietEntries") || "[]"
      ) as FormData[];
      setData2(
        storedEntries2.map((entry) => ({
          ...entry,
        }))
      );

      const storedEntries = JSON.parse(
        localStorage.getItem("entries") || "[]"
      ) as FormData[];
      setData(
        storedEntries.map((entry) => ({
          ...entry,
        }))
      );
      const totalPmTrue = storedEntries.filter(
        (entry: any) => entry.prayMorning
      ).length;
      const totalPnTrue = storedEntries.filter(
        (entry: any) => entry.prayEvening
      ).length;
      const totalJelqs = storedEntries.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.jelqs, 10); // Convert string to integer
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue); // Add value if it's a valid number
      }, 0);
      const totalWorkoutTrue = storedEntries.filter(
        (entry: any) => entry.workout
      ).length;

      const totalWorkoutTime = storedEntries.reduce(
        (sum: number, entry: any) => {
          const jelqsValue = parseInt(entry.workoutTime, 10); // Convert string to integer
          return sum + (isNaN(jelqsValue) ? 0 : jelqsValue); // Add value if it's a valid number
        },
        0
      );

      const averageWT = totalWorkoutTime / storedEntries.length;

      const average = totalJelqs / storedEntries.length;

      const totalSun = storedEntries.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.suntime, 10);
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue);
      }, 0);
      const averageSun = totalSun / storedEntries.length;

      const totalPornTrue = storedEntries.filter(
        (entry: any) => entry.pn
      ).length;

      const totalMasTrue = storedEntries.filter(
        (entry: any) => entry.mast
      ).length;

      // SLEEP
      const totalSleep = storedEntries.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.sleepTime, 10);
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue);
      }, 0);
      const averageSleep = totalSleep / storedEntries.length;

      // POOP
      const totalPoop = storedEntries.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.poop, 10); // Convert string to integer
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue); // Add value if it's a valid number
      }, 0);
      const averagePoop = totalPoop / storedEntries.length;

      // STEPS
      const totalSteps = storedEntries.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.steps, 10); // Convert string to integer
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue); // Add value if it's a valid number
      }, 0);
      const averageSteps = totalSteps / storedEntries.length;

      const totalWater = storedEntries2.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.water, 10); // Convert string to integer
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue); // Add value if it's a valid number
      }, 0);

      const averageWater = totalWater / storedEntries.length;

      setStepsTotal(totalSteps);
      setStepsAverage(averageSteps);
      setWaterTotal(totalWater);
      setWaterAverage(averageWater);
      setPoopTotal(totalPoop);
      setPoopAverage(averagePoop);
      setSleepTotal(totalSleep);
      setSleepAverage(averageSleep);
      setWorkoutTimeTotal(totalWorkoutTime);
      setWorkoutTimeAverage(averageWT);
      setMasturbateTotal(totalMasTrue);
      setPornTotal(totalPornTrue);
      setPmTotal(totalPmTrue);
      setPnTotal(totalPnTrue);
      setJelqsTotal(totalJelqs);
      setSunTotal(totalSun);
      setSunAverage(averageSun);
      setWorkoutTotal(totalWorkoutTrue);
      setJelqsAverage(average);
    } catch {
      setData([]);
    }
  }, []);

  console.log("data", data);
  console.log("pm tootal", pmTotal);

  interface Activity {
    name: string;
    currentStreak: number;
    average?: number;
    total?: number;
    history: boolean[]; // Last 5 days history (true for yes, false for no)
  }

  interface TrackerData {
    prayMorning: Activity;
    porn: Activity;
    workoutTime: Activity;
    bikeTime: Activity;
    bikeDistance: Activity;
    masturbate: Activity;
    prayNight: Activity;
    workout: Activity;
    jelqs: Activity;
    sunTime: Activity;
    sleep: Activity;
    water: Activity;
    poop: Activity;
    coding: Activity;
    waterIntake: number;
    steps: Activity;
  }

  const trackerData: TrackerData = {
    prayMorning: {
      name: "Morning Prayer",
      currentStreak: 5,
      history: [true, true, true, false, true],
      total: pmTotal,
    },
    masturbate: {
      name: "mastrubate",
      currentStreak: 5,
      history: [true, false, true, true, true],
      total: masturbateTotal,
    },
    porn: {
      name: "Porn",
      currentStreak: 5,
      history: [true, false, true, true, true],
      total: pornTotal,
    },
    prayNight: {
      name: "Night Prayer",
      currentStreak: 5,
      history: [true, false, true, true, true],
      total: pnTotal,
    },
    workout: {
      name: "Workout",
      currentStreak: 5,
      history: [false, true, true, true, false],
      total: workoutTotal,
    },
    water: {
      name: "Water",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: waterTotal,
      average: waterAverage,
    },
    jelqs: {
      name: "Jelqs",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: jelqsTotal,
      average: jelqsAverage,
    },
    sleep: {
      name: "Sleep",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: sleepTotal,
      average: sleepAverage,
    },
    poop: {
      name: "Poop",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: poopTotal,
      average: poopAverage,
    },

    steps: {
      name: "Steps",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: stepsTotal,
      average: stepsAverage,
    },
    workoutTime: {
      name: "Workout Time",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: workoutTimeTotal,
      average: workoutTimeAverage,
    },
    sunTime: {
      name: "Sun Time",
      currentStreak: 5,
      history: [false, false, true, true, true],
      total: sunTotal,
      average: sunAverage,
    },
    coding: {
      name: "Coding",
      currentStreak: 5,
      history: [true, true, true, true, true],
    },
    bikeTime: {
      name: "Bike Time",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: workoutTimeTotal,
      average: workoutTimeAverage,
    },
    bikeDistance: {
      name: "Bike Distance",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: workoutTimeTotal,
      average: workoutTimeAverage,
    },
    waterIntake: 3.5,
  };

  const trackers = [
    {
      activity: trackerData.prayMorning,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.prayNight,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.porn,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.sleep,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.poop,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.steps,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.masturbate,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.water,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.workout,
      icon: <FitnessCenterIcon fontSize="large" />,
    },
    {
      activity: trackerData.bikeDistance,
      icon: <StraightenIcon fontSize="large" />,
    },
    {
      activity: trackerData.bikeTime,
      icon: <PedalBikeIcon fontSize="large" />,
    },
    { activity: trackerData.jelqs, icon: <EmojiPeopleIcon fontSize="large" /> },
    {
      activity: trackerData.workoutTime,
      icon: <EmojiPeopleIcon fontSize="large" />,
    },
    { activity: trackerData.sunTime, icon: <WbSunnyIcon fontSize="large" /> },
    { activity: trackerData.coding, icon: <CodeIcon fontSize="large" /> },
  ];

  const today = new Date();
  const generateSampleData = (): any[] => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        steps: Math.floor(Math.random() * 20000 + 10000),
        jelqs: Math.floor(Math.random() * 15),
        sunTime: Math.floor(Math.random() * 10),
        kegels: Math.floor(Math.random() * 10 + 5),
      });
    }
    return data;
  };

  const carouselData = generateSampleData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentDayData = carouselData[currentIndex];

  const calculateTotals = () => {
    const totalSteps = carouselData.reduce((acc, day) => acc + day.steps, 0);
    const totalJelqs = carouselData.reduce((acc, day) => acc + day.jelqs, 0);
    const totalSunTime = carouselData.reduce(
      (acc, day) => acc + day.sunTime,
      0
    );
    const totalKegels = carouselData.reduce((acc, day) => acc + day.kegels, 0);
    const numDays = carouselData.length;

    return {
      totalSteps,
      totalJelqs,
      totalSunTime,
      totalKegels,
      numDays,
      avgSteps: (totalSteps / numDays).toFixed(2),
      avgJelqs: (totalJelqs / numDays).toFixed(2),
      avgSunTime: (totalSunTime / numDays).toFixed(2),
      avgKegels: (totalKegels / numDays).toFixed(2),
    };
  };

  const stats = calculateTotals();

  const todos = [
    { task: "Complete project report", dueToday: true },
    { task: "Buy groceries", dueToday: true },
    { task: "Schedule doctor appointment", dueToday: false },
    { task: "Call parents", dueToday: false },
  ];

  const toBuys = [
    { item: "Milk", dueToday: true },
    { item: "Eggs", dueToday: false },
    { item: "Bread", dueToday: true },
    { item: "Vegetables", dueToday: false },
  ];

  console.log(stats, todos, toBuys);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Life Trackers Dashboard
      </Typography>

      {/* Activity Streaks */}
      <Grid container spacing={3}>
        {trackers.map((tracker, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ display: "flex", flexDirection: "column", p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ mr: 2 }}>{tracker.icon}</Box>
                <CardContent>
                  <Typography variant="h6">{tracker.activity.name}</Typography>
                  <Typography color="text.secondary">
                    Current Streak: {tracker.activity.currentStreak} day
                    {tracker.activity.currentStreak > 1 ? "s" : ""}
                  </Typography>
                  <Typography color="text.secondary">
                    total: {tracker.activity.total}/ {data.length}
                  </Typography>
                  {tracker.activity.average ? (
                    <Typography color="text.secondary">
                      {tracker.activity.average} per day
                    </Typography>
                  ) : null}
                </CardContent>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last 5 Days:{" "}
                {tracker.activity.history.map((status, idx) =>
                  status ? (
                    <CheckCircleIcon key={idx} color="success" />
                  ) : (
                    <CancelIcon key={idx} color="error" />
                  )
                )}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Carousel Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Daily Overview
        </Typography>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton onClick={handlePrev}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">{currentDayData.date}</Typography>
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <Typography>Steps: {currentDayData.steps}</Typography>
          <Typography>Jelqs: {currentDayData.jelqs}</Typography>
          <Typography>Sun Time: {currentDayData.sunTime} hours</Typography>
          <Typography>Kegels: {currentDayData.kegels}</Typography>
        </Card>
      </Box>
    </Container>
  );
};

export default Home;
