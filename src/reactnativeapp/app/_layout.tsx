import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootSiblingParent>
        <QueryClientProvider client={queryClient}>
          <Stack>
              <Stack.Screen name="index" />
          </Stack>
        </QueryClientProvider>
      </RootSiblingParent>
    </ThemeProvider>
  );
}
