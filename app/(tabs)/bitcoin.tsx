import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface BitcoinData {
  bitcoin_eur: number;
  eur_to_gbp: number;
  bitcoin_gbp: number;
}

export default function BitcoinUrl() {
  const [bitcoin, setBitcoin] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        console.log("Fetching Bitcoin data...");
        const response = await fetch(
          "https://url-info-extractor.onrender.com/api/v1/crypto/bitcoin"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && typeof data === "object" && "bitcoin_eur" in data) {
          setBitcoin(data);
        } else {
          console.error("Unexpected data format:", data);
          setBitcoin(null);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (!bitcoin) {
    return <Text style={styles.noData}>No data available</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.exchangeBox}>
          <View style={styles.exchangeText}>
            <Text style={styles.text}>Bitcoin</Text>
            <Image
              source={require("../../assets/images/arrows-exchange.png")}
            />
            <Text style={styles.text}>EUR</Text>
          </View>
          <View style={styles.exchangeText}>
            <Text style={styles.text}>Amount:</Text>
            <Text style={styles.text}>{bitcoin.bitcoin_eur.toFixed(2)}</Text>
            <Ionicons name="logo-bitcoin" size={22} color="#FF6B08" />
          </View>
        </View>
        <View style={styles.exchangeBox}>
          <View style={styles.exchangeText}>
            <Text style={styles.text}>EUR</Text>
            <Image
              source={require("../../assets/images/arrows-exchange.png")}
            />
            <Text style={styles.text}>GBP</Text>
          </View>
          <View style={styles.exchangeText}>
            <Text style={styles.text}>Exchange Rate:</Text>
            <Text style={styles.text}>{bitcoin.eur_to_gbp.toFixed(2)}</Text>
            <Ionicons name="logo-euro" size={18} color="#FF6B08" />
          </View>
        </View>
        <View style={styles.exchangeBox}>
          <View style={styles.exchangeText}>
            <Text style={styles.text}>Bitcoin</Text>
            <Image
              source={require("../../assets/images/arrows-exchange.png")}
            />
            <Text style={styles.text}>GBP</Text>
          </View>
          <View style={styles.exchangeText}>
            <Text style={styles.text}>Amount:</Text>
            <Text style={styles.text}>{bitcoin.bitcoin_gbp.toFixed(2)}</Text>
            <Icon name="currency-gbp" size={22} color="#FF6B08" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 255, 0.22)",
  },
  card: {
    backgroundColor: "rgba(0, 255, 255, 0.51)",
    padding: 15,
    width: "80%",
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: "darkblue",
    shadowOffset: { height: 4, width: 4 },
    elevation: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#121212",
    fontWeight: "bold",
    marginBottom: 5,
  },
  exchangeBox: {
    width: "100%",
    // backgroundColor: "rgba(5, 93, 93, 0.97)",
    padding: 10,
    marginBottom: 40,
  },
  exchangeText: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 12,
    backgroundColor: "rgba(0, 255, 255, 0.51)",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noData: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
});
