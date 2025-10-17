import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { getTicketsByAdminId, TicketDTO } from "@/scripts/ticket";
import { getFromStorage } from "@/scripts/db";
import { useRouter } from "expo-router";

export default function TabOneScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [assignedTickets, setAssignedTickets] = useState<TicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getFromStorage("user");
        if (!user) return;

        setUserData(user);
        const id = user.userId;
        setUserId(id);

        if (id) await fetchMyTickets(id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMyTickets = async (adminId: number) => {
      try {
        const tickets = await getTicketsByAdminId(adminId);
        setAssignedTickets(tickets);
      } catch (error) {
        alert("Failed to fetch tickets. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  const goToTicket = (ticketId: number) => {
    router.push({
      pathname: "/adminticket",
      params: { ticketId: ticketId.toString() },
    });
  };

  const renderTicket = ({ item }: { item: TicketDTO }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>#{item.ticketId}</Text>
        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "Resolved"
                  ? "#2ecc71"
                  : item.status === "Pending"
                  ? "#f39c12"
                  : "#3498db",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.ticketDescription}>{item.description}</Text>

      <Pressable style={styles.goButton} onPress={() => goToTicket(item.ticketId)}>
        <Text style={styles.goButtonText}>View Details</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Assigned Tickets</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#9b59b6" style={{ marginTop: 40 }} />
      ) : assignedTickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tickets assigned yet.</Text>
        </View>
      ) : (
        <FlatList
          data={assignedTickets}
          keyExtractor={(item) => item.ticketId.toString()}
          renderItem={renderTicket}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9ff",
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 25,
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#9b59b6",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
  ticketDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 15,
    lineHeight: 22,
  },
  goButton: {
    backgroundColor: "#9b59b6",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  goButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textTransform: "uppercase",
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});
