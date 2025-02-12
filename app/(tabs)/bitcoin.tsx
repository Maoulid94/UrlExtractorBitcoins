import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";

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
        <Text style={styles.text}>
          💰 Bitcoin to EUR: €{bitcoin.bitcoin_eur.toFixed(2)}
        </Text>
        <Text style={styles.text}>
          🔄 EUR to GBP Rate: {bitcoin.eur_to_gbp.toFixed(4)}
        </Text>
        <Text style={styles.text}>
          💷 Bitcoin to GBP: £{bitcoin.bitcoin_gbp.toFixed(2)}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDEA0",
  },
  card: {
    backgroundColor: "#FF6B08",
    padding: 15,
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
    color: "white",
    fontWeight: "500",
    marginBottom: 5,
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
