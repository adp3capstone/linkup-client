import { Alert, Pressable, StyleSheet, TextInput, Text, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { createAdmin, AdminRequest } from '@/scripts/admin';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminSignupScreen() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSignUp = async () => {
    // Validate required fields
    const missingFields: string[] = [];
    if (!username.trim()) missingFields.push("Username");
    if (!firstName.trim()) missingFields.push("First Name");
    if (!lastName.trim()) missingFields.push("Last Name");
    if (!email.trim()) missingFields.push("Email");
    if (!password.trim()) missingFields.push("Password");

    if (missingFields.length > 0) {
      Alert.alert(
        "Validation Error",
        `Please fill in the following fields:\n- ${missingFields.join("\n- ")}`
      );
      return;
    }

    // Prepare admin request
    const adminData: AdminRequest = {
      username,
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const createdAdmin = await createAdmin(adminData);

      console.log('Admin created:', createdAdmin);

      Alert.alert('Admin account created successfully!');
      router.replace('/adminlogin');
    } catch (error: any) {
      console.error('Admin signup error:', error);
      Alert.alert('Signup failed', error.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
        />
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
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
