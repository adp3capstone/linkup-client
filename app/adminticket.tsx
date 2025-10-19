import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Dimensions, Text, View, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import { getTicket, TicketDTO } from '@/scripts/ticket';
import { resolveTicket } from '@/scripts/admin';

const { width } = Dimensions.get("window");

export default function AdminTicket() {
  const { ticketId } = useLocalSearchParams();
  const [ticket, setTicket] = useState<TicketDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : null;
        setUserId(id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTicket = async () => {
      if (!ticketId) return;
      try {
        const data = await getTicket(Number(ticketId));
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchTicket();
  }, [ticketId]);

  const handleResolveTicket = async (ticketId: number) => {
    if (!userId) return alert("Admin ID not found.");
    try {
      const updatedTicket = await resolveTicket({
        ticketId,
        adminId: userId,
      });
      setTicket(updatedTicket);
      alert("Ticket resolved successfully.");
    } catch (error) {
      console.error("Error resolving ticket:", error);
      alert("Failed to resolve ticket. Please try again.");
    }
  };

  if (loading) return (
    <View style={styles.container}>
      <Text>Loading ticket details...</Text>
    </View>
  );

  if (!ticket) return (
    <View style={styles.container}>
      <Text>Ticket not found.</Text>
    </View>
  );

  const statusColor = ticket.status === "RESOLVED" ? "#2ecc71" : "#e67e22";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ticket #{ticket.ticketId}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{ticket.userId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Issue Type:</Text>
          <Text style={styles.value}>{ticket.issueType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{ticket.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>{ticket.status ?? "Pending"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>{ticket.createdAt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Updated At:</Text>
          <Text style={styles.value}>{ticket.updatedAt}</Text>
        </View>
        {ticket.resolvedAt && (
          <View style={styles.row}>
            <Text style={styles.label}>Resolved At:</Text>
            <Text style={styles.value}>{ticket.resolvedAt}</Text>
          </View>
        )}
        {ticket.resolvedBy && (
          <View style={styles.row}>
            <Text style={styles.label}>Resolved By:</Text>
            <Text style={styles.value}>{ticket.resolvedBy}</Text>
          </View>
        )}
        {ticket.assignedTo && (
          <View style={styles.row}>
            <Text style={styles.label}>Assigned To:</Text>
            <Text style={styles.value}>{ticket.assignedTo}</Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
        {ticket.status !== "RESOLVED" && (
          <Pressable style={[styles.button, { backgroundColor: "#2ecc71" }]} onPress={() => handleResolveTicket(ticket.ticketId)}>
            <Text style={styles.buttonText}>Resolve Ticket</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "600",
    marginRight: 5,
  },
  value: {
    flex: 1,
    flexWrap: "wrap",
  },
  statusBadge: {
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#9b59b6",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
