// src/components/HomePage.tsx
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CodeIcon from '@mui/icons-material/Code';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMmaIcon from '@mui/icons-material/SportsMma'; // Proxy icon for prayer
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Home: React.FC = () => {
  // TypeScript Interfaces
  interface Activity {
    name: string;
    currentStreak: number;
  }

  interface TrackerData {
    prayMorning: Activity;
    prayNight: Activity;
    workout: Activity;
    jelqs: Activity;
    sunTime: Activity;
    coding: Activity;
    waterIntake: number; // in liters
    steps: number;
  }

  // Sample Data - Replace with real data source
  const trackerData: TrackerData = {
    prayMorning: { name: 'Morning Prayer', currentStreak: 5 },
    prayNight: { name: 'Night Prayer', currentStreak: 5 },
    workout: { name: 'Workout', currentStreak: 5 },
    jelqs: { name: 'Jelqs', currentStreak: 5 },
    sunTime: { name: 'Sun Time', currentStreak: 5 },
    coding: { name: 'Coding', currentStreak: 5 },
    waterIntake: 3.5, // in liters
    steps: 22000,
  };

  // Define Tracker Items with Corresponding Icons
  const trackers: { activity: Activity; icon: JSX.Element }[] = [
    { activity: trackerData.prayMorning, icon: <SportsMmaIcon fontSize="large" /> },
    { activity: trackerData.prayNight, icon: <SportsMmaIcon fontSize="large" /> },
    { activity: trackerData.workout, icon: <FitnessCenterIcon fontSize="large" /> },
    { activity: trackerData.jelqs, icon: <EmojiPeopleIcon fontSize="large" /> },
    { activity: trackerData.sunTime, icon: <WbSunnyIcon fontSize="large" /> },
    { activity: trackerData.coding, icon: <CodeIcon fontSize="large" /> },
  ];

  // Calculate Steps Streak
  const stepsStreak = Math.floor(trackerData.steps / 20000);

  // ------------------- Carousel Implementation -------------------

  // Define the FormData type
  type FormData = {
    date: string;
    prayMorning: boolean;
    prayEvening: boolean;
    workout: boolean;
    workoutDetails: string[];
    workoutTime: number; // in minutes
    sleepTime: number; // in hours
    poop: number;
    numberOfShowers: number;
    no_of_kegels: number;
    mast: boolean;
    pn: boolean;
    steps: string;
    suntime: number;
    jelqs: number;
    stretch: boolean;
    pe: boolean;
    kegels: boolean;
    coding?: number;
  };

  // Generate Sample Data for 5 Days
  const today = new Date();
  const generateSampleData = (): FormData[] => {
    const data: FormData[] = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        prayMorning: Math.random() > 0.2,
        prayEvening: Math.random() > 0.2,
        workout: Math.random() > 0.3,
        workoutDetails: ['Push-ups', 'Running'],
        workoutTime: Math.floor(Math.random() * 60) + 20, // 20 to 80 minutes
        sleepTime: parseFloat((Math.random() * 4 + 4).toFixed(1)), // 4.0 to 8.0 hours
        poop: Math.floor(Math.random() * 3), // 0 to 2
        numberOfShowers: Math.floor(Math.random() * 2) + 1, // 1 to 2
        no_of_kegels: Math.floor(Math.random() * 10) + 5, // 5 to 14
        mast: Math.random() > 0.5,
        pn: Math.random() > 0.5,
        steps: (Math.floor(Math.random() * 20000) + 10000).toString(), // 10,000 to 30,000
        suntime: Math.floor(Math.random() * 12) + 6, // 6 to 17 hours
        jelqs: Math.floor(Math.random() * 10) + 5, // 5 to 14
        stretch: Math.random() > 0.5,
        pe: Math.random() > 0.5,
        kegels: Math.random() > 0.5,
        coding: Math.floor(Math.random() * 8), // 0 to 7 hours
      });
    }
    return data;
  };

  const carouselData: FormData[] = generateSampleData();

  // State to track the current index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for navigation
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    );
  };

  const currentDayData = carouselData[currentIndex];

  // ------------------- End of Carousel Implementation -------------------

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Life Trackers Dashboard
      </Typography>

      {/* Activity Streaks */}
      <Grid container spacing={3}>
        {trackers.map((tracker, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box sx={{ mr: 2 }}>{tracker.icon}</Box>
              <CardContent>
                <Typography variant="h6">{tracker.activity.name}</Typography>
                <Typography color="text.secondary">
                  Current Streak: {tracker.activity.currentStreak} day
                  {tracker.activity.currentStreak > 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Conditional Water Intake Streak */}
        {trackerData.waterIntake > 3 && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#e0f7fa',
              }}
            >
              <Box sx={{ mr: 2 }}>
                <LocalDrinkIcon fontSize="large" color="primary" />
              </Box>
              <CardContent>
                <Typography variant="h6">Water Intake</Typography>
                <Typography color="text.secondary">
                  {trackerData.waterIntake} L
                </Typography>
                <Typography color="text.secondary">
                  Streak: {trackerData.waterIntake} day
                  {trackerData.waterIntake > 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Conditional Steps Streak */}
        {trackerData.steps > 20000 && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#e8f5e9',
              }}
            >
              <Box sx={{ mr: 2 }}>
                <DirectionsWalkIcon fontSize="large" color="success" />
              </Box>
              <CardContent>
                <Typography variant="h6">Steps</Typography>
                <Typography color="text.secondary">
                  {trackerData.steps} steps
                </Typography>
                <Typography color="text.secondary">
                  Streak: {stepsStreak} day
                  {stepsStreak > 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* ------------------- Carousel Section ------------------- */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Daily Overview
        </Typography>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Prayer */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                Morning Prayer: {currentDayData.prayMorning ? '✔️' : '❌'}
              </Typography>
              <Typography variant="subtitle1">
                Evening Prayer: {currentDayData.prayEvening ? '✔️' : '❌'}
              </Typography>
            </Grid>

            {/* Workout */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                Workout: {currentDayData.workout ? '✔️' : '❌'}
              </Typography>
              {currentDayData.workout && (
                <>
                  <Typography variant="body2">
                    Details: {currentDayData.workoutDetails.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    Time: {currentDayData.workoutTime} minutes
                  </Typography>
                </>
              )}
            </Grid>

            {/* Coding */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                Coding: {currentDayData.coding ? `${currentDayData.coding} hours` : '❌'}
              </Typography>
            </Grid>

            {/* Additional Metrics */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                Sleep Time: {currentDayData.sleepTime} hours
              </Typography>
              <Typography variant="subtitle1">
                Steps: {currentDayData.steps}
              </Typography>
              <Typography variant="subtitle1">
                Water Intake: {trackerData.waterIntake} L
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                Poop: {currentDayData.poop} times
              </Typography>
              <Typography variant="subtitle1">
                Showers: {currentDayData.numberOfShowers}
              </Typography>
              <Typography variant="subtitle1">
                Kegels: {currentDayData.no_of_kegels}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                Sun Time: {currentDayData.suntime} hours
              </Typography>
              <Typography variant="subtitle1">
                Jelqs: {currentDayData.jelqs}
              </Typography>
              <Typography variant="subtitle1">
                Stretch: {currentDayData.stretch ? '✔️' : '❌'}
              </Typography>
            </Grid>

            {/* Additional boolean metrics */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">
                PE: {currentDayData.pe ? '✔️' : '❌'}
              </Typography>
              <Typography variant="subtitle1">
                Kegels: {currentDayData.kegels ? '✔️' : '❌'}
              </Typography>
              <Typography variant="subtitle1">
                Mast: {currentDayData.mast ? '✔️' : '❌'}
              </Typography>
              <Typography variant="subtitle1">
                PN: {currentDayData.pn ? '✔️' : '❌'}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
      {/* ------------------- End of Carousel Section ------------------- */}
    </Container>
  );
};

export default Home;
