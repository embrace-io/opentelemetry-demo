import { SplashScreen, Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { useFonts } from 'expo-font';
import { useEffect, useMemo } from 'react';
import { useTracer } from '@/hooks/useTracer';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const {loaded: tracerLoaded} = useTracer();

  const loaded = useMemo<boolean>(() => fontsLoaded && tracerLoaded, [fontsLoaded, tracerLoaded])
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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
