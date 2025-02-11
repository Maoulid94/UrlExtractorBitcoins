import { useEffect, useState } from "react";
import { Text, View, Image, Pressable, Alert } from "react-native";
import { StyleSheet } from "react-native";

export default function Url() {
  // const [url, setUrl] = useState(null);
  // const getAPIdata = async () => {
  //   const url =
  //     "https://url-info-extractor.onrender.com/api/v1/urlinfo/detail/d925afe0-140a-4719-adee-13f365f63970";
  //   let result = await fetch(url);
  //   result = await result.json();
  //   setUrl(result)
  //   useEffect(() => {
  //     getAPIdata();
  //   }, []);
  // };
  return (
    <View>
      <View style={styles.navBar}>
        <Image
          source={require("./../assets/images/url-logo.png")}
          style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
        />
        <Text style={styles.navtitle}>Application</Text>
        <Pressable onPress={() => Alert.alert("Seach Button")}>
          <Image
            source={require("./../assets/images/search.png")}
            style={{ width: 25, height: 25, tintColor: "white" }}
          />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  navBar: {
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "blue",
  },
  navtitle: { fontSize: 25, color: "white", fontWeight: "500" },
});
