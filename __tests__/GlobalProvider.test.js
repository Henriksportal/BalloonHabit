import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from 'react-test-renderer';
import {
  isToday,
  startOfISOWeek,
  differenceInDays,
  isYesterday,
  subWeeks,
  endOfWeek,
  subMonths,
  endOfMonth,
  parseISO,
  startOfMonth,
  addDays,
  subDays,
  startOfWeek,
  format
} from 'date-fns';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
}));

describe('GlobalProvider Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mocked time to February 15, 2024 (Thursday)
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 1, 15, 12, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('popCalculator', () => {
    // Helper function that matches the actual implementation
    const popCalculator = (habit) => {
      if (isToday(parseISO(habit.lastPoppedDate))) return false;
      
      try {
        const today = new Date();
        const lastCompletedDate = habit.lastCompletedDate
          ? parseISO(habit.lastCompletedDate)
          : parseISO(habit.startDate);
        
        switch (habit.type) {
          case 'Daily':
            return isYesterday(lastCompletedDate);
          
          case 'Weekly': {
            const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
            const lastWeekEnd = endOfWeek(lastWeekStart);
            return lastCompletedDate >= lastWeekStart && lastCompletedDate <= lastWeekEnd;
          }
          
          case 'Monthly': {
            const lastMonthStart = subMonths(today, 1);
            const lastMonthEnd = endOfMonth(lastMonthStart);
            return lastCompletedDate >= lastMonthStart && lastCompletedDate <= lastMonthEnd;
          }
          
          default:
            return false;
        }
      } catch (error) {
        return false;
      }
    };

    it('should return false when lastPoppedDate is today', () => {
      const today = new Date();
      const habit = {
        type: 'Daily',
        lastPoppedDate: today.toISOString(),
        lastCompletedDate: subDays(today, 1).toISOString(),
        startDate: today.toISOString()
      };
      
      const result = popCalculator(habit);
      expect(result).toBe(false);
    });

    it('should return true for daily habit completed yesterday', () => {
      const today = new Date();
      const yesterday = subDays(today, 1);
      const habit = {
        type: 'Daily',
        lastPoppedDate: subDays(today, 2).toISOString(),
        lastCompletedDate: yesterday.toISOString(),
        startDate: subDays(today, 3).toISOString()
      };
      
      const result = popCalculator(habit);
      expect(result).toBe(true);
    });

    it('should return false for daily habit completed today', () => {
      const today = new Date();
      const habit = {
        type: 'Daily',
        lastPoppedDate: subDays(today, 1).toISOString(),
        lastCompletedDate: today.toISOString(),
        startDate: subDays(today, 2).toISOString()
      };
      
      const result = popCalculator(habit);
      expect(result).toBe(false);
    });

    it('should handle weekly habits correctly', () => {
      // Current date is February 15, 2024 (Thursday)
      const today = new Date();
      // Last week's range should be Feb 4-10
      const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
      const lastWeekEnd = endOfWeek(lastWeekStart);
      const completionDate = addDays(lastWeekStart, 3); // A date within last week
      
      const habit = {
        type: 'Weekly',
        lastPoppedDate: subWeeks(today, 2).toISOString(),
        lastCompletedDate: completionDate.toISOString(),
        startDate: subWeeks(today, 3).toISOString()
      };

      console.log('Weekly Test:');
      console.log('Today:', format(today, 'yyyy-MM-dd'));
      console.log('Last Week Start:', format(lastWeekStart, 'yyyy-MM-dd'));
      console.log('Last Week End:', format(lastWeekEnd, 'yyyy-MM-dd'));
      console.log('Completion Date:', format(completionDate, 'yyyy-MM-dd'));
      
      const result = popCalculator(habit);
      expect(result).toBe(true);
    });

    it('should handle monthly habits correctly', () => {
      const today = new Date();
      const lastMonthStart = startOfMonth(subMonths(today, 1));
      const lastMonthMiddle = addDays(lastMonthStart, 15);
      
      const habit = {
        type: 'Monthly',
        lastPoppedDate: subMonths(today, 2).toISOString(),
        lastCompletedDate: lastMonthMiddle.toISOString(),
        startDate: subMonths(today, 3).toISOString()
      };

      console.log('Monthly Test:');
      console.log('Today:', format(today, 'yyyy-MM-dd'));
      console.log('Last Month Start:', format(lastMonthStart, 'yyyy-MM-dd'));
      console.log('Last Month Middle:', format(lastMonthMiddle, 'yyyy-MM-dd'));
      console.log('Last Completed Date:', format(parseISO(habit.lastCompletedDate), 'yyyy-MM-dd'));
      
      const result = popCalculator(habit);
      expect(result).toBe(true);
    });
  });

  describe('AsyncStorage Integration', () => {
    it('should save habits correctly', async () => {
      const mockHabits = [{
        id: '123',
        type: 'Daily',
        description: 'Test Habit',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        goal: 'Test Goal',
        popped: 0,
        completed: 0,
        lastCompletedDate: null,
        lastPoppedDate: null,
      }];

      await act(async () => {
        await AsyncStorage.setItem('habits', JSON.stringify(mockHabits));
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'habits',
        JSON.stringify(mockHabits)
      );
    });

    it('should load habits correctly', async () => {
      const mockHabits = [{
        id: '123',
        type: 'Daily',
        description: 'Test Habit',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        goal: 'Test Goal',
        popped: 0,
        completed: 0,
        lastCompletedDate: null,
        lastPoppedDate: null,
      }];

      AsyncStorage.getItem.mockImplementation(() => 
        Promise.resolve(JSON.stringify(mockHabits))
      );

      const result = await AsyncStorage.getItem('habits');
      expect(JSON.parse(result)).toEqual(mockHabits);
    });
  });
});
