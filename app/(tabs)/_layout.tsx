import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { Button, View, Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "URL",
          headerTitle: "Applications",
          headerTitleStyle: {
            textAlign: "center",
            fontSize: 25,
            paddingLeft: 50,
            fontWeight: "heavy",
          },
          headerStyle: { backgroundColor: "#158BBF" },
          headerSearchBarOptions: {
            placeholder: "Search url",
            autoCapitalize: "none",
          },
          headerRight(props) {
            return (
              <Ionicons
                name="add-circle-outline"
                size={24}
                color="black"
                style={{ marginRight: 15 }}
              />
            );
          },
          headerLeft(props) {
            return (
              <Image
                source={require("../../assets/images/url-logo.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 15,
                }}
              />
            );
          },
          tabBarIcon: () => (
            <Ionicons name="link-outline" size={24} color="#158BBF" />
          ),
        }}
      />
      <Tabs.Screen
        name="bitcoin"
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="logo-bitcoin" size={24} color="#FF6B08" />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  titleStyle: { textAlign: "center", fontSize: 20 },
});
