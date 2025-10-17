import { StyleSheet, Dimensions, Image, TouchableOpacity,  Text, View } from 'react-native';
import { useEffect, useState, useRef } from "react";
import { getAllUsers } from '@/scripts/userapi';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age: number;
  bio: string;
  institution: string;
  gender: string;
  course: string;
  interests: string[];
  imageBase64: string | null;
  preferenceId: number | null;
  preferredInterests: string[] | null;
  relationshipType: string | null;
  minAge: number;
  maxAge: number;
  preferredGender: string | null;
  preferredCourses: string[] | null;
  maxDistance: number;
  smokingPreference: boolean;
  drinkingPreference: boolean;
  likedUserIds: number[];
  likedByUserIds: number[];
};

export default function TabOneScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);



useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = await import('@/scripts/db').then(module =>
        module.getFromStorage('user')
      );

      if (!user) return;

      setUserData(user);
      const rawData: any = user;
      const id = rawData.user.userId;
      setUserId(id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);

  return (
    <View style={styles.container}>
      <View>DashBoard</View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardContainer: {
    width: "90%",
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
    paddingVertical: 15,
  },
  expandedCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  image: {
    width: "85%",
    height: 250,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 10,
  },
  placeholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginVertical: 5,
    textAlign: "center",
  },
  bioText: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
    textAlign: "center",
  },
  cardButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    marginBottom: 5,
  },
  dislikeBtn: {
    backgroundColor: "#e74c3c",
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 20,
    elevation: 4,
  },
  likeBtn: {
    backgroundColor: "#9b59b6",
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 20,
    elevation: 4,
  },
  arrowBtn: {
    marginVertical: 10,
    width: 30,
    height: 30,
  },
});