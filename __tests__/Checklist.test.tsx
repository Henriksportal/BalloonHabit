import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { GlobalContext } from '../../context/GlobalProvider';
import Checklist from '../../app/(tabs)/checklist';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mock SVG components
jest.mock('../../assets/svg/HeaderBalloonSvg', () => 'HeaderBalloonSvg');
jest.mock('../../assets/MemoizedImage', () => ({
  MemoizedBackgroundImage: 'MemoizedBackgroundImage',
}));

describe('Checklist Component', () => {
  const mockHabits = [
    {
      id: '1',
      type: 'Daily',
      status: false,
      completed: 0,
      description: 'Daily Habit',
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      goal: 'Test Goal',
      popped: 0,
      lastCompletedDate: subDays(new Date(), 1).toISOString(),
    },
    {
      id: '2',
      type: 'Weekly',
      status: false,
      completed: 0,
      description: 'Weekly Habit',
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      goal: 'Test Goal',
      popped: 0,
      lastCompletedDate: subWeeks(new Date(), 1).toISOString(),
    },
    {
      id: '3',
      type: 'Monthly',
      status: false,
      completed: 0,
      description: 'Monthly Habit',
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      goal: 'Test Goal',
      popped: 0,
      lastCompletedDate: subMonths(new Date(), 1).toISOString(),
    },
  ];

  const mockContextValue = {
    goal: 'Test Goal',
    data: mockHabits,
    setData: jest.fn(),
    refetchBalloon: jest.fn(),
    refetch: jest.fn(),
  };

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <Checklist />
      </GlobalContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the checklist title', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Checklist')).toBeTruthy();
  });

  it('displays current goal', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Test Goal')).toBeTruthy();
  });

  it('shows habit type filters', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Daily')).toBeTruthy();
    expect(getByText('Weekly')).toBeTruthy();
    expect(getByText('Monthly')).toBeTruthy();
  });

  it('filters habits by type when pressing type buttons', () => {
    const { getByText, queryByText } = renderWithContext();
    
    // Initially shows Daily habits
    expect(queryByText('Daily Habit')).toBeTruthy();
    expect(queryByText('Weekly Habit')).toBeFalsy();
    
    // Switch to Weekly
    fireEvent.press(getByText('Weekly'));
    expect(queryByText('Daily Habit')).toBeFalsy();
    expect(queryByText('Weekly Habit')).toBeTruthy();
  });

  it('toggles edit mode', () => {
    const { getByText, queryByText } = renderWithContext();
    
    // Initially in view mode
    expect(getByText('Edit')).toBeTruthy();
    
    // Switch to edit mode
    fireEvent.press(getByText('Edit'));
    expect(getByText('Done')).toBeTruthy();
  });

  it('completes habit on double tap', async () => {
    const { getByText } = renderWithContext();
    
    const habit = getByText('Daily Habit');
    
    // Simulate double tap
    await act(async () => {
      fireEvent.press(habit);
      fireEvent.press(habit);
    });

    expect(mockContextValue.setData).toHaveBeenCalled();
  });

  it('deletes habit in edit mode', async () => {
    const { getByText, getByTestId } = renderWithContext();
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Delete habit
    const deleteButton = getByTestId('delete-habit-1');
    fireEvent.press(deleteButton);
    
    expect(mockContextValue.setData).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.not.objectContaining({ id: '1' })
      ])
    );
  });

  it('validates time-based completion rules', () => {
    const { queryByText } = renderWithContext();
    
    // Daily habit from yesterday should be shown (not completed today)
    expect(queryByText('Daily Habit')).toBeTruthy();
    
    // Update the last completed date to today
    const updatedHabits = mockHabits.map(habit => 
      habit.id === '1' 
        ? { ...habit, lastCompletedDate: new Date().toISOString() }
        : habit
    );
    
    // Re-render with updated habits
    const { queryByText: queryUpdated } = renderWithContext({
      ...mockContextValue,
      data: updatedHabits,
    });
    
    // Daily habit completed today should not be shown
    expect(queryUpdated('Daily Habit')).toBeFalsy();
  });
});
