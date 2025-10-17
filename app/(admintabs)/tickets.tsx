import { Alert, FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getAllTickets } from '@/scripts/ticket';
import { getFromStorage } from '@/scripts/db';
import { assignTicketToAdmin } from "@/scripts/admin";

export default function AdminAllTickets() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getFromStorage('user');
        if (!user) {
          router.replace('/adminlogin');
          return;
        }
        setUserData(user);
        const id = user.userId;
        setUserId(id);

        await loadTickets();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadTickets = async () => {
      try {
        const ticketsResponse = await getAllTickets();
        if (ticketsResponse) {
          const filtered = ticketsResponse.filter(
            (t: any) => !t.assignedTo && t.status !== 'RESOLVED' && t.status !== 'IN_PROGRESS'
          );
          setTickets(filtered);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchUserData();
  }, []);

  const assignTicketToMe = async (ticketId: number, adminId: number) => {
    try {
      await assignTicketToAdmin({ ticketId, adminId });
      Alert.alert("✅ Ticket Assigned", "Ticket successfully assigned to you!");
      const refreshedTickets = await getAllTickets();
      setTickets(
        refreshedTickets.filter(
          (t: any) => !t.assignedTo && t.status !== 'RESOLVED' && t.status !== 'IN_PROGRESS'
        )
      );
    } catch (error: any) {
      console.error("Error assigning ticket:", error.response?.data || error.message);
      Alert.alert("Assignment Failed", "Please try again.");
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'RESOLVED':
        return '#2ecc71';
      case 'IN_PROGRESS':
        return '#3498db';
      default:
        return '#e67e22';
    }
  };

  const renderTicket = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>#{item.ticketId}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status ?? "Pending"}</Text>
        </View>
      </View>

      <Text style={styles.ticketDesc}>{item.description}</Text>

      <Pressable
        style={styles.assignButton}
        onPress={() => assignTicketToMe(item.ticketId, userId!)}
      >
        <Text style={styles.assignText}>Assign to Me</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Unassigned Tickets</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#9b59b6" style={{ marginTop: 50 }} />
      ) : tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🎉 All tickets are assigned!</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.ticketId.toString()}
          renderItem={renderTicket}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

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
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
  ticketDesc: {
    fontSize: 15,
    color: "#555",
    marginBottom: 15,
    lineHeight: 22,
  },
  assignButton: {
    backgroundColor: "#9b59b6",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  assignText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textTransform: "uppercase",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});
