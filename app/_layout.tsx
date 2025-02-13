import { Text, View } from "react-native";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="URLInfoDetail"
        options={{
          headerTitle: "Detail",
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: "bold",
            color: "white",
          },
          headerStyle: {
            backgroundColor: "#158BBF",
          },
        }}
      />
    </Stack>
  );
}
