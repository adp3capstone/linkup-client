import Constants from "expo-constants";
import axios from "axios";

const apiUrl = Constants.expoConfig?.extra?.API_URL;
const ADMIN_URL = `${apiUrl}/admin`;
const TICKET_URL = `${apiUrl}/tickets`;

export interface AdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface AdminDTO {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: "ADMIN";
}

export interface AdminAssignTicketRequest {
  adminId: number;
  ticketId: number;
}

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

export async function createAdmin(admin: AdminRequest): Promise<AdminDTO> {
  const res = await api.post(`${ADMIN_URL}/signup`, admin);
  return res.data;
}

export async function getAdminById(id: number): Promise<AdminDTO> {
  const res = await api.get(`${ADMIN_URL}/${id}`);
  return res.data;
}

export async function getAllAdmins(): Promise<AdminDTO[]> {
  const res = await api.get(ADMIN_URL);
  return res.data;
}

export async function updateAdmin(id: number, admin: Partial<AdminRequest>): Promise<AdminDTO> {
  const res = await api.put(`${ADMIN_URL}/${id}`, admin);
  return res.data;
}

export async function deleteAdmin(id: number): Promise<void> {
  await api.delete(`${ADMIN_URL}/${id}`);
}

export interface AuthRequest {
  username: string;
  password: string;
}

export async function loginAdmin(request: AuthRequest): Promise<AdminDTO> {
  try {
    const response = await axios.post<AdminDTO>(`${ADMIN_URL}/login`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If the backend returns 200 OK, return the admin data
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid username or password.");
    }
    throw new Error("Login failed. Please try again later.");
  }
}

export const assignTicketToAdmin = async (request: AdminAssignTicketRequest) => {
  try {
    const response = await axios.patch(`${TICKET_URL}/assign`, request, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // optional: 10s timeout
    });

    return response.data; // TicketDTO from your backend
  } catch (error: any) {
    console.error("Error assigning ticket:", error.response?.data || error.message);
    throw error;
  }
};