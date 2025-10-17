import { Alert, Pressable, StyleSheet, TextInput, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminRequest, updateAdmin } from '@/scripts/admin';
import { getFromStorage } from '@/scripts/db';

export default function EditProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //const user = await getFromStorage('user');
        const user =  sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        if (!user) {
          router.replace('/adminlogin');
          return;
        }

        setUserData(user);

        const id = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : null;
        setUserId(id);

        // Prefill the fields
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        setUsername(user.username || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.replace('/login');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!userId) {
      alert('Error: User ID not found. Please refresh, log out, and log back in.');
      return;
    }

    try {
      const adminData: Partial<AdminRequest> = {
        firstName,
        lastName,
        email,
        username,
      };
      if (password.trim() !== '') adminData.password = password;

      const updated = await updateAdmin(userId, adminData);
      alert( 'Profile updated successfully!');
      router.back();
    } catch (error: any) {
      console.error('Update error:', error);
      alert(error.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password (leave blank to keep)"
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#6a0dad',
    paddingHorizontal: 12,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6a0dad',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
