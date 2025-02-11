import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, View, Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      {/* <Tabs.Screen name="index" options={{ headerShown: false }} /> */}
      <Tabs.Screen
        name="index"
        options={{
          headerSearchBarOptions: {
            placeholder: "Search url",
          },
          headerLeft(props) {
            return (
              <View>
                <Image
                  source={require("./../assets/images/url-logo.png")}
                  style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen name="bitcoin" options={{ headerShown: false }} />
    </Tabs>
  );
}
