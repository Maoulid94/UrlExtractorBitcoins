import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
  Button,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  URLList: undefined;
  URLDetail: { item: URLData };
};

interface URLData {
  publicId: string;
  url: string;
  title: string;
  images: string[];
  stylesheetCount: number;
}

const OpenURL = ({ url }: { url: string }) => {
  const handlePress = async () => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Cannot open this Url: ${url}`);
    }
  };
  return <Button title="Open Link" onPress={handlePress} />;
};

export default function URLDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "URLDetail">>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  if (!route.params || !route.params.item) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={40} color="red" />
        <Text style={styles.errorText}>⚠️ No details available</Text>
      </SafeAreaView>
    );
  }
  const { item } = route.params;
  const handleDelete = () => {
    Alert.alert("Are you sure you want to delete this URL?", undefined, [
      { text: "Non", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const response = await fetch(
              `https://url-info-extractor.onrender.com/api/v1/urlinfo/detail/${item.publicId}`,
              {
                method: "DELETE",
              }
            );
            if (!response.ok) {
              throw new Error(
                `The URL info does not exist: ${response.status}`
              );
            }
            console.log("Deleted: ", item.publicId);
            Alert.alert("Success", "The item has been deleted successfully.");
            navigation.goBack();
          } catch (error: any) {
            Alert.alert("Error", `Failed to delete: ${error.message}`);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContent}>
        <View style={[styles.boxContent, { marginTop: 20 }]}>
          <Ionicons name="link-outline" size={40} color="#158BBF" />
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <Text
              numberOfLines={2}
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
          </TouchableOpacity>
        </View>
        <View style={styles.boxContent}>
          <Text style={[styles.text, { fontWeight: 500, fontSize: 18 }]}>
            Title:
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.text,
              { fontWeight: 500, fontSize: 18, width: "80%" },
            ]}
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
                height: 40,
                fontWeight: 500,
                fontSize: 14,
                backgroundColor: "#A1FAFF",
                paddingHorizontal: 5,
                paddingVertical: 5,
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
                height: 40,
                fontWeight: 500,
                fontSize: 14,
                backgroundColor: "#A1FAFF",
                paddingHorizontal: 5,
                paddingVertical: 5,
                borderRadius: 10,
              },
            ]}
          >
            Stylesheets Count: {item.stylesheetCount}
          </Text>
        </View>
        {item.images.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}
          >
            {item.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            ))}
          </ScrollView>
        ) : null}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Image
              source={require("./../assets/images/sup-icon.png")}
              style={{ width: 35, height: 35, tintColor: "#158BBF" }}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#A1FAFF" },
  cardContent: {
    backgroundColor: "#158BBF",
    width: "100%",
    height: 600,
    justifyContent: "flex-start",
    padding: 10,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: { height: 4, width: 4 },
    borderBottomColor: "#ddd",
    borderRadius: 12,
    borderWidth: 1,
  },
  boxContent: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 60,
    marginBottom: 10,
    // justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    backgroundColor: "#A1FAFF",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    alignContent: "center",
    marginBottom: 10,
    color: "black",
  },
  imageContainer: {
    width: 150,
    height: 120,
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#A1FAFF",
    padding: 10,
    marginRight: 15,
  },

  image: {
    width: 200,
    height: 100,
    borderRadius: 10,
    resizeMode: "contain",
  },
  imageScrollView: {
    marginTop: 10,
    flexDirection: "row",
  },
  deleteButton: {
    backgroundColor: "#A1FAFF",
    height: 70,
    width: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    marginBottom: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#A1FAFF",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
  },
});
