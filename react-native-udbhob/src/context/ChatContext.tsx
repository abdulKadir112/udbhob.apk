import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ChatMessage } from '../types';
import { useAuth, DEFAULT_FUND_ID } from './AuthContext';

interface ChatContextType {
  messages: ChatMessage[];
  unreadCount: number;
  sendMessage: (text: string, mediaType?: 'text' | 'image' | 'voice', mediaUrl?: string, voiceDuration?: number, replyTo?: any) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentMember, userSession, activeFundId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fundId = activeFundId || DEFAULT_FUND_ID;

  // Load cached messages from AsyncStorage (0ms offline first)
  useEffect(() => {
    const loadCached = async () => {
      try {
        const saved = await AsyncStorage.getItem(`rn_chat_messages_${fundId}`);
        if (saved) {
          setMessages(JSON.parse(saved));
        }
      } catch (e) {}
    };
    loadCached();
  }, [fundId]);

  // Real-time Firestore sync with WhatsApp / Messenger speed
  useEffect(() => {
    const isDefault = (id?: string) =>
      !id || id === DEFAULT_FUND_ID || id === 'fund-probashi-default' || id === 'fund-main' || id === 'fund_probashi_001';

    const messagesRef = collection(db, 'chat_messages');
    const q = query(
      messagesRef,
      limit(250)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ChatMessage[];

      const currentIsDef = isDefault(fundId);
      const msgs = allMsgs.filter((m) => {
        if (currentIsDef) {
          return isDefault(m.fundId);
        }
        return m.fundId === fundId;
      });

      msgs.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());

      setMessages(msgs);
      AsyncStorage.setItem(`rn_chat_messages_${fundId}`, JSON.stringify(msgs)).catch(() => {});

      // Calculate unread
      const currentUserId = currentMember?.id || userSession?.uid;
      if (currentUserId) {
        const unread = msgs.filter(
          (m) => m.senderId !== currentUserId && (!m.readBy || !m.readBy.includes(currentUserId))
        ).length;
        setUnreadCount(unread);
      }
    });

    return () => unsubscribe();
  }, [fundId, currentMember?.id, userSession?.uid]);

  const sendMessage = async (
    text: string,
    mediaType: 'text' | 'image' | 'voice' = 'text',
    mediaUrl?: string,
    voiceDuration?: number,
    replyTo?: any
  ) => {
    if (!text.trim() && !mediaUrl) return;

    const senderId = currentMember?.id || userSession?.uid || 'guest';
    const senderName = currentMember?.name || (userSession?.role === 'admin' ? 'Admin' : 'Member');
    const senderNameBn = currentMember?.nameBn || senderName;
    const senderAvatar = currentMember?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    const newMsg: Omit<ChatMessage, 'id'> = {
      fundId,
      senderId,
      senderName,
      senderNameBn,
      senderRole: userSession?.role || 'member',
      senderAvatar,
      text: text.trim(),
      mediaType,
      mediaUrl,
      voiceDuration,
      timestamp: new Date().toISOString(),
      readBy: [senderId],
      replyTo: replyTo ? {
        id: replyTo.id,
        senderName: replyTo.senderName,
        text: replyTo.text,
      } : undefined,
    };

    // Optimistic local push for 0ms latency
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = { id: tempId, ...newMsg };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await addDoc(collection(db, 'chat_messages'), newMsg);
    } catch (e) {
      console.warn('Failed to send chat message:', e);
    }
  };

  const markAsRead = async (messageId: string) => {
    const currentUserId = currentMember?.id || userSession?.uid;
    if (!currentUserId) return;

    try {
      const msg = messages.find((m) => m.id === messageId);
      if (msg && (!msg.readBy || !msg.readBy.includes(currentUserId))) {
        const updatedReadBy = [...(msg.readBy || []), currentUserId];
        await updateDoc(doc(db, 'chats', messageId), { readBy: updatedReadBy });
      }
    } catch (e) {}
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        unreadCount,
        sendMessage,
        markAsRead,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
