import { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface URLData {
  publicId: string;
  url: string;
  title: string;
  images: string[];
  stylesheetCount: number;
}
type RootStackParamList = {
  URLInfoList: undefined;
  URLInfoDetail: { item: URLData };
};

export default function URLInfoList() {
  const [urlInfo, setUrlInfo] = useState<URLData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefershing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "URLInfoDetail">>();
  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const response = await fetch(
        "https://url-info-extractor.onrender.com/api/v1/urlinfo"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setUrlInfo(data);
      } else {
        console.log("Unexpected data format");
        setUrlInfo([]);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    onRefresh();
    fetchData();
  }, []);
  // Refershing
  const onRefresh = async () => {
    setRefershing(true);
    await fetchData();
    setRefershing(false);
  };

  if (loading) {
    return <ActivityIndicator size={"large"} color={"#0000ff"} />;
  }
  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }
  if (urlInfo.length === 0) {
    return <Text style={styles.emptyData}>No data available</Text>;
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={urlInfo}
        keyExtractor={(item) => item.publicId}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => {
              navigation.navigate("URLInfoDetail", { item });
            }}
          >
            <View style={{ marginTop: 12 }}>
              <View style={styles.boxContent}>
                <Text style={styles.text}>URL:</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.text,
                    {
                      width: "80%",
                      textDecorationLine: "underline",
                      color: "blue",
                    },
                  ]}
                >
                  {item.url}
                </Text>
              </View>
              <View style={styles.boxContent}>
                <Text style={[styles.text, { fontSize: 18 }]}>Title:</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.text, { fontSize: 18, width: "80%" }]}
                >
                  {item.title}
                </Text>
              </View>
              <View
                style={[
                  styles.boxContent,
                  { backgroundColor: "transparent", padding: 0 },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: 500,
                      fontSize: 14,
                      backgroundColor: "#A1FAFF",
                      padding: 5,
                      borderRadius: 10,
                    },
                  ]}
                >
                  Number of Images: {item.images.length}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: 500,
                      fontSize: 14,
                      backgroundColor: "#A1FAFF",
                      padding: 5,
                      borderRadius: 10,
                    },
                  ]}
                >
                  Number of Styles: {item.stylesheetCount}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      ></FlatList>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#A1FAFF",
  },
  listContent: { padding: 8 },
  item: {
    backgroundColor: "#158BBF",
    width: "100%",
    height: 200,
    padding: 10,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: { height: 4, width: 4 },
    borderBottomColor: "#ddd",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  boxContent: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    justifyContent: "space-between",
    backgroundColor: "#A1FAFF",
    // padding: 6,
    borderRadius: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 10,
    color: "black",
    padding: 4,
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyData: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
});
