// Define ApiConversation and ApiMessage interfaces for API response types

export interface ApiMessage {
  id: number;
  senderId: string | number;
  content: string;
  createdAt: string;
}

export interface ApiPartner {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface ApiConversation {
  id: number;
  partner: ApiPartner;
  messages: ApiMessage[];
}
