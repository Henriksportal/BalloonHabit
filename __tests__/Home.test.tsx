import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GlobalContext } from '../../context/GlobalProvider';
import Home from '../../app/(tabs)/home';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getAllKeys: jest.fn(),
  getItem: jest.fn(),
}));

// Mock SVG components
jest.mock('../../assets/svg/HeaderBalloonSvg', () => 'HeaderBalloonSvg');
jest.mock('../../assets/svg/doggo', () => 'DoggoSvg');
jest.mock('../../assets/svg/dogBalloon', () => 'DogBalloonSvg');
jest.mock('../../assets/svg/BalloonString', () => 'BalloonString');
jest.mock('../../assets/MemoizedImage', () => ({
  MemoizedBackgroundImage: 'MemoizedBackgroundImage',
}));

describe('Home Component', () => {
  const mockContextValue = {
    goal: 'Test Goal',
    data: [],
    balloonArray: {
      'Test Goal': ['completion1', 'completion2'],
    },
    checkPop: jest.fn(),
    refetch: jest.fn(),
  };

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <Home />
      </GlobalContext.Provider>
    );
  };

  it('renders the home title', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Home')).toBeTruthy();
  });

  it('displays current goal', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Test Goal')).toBeTruthy();
  });

  it('displays correct number of habit completions', () => {
    const { getByText } = renderWithContext();
    expect(getByText('2')).toBeTruthy(); // Based on mockContextValue balloonArray length
    expect(getByText('Habit Completions')).toBeTruthy();
  });

  it('shows balloon elements when there are completions', () => {
    const { getByTestId } = renderWithContext();
    expect(getByTestId('balloon-string')).toBeTruthy();
    expect(getByTestId('dog-balloon')).toBeTruthy();
  });

  it('hides balloon elements when there are no completions', () => {
    const emptyContextValue = {
      ...mockContextValue,
      balloonArray: {
        'Test Goal': [],
      },
    };
    const { queryByTestId } = renderWithContext(emptyContextValue);
    expect(queryByTestId('balloon-string')).toBeNull();
    expect(queryByTestId('dog-balloon')).toBeNull();
  });

  it('calculates correct balloon size based on completions', () => {
    const { getByTestId } = renderWithContext();
    const dogBalloon = getByTestId('dog-balloon');
    
    // Test with 2 completions (from mock data)
    // Calculation: baseSize + (balloonArray[goal].length * growthFactor)
    // Based on the component's calculateBalloonSize function
    const expectedSize = Math.min(Math.max(0 + (2 * 2), 40), 380);
    
    expect(dogBalloon.props.width).toBe(expectedSize);
    expect(dogBalloon.props.height).toBe(expectedSize);
  });

  it('navigates to goals screen when header balloon is pressed', () => {
    const { getByText } = renderWithContext();
    const goalsButton = getByText('Goals');
    fireEvent.press(goalsButton);
    expect(require('expo-router').router.push).toHaveBeenCalledWith({
      pathname: '/',
    });
  });
});
