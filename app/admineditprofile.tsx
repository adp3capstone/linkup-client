import { Alert, Pressable, StyleSheet, TextInput, Text, View, ScrollView } from 'react-native';
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
const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
if (!user) {
router.replace('/adminlogin');
return;
}
    setUserData(user);

    const id = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : null;
    setUserId(id);

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
  alert('Profile updated successfully!');
  router.back();
} catch (error: any) {
  console.error('Update error:', error);
  alert(error.message || 'Unknown error');
}

};

return (
<SafeAreaView style={{ flex: 1 }} edges={['bottom']}> <ScrollView contentContainerStyle={styles.scrollContainer}> <View style={styles.headerContainer}> <Text style={styles.header}>Edit Profile</Text> <Text style={styles.subHeader}>Update your account information below.</Text> </View>

    <View style={styles.formContainer}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="Enter first name"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Enter last name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter email address"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Enter username"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Leave blank to keep current password"
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </Pressable>
    </View>
  </ScrollView>
</SafeAreaView>


);
}

const styles = StyleSheet.create({
scrollContainer: {
flexGrow: 1,
backgroundColor: '#f9f5ff',
padding: 20,
paddingBottom: 50,
},
headerContainer: {
alignItems: 'center',
marginBottom: 30,
},
header: {
fontSize: 26,
fontWeight: 'bold',
color: '#6a0dad',
},
subHeader: {
fontSize: 14,
color: '#555',
marginTop: 6,
textAlign: 'center',
},
formContainer: {
backgroundColor: '#fff',
borderRadius: 20,
padding: 20,
shadowColor: '#6a0dad',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.2,
shadowRadius: 4,
elevation: 4,
},
label: {
fontSize: 14,
fontWeight: '600',
color: '#6a0dad',
marginBottom: 5,
marginTop: 10,
},
input: {
height: 50,
borderWidth: 1.5,
borderColor: '#6a0dad',
borderRadius: 25,
paddingHorizontal: 14,
fontSize: 16,
color: '#333',
backgroundColor: '#faf8ff',
},
button: {
backgroundColor: '#6a0dad',
paddingVertical: 16,
borderRadius: 25,
alignItems: 'center',
marginTop: 30,
shadowColor: '#6a0dad',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.3,
shadowRadius: 3,
elevation: 3,
},
buttonText: {
color: '#fff',
fontSize: 17,
fontWeight: '700',
letterSpacing: 0.5,
},
});
