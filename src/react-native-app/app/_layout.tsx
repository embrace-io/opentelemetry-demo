// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
// Modified by Embrace 2025
import {
  SplashScreen,
  Stack,
  useNavigationContainerRef as useExpoNavigationContainerRef,
} from "expo-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from "react-native";
import {RootSiblingParent} from "react-native-root-siblings";
import Toast from "react-native-toast-message";
import {useFonts} from "expo-font";
import {useEffect, useMemo} from "react";
import CartProvider from "@/providers/Cart.provider";
import {useEmbrace} from "@embrace-io/react-native";
import {useEmbraceNativeTracerProvider} from "@embrace-io/react-native-tracer-provider";
import {EmbraceNavigationTracker} from "@embrace-io/react-native-navigation";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const {isStarted: embraceStarted} = useEmbrace({
    ios: {
      appId: "EMBRACE_IOS_APP_ID",
    },
  });
  const {tracerProvider} = useEmbraceNativeTracerProvider({}, embraceStarted);
  const expoNavigationRef = useExpoNavigationContainerRef();

  const loaded = useMemo<boolean>(
    () => fontsLoaded && embraceStarted && !!tracerProvider,
    [fontsLoaded, embraceStarted, tracerProvider],
  );

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !tracerProvider) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootSiblingParent>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <EmbraceNavigationTracker
              ref={expoNavigationRef}
              tracerProvider={tracerProvider}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}} />
              </Stack>
            </EmbraceNavigationTracker>
          </CartProvider>
        </QueryClientProvider>
      </RootSiblingParent>
      <Toast />
    </ThemeProvider>
  );
}
