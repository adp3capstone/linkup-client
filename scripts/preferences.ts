import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.API_URL;
const PREFERENCE_URL = apiUrl + "/pref";

export interface PreferenceDTO {
  id?: number;
  user: { userId: number };
  preferredInterests: string[];
  relationshipType: string;
  minAge: number;
  maxAge: number;
  preferredGender: string;
  preferredCourses: string[];
  maxDistance: number;
  smokingPreference: boolean;
  drinkingPreference: boolean;
}

export async function createPreference(pref: PreferenceDTO): Promise<PreferenceDTO | null> {
  try {
    const response = await fetch(PREFERENCE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pref),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error creating preference:", error);
    return null;
  }
}

export async function getPreferenceByUserId(id: number): Promise<PreferenceDTO | null> {
  try {
    const response = await fetch(`${PREFERENCE_URL}/user/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching preference:", error);
    return null;
  }
}

export async function updatePreference(pref: PreferenceDTO): Promise<PreferenceDTO | null> {
  try {
    const response = await fetch(PREFERENCE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pref),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error updating preference:", error);
    return null;
  }
}

export async function deletePreference(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${PREFERENCE_URL}?id=${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error("Error deleting preference:", error);
    return false;
  }
}
