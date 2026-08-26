import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Send,
  Mic,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Smile,
  Phone,
  Video
} from 'lucide-react-native';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen() {
  const { messages, sendMessage } = useChat();
  const { currentMember, userSession } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const currentUserId = currentMember?.id || userSession?.uid || 'guest';

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    setIsSending(true);
    try {
      await sendMessage(textToSend, 'text');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMe = item.senderId === currentUserId;
    const timeStr = item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowOther]}>
        {!isMe && (
          <Image
            source={{ uri: item.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
            style={styles.chatAvatar}
          />
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {!isMe && (
            <Text style={styles.senderHeader}>{item.senderNameBn || item.senderName}</Text>
          )}
          <Text style={[styles.bubbleText, isMe ? styles.textMe : styles.textOther]}>
            {item.text}
          </Text>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, isMe ? styles.timeMe : styles.timeOther]}>
              {timeStr}
            </Text>
            {isMe && <CheckCheck size={12} color="#6ee7b7" style={{ marginLeft: 3 }} />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* WhatsApp / Messenger style Header */}
      <View style={styles.chatHeader}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
            style={styles.headerGroupImg}
          />
          <View>
            <Text style={styles.headerTitle}>Udbhob কমিউনিটি চ্যাট</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineStatus}>সক্রিয় ফান্ড সদস্যবৃন্দ</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.hIconBtn}>
            <Phone size={18} color="#059669" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.hIconBtn}>
            <Video size={20} color="#059669" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages FlatList */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Chat Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputIconBtn}>
            <ImageIcon size={20} color="#64748b" />
          </TouchableOpacity>

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="একটি বার্তা লিখুন..."
            placeholderTextColor="#94a3b8"
            style={styles.textInput}
            multiline
          />

          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              onPress={handleSend}
              disabled={isSending}
              style={styles.sendBtn}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Send size={18} color="#ffffff" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micBtn}>
              <Mic size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeae2', // WhatsApp style background tone
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerGroupImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#092819',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  onlineStatus: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  hIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    padding: 14,
    paddingBottom: 20,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
    gap: 6,
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  msgRowOther: {
    justifyContent: 'flex-start',
  },
  chatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMe: {
    backgroundColor: '#005c4b', // WhatsApp Dark Green
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 2,
  },
  senderHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },
  textMe: {
    color: '#ffffff',
  },
  textOther: {
    color: '#0f172a',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 3,
  },
  timeText: {
    fontSize: 9,
  },
  timeMe: {
    color: '#a7f3d0',
  },
  timeOther: {
    color: '#94a3b8',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  inputIconBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#005c4b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
