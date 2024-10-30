import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock the status bar
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => 'StatusBar');

// Required for React Native
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(dict => dict.ios),
}));

// Required for React Native Testing Library
jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => 'TouchableOpacity');
jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => 'TextInput');
jest.mock('react-native/Libraries/Text/Text', () => 'Text');
jest.mock('react-native/Libraries/Components/View/View', () => 'View');

global.window = {};
global.window = global;
