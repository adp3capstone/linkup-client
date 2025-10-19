import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.API_URL;
const MESSAGE_URL = apiUrl + "/messages";

export interface MessageDTO {
  messageId: number;
  chatId: number;
  senderId: number;
  content: string;
  sentAt: string;
}

export interface Message {
  messageId: number;
  senderId: number;
  content: string;
  sentAt: string;
}

export async function getMessagesForChat(chatId: number): Promise<MessageDTO[]> {
  const response = await fetch(`${MESSAGE_URL}/chat/${chatId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }
  return response.json();
}

export async function sendMessage(
  chatId: number,
  senderId: number,
  content: string
): Promise<MessageDTO> {
  const url = new URL(`${MESSAGE_URL}/send`);
  url.searchParams.append("chatId", chatId.toString());
  url.searchParams.append("senderId", senderId.toString());
  url.searchParams.append("content", content);

  const response = await fetch(url.toString(), { method: "POST" });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}
