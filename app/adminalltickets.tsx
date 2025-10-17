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
        const rawData: any = user;
        const id = rawData.userId;

        setUserId(id);

        if (id) {
          const ticketsResponse = await getAllTickets();
          console.log(ticketsResponse)
          if (ticketsResponse) {
            // Filter out resolved or already assigned tickets
            const filtered = ticketsResponse.filter(
              (t: any) => !t.assignedTo && t.status !== 'RESOLVED'
            );
            setTickets(filtered);
            console.log('Filtered tickets:', filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);



const assignTicketToMe = async (ticketId: number, adminId: number) => {
  try {
    console.log(`Assigning ticket ${ticketId} to admin ${adminId}...`);

    const updatedTicket = await assignTicketToAdmin({
      ticketId,
      adminId,
    });

    console.log("Ticket assigned successfully:", updatedTicket);
    alert("Ticket successfully assigned to you!");
    
    // Optionally re-fetch tickets to refresh the list
    // (uncomment if you have a function like getAllTickets)
    const refreshedTickets = await getAllTickets();
    setTickets(refreshedTickets);

  } catch (error: any) {
    console.error("Error assigning ticket:", error.response?.data || error.message);
    alert("Failed to assign ticket. Please try again.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Unassigned Tickets</Text>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.ticketId.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <Text style={styles.ticketTitle}>Ticket #{item.ticketId}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Status: {item.status}</Text>

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
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
