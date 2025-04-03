import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HealthMetricCard from "../components/HealthMetricCard";
import { getAllHealthData } from "../utils/storage";
import { calculateDailyAverages } from "../utils/dataUtils";

const HomeScreen = ({ navigation }) => {
  const [healthData, setHealthData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [todayData, setTodayData] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from storage
  const loadData = async () => {
    setRefreshing(true);
    const data = await getAllHealthData();
    setHealthData(data);

    // Get today's data (latest entry)
    if (data.length > 0) {
      const sortedData = [...data].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTodayData(sortedData[0]);
    }

    setRefreshing(false);
  };

  // Get average values or latest values
  const getMetricValue = (metric) => {
    if (!todayData) return 0;
    return todayData[metric] || 0;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.subtitle}>Your Health Dashboard</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("DataEntry")}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Today's Data</Text>
      </TouchableOpacity>

      {healthData.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>
            No health data yet. Add your first entry!
          </Text>
        </View>
      ) : (
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Your Health Metrics</Text>

          <HealthMetricCard
            title="Steps"
            value={getMetricValue("steps")}
            unit="steps"
            icon="footsteps-outline"
            color="#4CAF50"
            onPress={() => navigation.navigate("ChartsTab")}
          />

          <HealthMetricCard
            title="Sleep"
            value={getMetricValue("sleepHours")}
            unit="hours"
            icon="moon-outline"
            color="#2196F3"
            onPress={() => navigation.navigate("ChartsTab")}
          />

          <HealthMetricCard
            title="Water"
            value={getMetricValue("waterIntake")}
            unit="glasses"
            icon="water-outline"
            color="#00BCD4"
            onPress={() => navigation.navigate("ChartsTab")}
          />

          <HealthMetricCard
            title="Mood"
            value={getMetricValue("mood")}
            unit="/5"
            icon="happy-outline"
            color="#FF9800"
            onPress={() => navigation.navigate("ChartsTab")}
          />
        </View>
      )}

      <View style={styles.privacyNote}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#888" />
        <Text style={styles.privacyText}>
          Your health data is stored locally on your device for privacy.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: "#6200ee",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03DAC5",
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 32,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  metricsContainer: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
    margin: 16,
    borderRadius: 8,
  },
  privacyText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
});

export default HomeScreen;
