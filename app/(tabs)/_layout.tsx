import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-vector-icons/Icon";

interface dataType {
  publicId: string;
  url: string;
  title: string;
}

export default function TabsLayout() {
  const [data, setData] = useState<dataType[]>([]);
  const [filtered, setFiltered] = useState<dataType[]>([]);
  const [error, setError] = useState<null | String>(null);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [url, setURL] = useState("");

  const addURL = async (AddURL: string) => {
    try {
      const response = await fetch(
        "https://url-info-extractor.onrender.com/api/v1/urlinfo/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: AddURL }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        switch (response.status) {
          case 409:
            Alert.alert("Error:", "This URL already exists.");
            break;
          case 422:
            Alert.alert(
              "Error:",
              "The URL is valid, but the server could not be reached."
            );
            break;
          case 400:
            Alert.alert("Error:", "Enter a valid URL.");
            break;
          default:
            Alert.alert(
              "Error:",
              result.message || "An unknown error occurred."
            );
        }
      } else {
        Alert.alert("Success:", "The URL info has been successfully created.");
      }
    } catch (error) {
      Alert.alert("Network error:", (error as Error).message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://url-info-extractor.onrender.com/api/v1/urlinfo"
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        if (Array.isArray(data)) {
          setData(result);
          setFiltered(result);
        } else {
          console.log("Unexpected data format");
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (item_fliter: string) => {
    const fliter_data = data.filter(
      (item) =>
        item.url.toLowerCase().includes(item_fliter.toLowerCase()) ||
        item.title.toLowerCase().includes(item_fliter.toLowerCase())
    );
    setFiltered(fliter_data);
  };

  return (
    <Tabs
      screenOptions={{
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "URL",
          headerTitle: "Applications",
          tabBarActiveBackgroundColor: "#A1FAFF",
          tabBarActiveTintColor: "black",
          headerTitleStyle: {
            textAlign: "center",
            fontSize: 25,
            paddingLeft: 50,
            fontWeight: "bold",
          },
          headerStyle: { backgroundColor: "#158BBF" },
          headerRight: () => (
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginRight: 15,
                }}
              >
                <TouchableOpacity onPress={() => setAddModalVisible(true)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
                  <Ionicons name="search" size={24} color={"black"} />
                </TouchableOpacity>
              </View>
              {/* Search */}
              <Modal
                animationType="slide"
                visible={searchModalVisible}
                onRequestClose={() => {
                  setSearchModalVisible(false);
                }}
              >
                <View style={styles.searchModalContent}>
                  <View style={styles.searchModalTextInputBox}>
                    <Ionicons name="search" size={24} />
                    <TextInput
                      style={styles.searchModalTextInput}
                      placeholder="Search by URL or Title..."
                      value={searchItem}
                      onChangeText={(text) => {
                        setSearchItem(text);
                        handleFilter(text);
                      }}
                    />
                    <Icon name="cancel" size={24} />
                  </View>
                  <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.publicId.toString()}
                    renderItem={({ item }) => (
                      <View style={{ padding: 10 }}>
                        <Text>{item.title}</Text>
                        <Text>{item.url}</Text>
                      </View>
                    )}
                  />
                </View>
              </Modal>
              {/* add */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={addModalVisible}
                onRequestClose={() => setAddModalVisible(false)}
              >
                <View style={styles.addModalContent}>
                  <View style={styles.addModalBox}>
                    <Text style={styles.addModalText}>Add a new URL</Text>
                    <TextInput
                      placeholder="Enter the URL"
                      style={styles.addModalTextInput}
                      value={url}
                      onChangeText={setURL}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        addURL(url);
                        setAddModalVisible(false);
                        setLoading(true);
                        setURL("");
                      }}
                      style={styles.addModalButton}
                    >
                      <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setAddModalVisible(false);
                        setLoading(false);
                      }}
                      style={styles.addModalButton}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          ),
          headerLeft: () => (
            <Image
              source={require("../../assets/images/url-logo.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginLeft: 15,
              }}
            />
          ),
          tabBarIcon: () => (
            <Ionicons name="link-outline" size={24} color="#158BBF" />
          ),
        }}
      />
      <Tabs.Screen
        name="bitcoin"
        options={{
          headerShown: true,
          headerTitle: "Exchange",
          headerStyle: {
            backgroundColor: "#00FFFF",
          },
          headerTitleStyle: {
            color: "#121212",
            marginLeft: 100,
            fontSize: 22,
            fontWeight: "bold",
          },
          tabBarActiveBackgroundColor: "#333333",
          tabBarActiveTintColor: "#00FFFF",
          headerLeft: () => (
            <Image
              source={require("../../assets/images/bitcoin-logo.png")}
              style={styles.bitcoinLogo}
            />
          ),
          tabBarIcon: () => (
            <Ionicons name="logo-bitcoin" size={24} color="#00FFFF" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  addModalBox: {
    width: 300,
    padding: 20,
    backgroundColor: "#A1FAFF",
    borderRadius: 12,
    alignItems: "center",
  },
  addModalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  addModalTextInput: {
    width: "100%",
    borderWidth: 1,
    padding: 8,
    marginBottom: 20,
    borderRadius: 8,
  },
  addModalButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#158BBF",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  submitText: { color: "white", fontWeight: "bold" },
  cancelText: { color: "white", fontWeight: "bold" },
  bitcoinLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  searchModalContent: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // width: "100%",
  },
  searchModalTextInputBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    backgroundColor: "yellow",
  },
  searchModalTextInput: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    color: "white",
    borderWidth: 1,
    backgroundColor: "#158BBF",
    marginVertical: 10,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});
