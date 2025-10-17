import { StyleSheet, Dimensions, Text, View, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from "react";
import { getTicketsByAdminId, TicketDTO } from '@/scripts/ticket';
import { getFromStorage } from '@/scripts/db';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [assignedTickets, setAssignedTickets] = useState<TicketDTO[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getFromStorage('user');
        if (!user) return;

        setUserData(user);

        const rawData: any = user;
        const id = rawData.userId;

        setUserId(id);

        if (id) {
          fetchMyTickets(id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
    console.log("Go to ticket:", ticketId);
    router.push({
    pathname: "/adminticket",
    params: { ticketId: ticketId.toString() }, // must be string
  });
  };

  const renderTicket = ({ item }: { item: TicketDTO }) => (
    <View style={styles.ticketCard}>
      <Text style={styles.ticketText}>Ticket ID: {item.ticketId}</Text>
      <Text style={styles.ticketText}>Description: {item.description}</Text>
      <Text style={styles.ticketText}>Status: {item.status}</Text>

      <Pressable style={styles.goButton} onPress={() => goToTicket(item.ticketId)}>
        <Text style={styles.goButtonText}>Go To</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Assigned Tickets</Text>
      <FlatList
        data={assignedTickets}
        keyExtractor={(item) => item.ticketId.toString()}
        renderItem={renderTicket}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  ticketCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ticketText: {
    fontSize: 16,
    marginBottom: 5,
  },
  goButton: {
    marginTop: 10,
    backgroundColor: "#9b59b6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  goButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
