import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  primaryColor: 'accent',
  colors: {
    // Include default Mantine colors
    dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
    gray: ['#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40', '#212529'],
    red: ['#fff5f5', '#ffe3e3', '#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252', '#f03e3e', '#e03131', '#c92a2a'],
    pink: ['#fff0f6', '#ffdeeb', '#fcc2d7', '#faa2c1', '#f783ac', '#f06595', '#e64980', '#d6336c', '#c2255c', '#a61e4d'],
    // ... add other default colors as needed

    // Our custom colors
    accent: ['#F0F8FF', '#CCE8FF', '#99D1FF', '#66BAFF', '#33A3FF', '#008CFF', '#0070CC', '#005299', '#003366', '#001933'],
    secondary: ['#F0FFFA', '#CCFFF1', '#99FFE8', '#66FFDF', '#33FFD6', '#00FFCC', '#00CCA3', '#00997A', '#006652', '#003329'],
  },
  white: '#FFFFFF',
  components: {
    // Add component-specific styles here
  },
};