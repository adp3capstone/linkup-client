import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearAllStorage } from '@/scripts/db';
import { Ionicons } from '@expo/vector-icons'; // ✅ for icons

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = sessionStorage.getItem('user')
          ? JSON.parse(sessionStorage.getItem('user') as string)
          : null;

        if (!user) {
          router.replace('/adminlogin');
          return;
        }

        setUserData(user);
        const id = sessionStorage.getItem('id')
          ? Number(sessionStorage.getItem('id'))
          : null;
        setUserId(id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const user = userData;
  const resolvedCount = user.resolvedTickets ? user.resolvedTickets.length : 0;

  const handleLogout = async () => {
    try {
      await clearAllStorage();
      sessionStorage.clear();
      router.replace('/adminlogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCompleteProfile = () => {
    router.push('/admineditprofile');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.firstName.charAt(0).toUpperCase()}
              {user.lastName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>

        <Text style={styles.roleText}>Administrator</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#9b59b6" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#27ae60" />
            <Text style={styles.infoText}>
              {resolvedCount} Resolved {resolvedCount === 1 ? 'Ticket' : 'Tickets'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCompleteProfile}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
            <Text style={styles.secondaryButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e7c6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#9b59b6',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  roleText: {
    fontSize: 15,
    color: '#9b59b6',
    marginBottom: 10,
  },
  infoSection: {
    marginTop: 15,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
  },
  buttonGroup: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#c85bdf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#e74c3c',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
});
