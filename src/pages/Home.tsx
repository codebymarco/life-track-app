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
import HandsIcon from "@mui/icons-material/PanTool";

import PrayIcon from "@mui/icons-material/EmojiPeople";
import BibleIcon from "@mui/icons-material/MenuBook";
import StretchIcon from "@mui/icons-material/SelfImprovement";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import WeightIcon from "@mui/icons-material/FitnessCenter";
import HeightIcon from "@mui/icons-material/Height";
import SleepIcon from "@mui/icons-material/Hotel";
import PoopIcon from "@mui/icons-material/EmojiNature";
import TravelTimeIcon from "@mui/icons-material/Flight";

import PurchasesIcon from "@mui/icons-material/ShoppingCart";
import WristGripsIcon from "@mui/icons-material/PanTool";
import TakeoutFoodIcon from "@mui/icons-material/Fastfood";
import SodaIcon from "@mui/icons-material/LocalDrink";
import ShowersIcon from "@mui/icons-material/Shower";
import ColdShowerIcon from "@mui/icons-material/AcUnit";
import PornIcon from "@mui/icons-material/HideSource";
import KegelsIcon from "@mui/icons-material/SelfImprovement";
import TedTalkIcon from "@mui/icons-material/Mic";
import BooksSummaryIcon from "@mui/icons-material/MenuBook";
import StepsIcon from "@mui/icons-material/DirectionsWalk";
import WaterBottleIcon from "@mui/icons-material/WaterDrop";

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

  const [kegelsTotal, setKegelsTotal] = useState<number>(0);
  const [kegelsAverage, setKegelsAverage] = useState<number>(0);

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

      // STEPS
      const totalKegels = storedEntries.reduce((sum: number, entry: any) => {
        const jelqsValue = parseInt(entry.no_of_kegels, 10); // Convert string to integer
        return sum + (isNaN(jelqsValue) ? 0 : jelqsValue); // Add value if it's a valid number
      }, 0);
      const averageKegels = totalKegels / storedEntries.length;

      setKegelsTotal(totalKegels);
      setKegelsAverage(averageKegels);
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
    highest?: number;
    highestDate?: string;
    lowestDate?: string;
    lowest?: number;
    total?: number;
    history: boolean[]; // Last 5 days history (true for yes, false for no)
  }

  interface TrackerData {
    prayMorning: Activity;
    prayDay: Activity;
    stretch: Activity;
    bible: Activity;
    porn: Activity;
    workoutTime: Activity;
    travelTime: Activity;
    bikeTime: Activity;
    bikeDistance: Activity;
    masturbate: Activity;
    prayNight: Activity;
    workout: Activity;
    jelqs: Activity;
    weight: Activity;
    height: Activity;
    wrist_grips: Activity;
    sunTime: Activity;
    sleep: Activity;
    water: Activity;
    poop: Activity;
    kegels: Activity;
    coffee: Activity;
    soda: Activity;
    takeout: Activity;
    showers: Activity;
    books_summary: Activity;
    csm: Activity;
    csn: Activity;
    ted_talk: Activity;
    coding: Activity;
    waterIntake: number;
    steps: Activity;
    purchases: Activity;
  }

  const trackerData: TrackerData = {
    stretch: {
      name: "Stretch",
      currentStreak: 5,
      history: [true, true, true, false, true],
      total: pmTotal,
    },
    bible: {
      name: "Bible",
      currentStreak: 5,
      history: [true, true, true, false, true],
      total: pmTotal,
    },
    takeout: {
      name: "Takeout",
      currentStreak: 5,
      history: [true, true, true, false, true],
      total: pmTotal,
    },
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
    csm: {
      name: "Cold Shower Morning",
      currentStreak: 5,
      history: [true, false, true, true, true],
      total: pornTotal,
    },
    csn: {
      name: "Cold Shower Night",
      currentStreak: 5,
      history: [true, false, true, true, true],
      total: pornTotal,
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
    prayDay: {
      name: "Day Prayer",
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

    height: {
      name: "Height",
      currentStreak: 5,
      history: [true, true, false, true, true],
      average: 187,
      highest: 190,
      lowest: 181,
    },
    weight: {
      name: "Weight",
      currentStreak: 5,
      history: [true, true, false, true, true],
      average: 65,
      highest: 67,
      lowest: 60,
    },

    water: {
      name: "Water",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: waterTotal,
      average: waterAverage,
      highest: 39000,
      lowest: 39,
      highestDate: new Date().toISOString(), // Sets the current date and time in ISO 8601 format,
      lowestDate: new Date().toISOString(), // Sets the current date and time in ISO 8601 format,
    },
    showers: {
      name: "Showers",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: jelqsTotal,
      average: jelqsAverage,
    },
    wrist_grips: {
      name: "Wrist Grips",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: jelqsTotal,
      average: jelqsAverage,
    },
    purchases: {
      name: "Purcahses",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: jelqsTotal,
      average: jelqsAverage,
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
    kegels: {
      name: "Kegels",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: kegelsTotal,
      average: kegelsAverage,
    },

    books_summary: {
      name: "Books Summary",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: kegelsTotal,
      average: kegelsAverage,
    },

    coffee: {
      name: "Coffe",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: kegelsTotal,
      average: kegelsAverage,
    },

    soda: {
      name: "Soda",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: kegelsTotal,
      average: kegelsAverage,
    },

    ted_talk: {
      name: "Ted Talk",
      currentStreak: 5,
      history: [true, true, false, true, true],
      total: kegelsTotal,
      average: kegelsAverage,
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
    travelTime: {
      name: "Travel Time",
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
      activity: trackerData.purchases,
      icon: <PurchasesIcon fontSize="large" />,
    },
    {
      activity: trackerData.stretch,
      icon: <StretchIcon fontSize="large" />,
    },
    {
      activity: trackerData.bible,
      icon: <BibleIcon fontSize="large" />,
    },
    {
      activity: trackerData.wrist_grips,
      icon: <WristGripsIcon fontSize="large" />,
    },
    {
      activity: trackerData.coffee,
      icon: <CoffeeIcon fontSize="large" />,
    },
    {
      activity: trackerData.takeout,
      icon: <TakeoutFoodIcon fontSize="large" />,
    },
    {
      activity: trackerData.soda,
      icon: <SodaIcon fontSize="large" />,
    },
    {
      activity: trackerData.weight,
      icon: <WeightIcon fontSize="large" />,
    },
    {
      activity: trackerData.height,
      icon: <HeightIcon fontSize="large" />,
    },
    {
      activity: trackerData.prayMorning,
      icon: <HandsIcon fontSize="large" />,
    },
    {
      activity: trackerData.prayNight,
      icon: <HandsIcon fontSize="large" />,
    },
    {
      activity: trackerData.prayDay,
      icon: <HandsIcon fontSize="large" />,
    },
    {
      activity: trackerData.showers,
      icon: <ShowersIcon fontSize="large" />,
    },
    {
      activity: trackerData.csm,
      icon: <ColdShowerIcon fontSize="large" />,
    },
    {
      activity: trackerData.csn,
      icon: <ColdShowerIcon fontSize="large" />,
    },
    {
      activity: trackerData.porn,
      icon: <PornIcon fontSize="large" />,
    },
    {
      activity: trackerData.sleep,
      icon: <SleepIcon fontSize="large" />,
    },
    {
      activity: trackerData.poop,
      icon: <PoopIcon fontSize="large" />,
    },
    {
      activity: trackerData.kegels,
      icon: <KegelsIcon fontSize="large" />,
    },
    {
      activity: trackerData.ted_talk,
      icon: <TedTalkIcon fontSize="large" />,
    },
    {
      activity: trackerData.books_summary,
      icon: <BooksSummaryIcon fontSize="large" />,
    },
    {
      activity: trackerData.steps,
      icon: <StepsIcon fontSize="large" />,
    },
    {
      activity: trackerData.masturbate,
      icon: <SportsMmaIcon fontSize="large" />,
    },
    {
      activity: trackerData.water,
      icon: <WaterBottleIcon fontSize="large" />,
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
      activity: trackerData.travelTime,
      icon: <TravelTimeIcon fontSize="large" />,
    },
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
        Morning Marco.
      </Typography>
      <Typography variant="h4" gutterBottom>
        Last time I checked, you are tall, handsome and funny and you have six
        pack, wide delts, sexy calfs
      </Typography>
      <Typography variant="h4" gutterBottom>
        You are funny and handosme enough to steal somesone GF
      </Typography>
      <Typography variant="h4" gutterBottom>
        Please work on your speech and eye contact.
      </Typography>
      <Typography variant="h4" gutterBottom>
        on the 5th Feb have a haircut and trim body hair.
      </Typography>
      <Typography variant="h4" gutterBottom>
        remember happiness comes from within
      </Typography>
      <Typography variant="h4" gutterBottom>
        tomkorow is saturday, wash car, dont spend the whole day in bed
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

                  {tracker.activity.highest ? (
                    <Typography color="text.secondary">
                      highest:
                      {tracker.activity.highest}
                    </Typography>
                  ) : null}

                  {tracker.activity.highestDate ? (
                    <Typography color="text.secondary">
                      highestDate:
                      {tracker.activity.highestDate}
                    </Typography>
                  ) : null}

                  {tracker.activity.lowestDate ? (
                    <Typography color="text.secondary">
                      highestDate:
                      {tracker.activity.lowestDate}
                    </Typography>
                  ) : null}

                  {tracker.activity.lowest ? (
                    <Typography color="text.secondary">
                      lowest:
                      {tracker.activity.lowest}
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
