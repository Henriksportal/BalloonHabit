import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { View, Text} from 'react-native'

interface CountdownCheckProps {
  type: 'Daily' | 'Weekly' | 'Monthly';
}

const CountdownCheck: React.FC<CountdownCheckProps> = ({ type }) => {
  const [dayCountdown, setDayCountdown] = useState(0);
  const [weekCountdown, setWeekCountdown] = useState(0);
  const [monthCountdown, setMonthCountdown] = useState(0);
 
  useEffect(() => {
    const calculateCountdowns = async () => {
      // Calculate the time until the next day (00:00)
      const now = moment();
      const nextDay = moment().startOf('day').add(1, 'day');
      const dayDiff = nextDay.diff(now, 'milliseconds');
      setDayCountdown(dayDiff);

      // Calculate the time until the next Sunday
      const nextSunday = moment().endOf('isoWeek');
      const weekDiff = nextSunday.diff(now, 'milliseconds');
      setWeekCountdown(weekDiff);

      // Calculate the time until the next month
      const nextMonth = moment().endOf('month').add(1, 'month');
      const monthDiff = nextMonth.diff(now, 'milliseconds');
      setMonthCountdown(monthDiff);

      // Save the countdowns to AsyncStorage
      await AsyncStorage.setItem('dayCountdown', dayDiff.toString());
      await AsyncStorage.setItem('weekCountdown', weekDiff.toString());
      await AsyncStorage.setItem('monthCountdown', monthDiff.toString());
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
      const storedMonthCountdown = await AsyncStorage.getItem('monthCountdown');

      if (storedDayCountdown) {
        setDayCountdown(parseInt(storedDayCountdown));
      }
      if (storedWeekCountdown) {
        setWeekCountdown(parseInt(storedWeekCountdown));
      }
      if (storedMonthCountdown) {
        setMonthCountdown(parseInt(storedMonthCountdown));
      }
    };

    loadCountdowns();
  }, []);

  // Format time for daily countdown (includes minutes)
  const formatDailyTime = (milliseconds: number): string => {
    const duration = moment.duration(milliseconds);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let timeString = '';
    
    if (days > 0) {
      timeString += `${days} days `;
    }
    if (hours > 0 || days > 0) {
      timeString += `${hours} hours `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      timeString += `${minutes} minutes`;
    }

    return timeString.trim() || '0 minutes';
  };

  // Format time for weekly/monthly countdown (excludes minutes)
  const formatExtendedTime = (milliseconds: number, isWeekly: boolean = false): string => {
    const duration = moment.duration(milliseconds);
    let days = duration.days();
    let hours = duration.hours();

    // For weekly countdown, ensure days don't exceed 6 (0-6 for week days)
    if (isWeekly) {
      const totalHours = Math.floor(milliseconds / (1000 * 60 * 60));
      days = Math.floor(totalHours / 24) % 7;
      hours = totalHours % 24;
    }

    let timeString = '';
    
    if (days > 0) {
      timeString += `${days} days `;
    }
    if (hours > 0 || days > 0) {
      timeString += `${hours} hours`;
    }

    return timeString.trim() || '0 hours';
  };

  return (
    <View>
      {type === 'Daily' ? (
        <Text className='font-textFontBase text-daily opacity-80'>{formatDailyTime(dayCountdown)}</Text>
      ) : type === 'Weekly' ? (
        <Text className='font-textFontBase text-weekly opacity-80'>{formatExtendedTime(weekCountdown, true)}</Text>
      ) : (
        <Text className='font-textFontBase text-monthly opacity-80'>{formatExtendedTime(monthCountdown)}</Text>
      )}
    </View>
  );
};

export default CountdownCheck;
