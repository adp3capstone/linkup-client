import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getAllTickets } from '@/scripts/ticket';
import { getFromStorage } from '@/scripts/db';
import { assignTicketToAdmin } from "@/scripts/admin";

export default function AdminAllTickets() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
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

        const ticketsResponse = await getAllTickets();
        if (ticketsResponse) {
          const filtered = ticketsResponse.filter(
            (t: any) => !t.assignedTo && t.status !== 'RESOLVED' && t.status !== 'IN_PROGRESS'
          );
          setTickets(filtered);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const assignTicketToMe = async (ticketId: number, adminId: number) => {
    try {
      const updatedTicket = await assignTicketToAdmin({ ticketId, adminId });
      alert("Ticket successfully assigned to you!");
      // Refresh tickets
      const refreshedTickets = await getAllTickets();
      setTickets(refreshedTickets.filter((t: any) => !t.assignedTo && t.status !== 'RESOLVED' && t.status !== 'IN_PROGRESS'));
    } catch (error: any) {
      console.error("Error assigning ticket:", error.response?.data || error.message);
      alert("Failed to assign ticket. Please try again.");
    }
  };

  const getStatusColor = (status: string | null) => {
    if (status === 'RESOLVED') return '#2ecc71'; // green
    return '#e67e22'; // orange/pending
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Unassigned Tickets</Text>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.ticketId.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>Ticket #{item.ticketId}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status ?? "Pending"}</Text>
              </View>
            </View>
            <Text style={styles.ticketDesc}>{item.description}</Text>

            <Pressable
              style={styles.button}
              onPress={() => assignTicketToMe(item.ticketId, userId!)}
            >
              <Text style={styles.buttonText}>Assign to Me</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No unassigned tickets found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  ticketDesc: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#9b59b6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontSize: 16,
  },
});
