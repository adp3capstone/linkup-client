import Constants from 'expo-constants';
import { Alert } from 'react-native';

const apiUrl = Constants.expoConfig?.extra?.API_URL;



export async function login(data: { [key: string]: any }) {
    try {
        const response = await fetch(`${apiUrl}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

export async function signup(data: { [key: string]: any }) {
    try {
        const response = await fetch(`${apiUrl}/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}


export async function deleteUser(userId: number) {
    try {
        const response = await fetch(`${apiUrl}/user/delete?userId=${userId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            Alert.alert("User deleted successfully");
            return true;
        } else if (response.status === 404) {
            Alert.alert("User not found");
            return false;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Deletion failed");
        }

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

// Schedule deletion (soft delete)
export async function scheduleDeletion(userId: number) {
    try {
        const response = await fetch(`${apiUrl}/user/${userId}/schedule-deletion`, {
            method: 'DELETE',
        });

        const text = await response.text();
        if (response.ok) {
            Alert.alert(text);
        } else {
            throw new Error(text || "Scheduling failed");
        }

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

// Cancel scheduled deletion
export async function cancelDeletion(userId: number) {
    try {
        const response = await fetch(`${apiUrl}/user/${userId}/cancel-deletion`, {
            method: 'POST',
        });

        const text = await response.text();
        if (response.ok) {
            Alert.alert(text);
        } else {
            throw new Error(text || "Cancellation failed");
        }

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}
