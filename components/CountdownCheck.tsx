import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { View, Text} from 'react-native'

const CountdownCheck = () => {
  const [dayCountdown, setDayCountdown] = useState(0);
  const [weekCountdown, setWeekCountdown] = useState(0);

  useEffect(() => {
    const calculateCountdowns = async () => {
      // Calculate the time until the next day (00:00)
      const now = moment();
      const nextDay = moment().startOf('day').add(1, 'day');
      const dayDiff = nextDay.diff(now, 'milliseconds');
      setDayCountdown(dayDiff);

      // Calculate the time until the next Sunday
      const nextSunday = moment().endOf('week').add(1, 'week');
      const weekDiff = nextSunday.diff(now, 'milliseconds');
      setWeekCountdown(weekDiff);

      // Save the countdowns to AsyncStorage
      await AsyncStorage.setItem('dayCountdown', dayDiff.toString());
      await AsyncStorage.setItem('weekCountdown', weekDiff.toString());
    };

    calculateCountdowns();

    // Update the countdowns every second
    const intervalId = setInterval(calculateCountdowns, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Load the saved countdowns from AsyncStorage on component mount
  useEffect(() => {
    const loadCountdowns = async () => {
      const storedDayCountdown = await AsyncStorage.getItem('dayCountdown');
      const storedWeekCountdown = await AsyncStorage.getItem('weekCountdown');

      if (storedDayCountdown) {
        setDayCountdown(parseInt(storedDayCountdown));
      }
      if (storedWeekCountdown) {
        setWeekCountdown(parseInt(storedWeekCountdown));
      }
    };

    loadCountdowns();
  }, []);

  // Convert milliseconds to days, hours, minutes, and seconds
  const formatTime = (milliseconds) => {
    const days = moment.duration(milliseconds).days();
    const hours = moment.duration(milliseconds).hours();
    const minutes = moment.duration(milliseconds).minutes();
    const seconds = moment.duration(milliseconds).seconds();

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  };

  return (
    <View>
      <Text>Day Countdown: {formatTime(dayCountdown)}</Text>
      <Text>Week Countdown: {formatTime(weekCountdown)}</Text>
    </View>
  );
};

export default CountdownCheck;