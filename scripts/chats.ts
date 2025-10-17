import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.API_URL;
const CHATS_URL = apiUrl + "/chats";

export interface ChatDTO {
  chatId: number;
  matchId: number;
  messages: Message[];
  createdAt: string;
  updatedAt: string | null;
}

export interface Message {
  messageId: number;
  senderId: number;
  content: string;
  sentAt: string;
}

export async function getChatsForUser(userId: number): Promise<ChatDTO[]> {
  const res = await fetch(`${CHATS_URL}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch chats for user");
  return res.json();
}

export async function getChatById(chatId: number): Promise<ChatDTO> {
  const res = await fetch(`${CHATS_URL}/${chatId}`);
  if (!res.ok) throw new Error("Failed to fetch chat by ID");
  return res.json();
}

export async function createChatByMatch(matchId: number): Promise<ChatDTO> {
  const res = await fetch(`${CHATS_URL}/create/bymatch/${matchId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}
