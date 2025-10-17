import { StyleSheet, Image, ScrollView, Button, Pressable, View as RNView,TouchableOpacity,  Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearAllStorage } from '@/scripts/db';
import { getImageByUserId } from '@/scripts/userapi';
import institutions from "@/data/institutions.json";

interface UserImage {
  userId: number;
  imageId: number;
  imageUrl: string; // Base64 string
}


export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user =  sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        if (!user) {
          router.replace('/adminlogin');
          return;
        }

        setUserData(user);

        const id = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : null;
        setUserId(id);

      if (!user) {
        alert(user)
        console.log(user)
        router.replace('/adminlogin');
        return;
      }

      setUserData(user);
      console.log("user data:", user);
      
      const rawData: any = user;


      setUserId(id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);


  useEffect(() => {
    console.log("user id:", userId);
  },[userId]);

  if (!userData) {
    return (
        <View style={styles.container}>
          <Text>Loading profile...</Text>
        </View>
    );
  }

  const user = userData;

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

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
      {/* Name*/}
      <View style={styles.nameRow}>
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCompleteProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginBottom: 15,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3e5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9b59b6",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginRight: 8,
  },
  age: {
    fontSize: 18,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  institution: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#c85bdf",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    width: "70%",
  },
  secondaryButton: {
    backgroundColor: "#d891ef",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 15,
    fontWeight: "600",
  },
});

