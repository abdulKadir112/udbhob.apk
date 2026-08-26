import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Check,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Shield
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const {
    currentMember,
    userRole,
    isAdmin,
    changeMemberPassword,
    logout,
    loginAsDemoMember,
  } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('সতর্কতা', 'অনুগ্রহ করে নতুন পাসওয়ার্ড লিখুন।');
      return;
    }
    if (newPassword.trim().length < 4) {
      Alert.alert('সতর্কতা', 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    setIsUpdating(true);
    try {
      await changeMemberPassword(newPassword.trim());
      Alert.alert('সফল', 'আপনার পাসওয়ার্ড সফলভাবে আপডেট হয়েছে এবং এডমিন পোর্টালে সিঙ্ক হয়েছে!');
      setNewPassword('');
    } catch (err: any) {
      Alert.alert('ত্রুটি', err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('লগআউট', 'আপনি কি সত্যিই লগআউট করতে চান?', [
      { text: 'বাতিল', style: 'cancel' },
      {
        text: 'লগআউট',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: currentMember?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
            }}
            style={styles.avatarLarge}
          />
          <Text style={styles.profileName}>{currentMember?.nameBn || currentMember?.name || 'মুহাম্মদ রিয়াদ'}</Text>
          <Text style={styles.profileUsername}>@{currentMember?.username || 'riyad_01'}</Text>

          <View style={styles.roleBadge}>
            <Shield size={12} color="#059669" />
            <Text style={styles.roleText}>{isAdmin ? 'এডমিন (Admin)' : 'সদস্য (Member)'}</Text>
          </View>
        </View>

        {/* Member Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>সদস্য তথ্যাবলী</Text>
          <View style={styles.infoRow}>
            <Phone size={16} color="#64748b" />
            <Text style={styles.infoLabel}>মোবাইল:</Text>
            <Text style={styles.infoVal}>{currentMember?.phone || '+966 50 123 4567'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Mail size={16} color="#64748b" />
            <Text style={styles.infoLabel}>ইমেইল:</Text>
            <Text style={styles.infoVal}>{currentMember?.email || 'riyad@udbhob.fund'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.infoLabel}>অবস্থান:</Text>
            <Text style={styles.infoVal}>{currentMember?.city || 'Riyadh'}, {currentMember?.country || 'Saudi Arabia'}</Text>
          </View>
        </View>

        {/* Password Change Box */}
        <View style={[styles.sectionCard, styles.passCard]}>
          <View style={styles.passHeader}>
            <KeyRound size={18} color="#10b981" />
            <View>
              <Text style={styles.passTitle}>পাসওয়ার্ড পরিবর্তন</Text>
              <Text style={styles.passSub}>নতুন পাসওয়ার্ড এডমিন পোর্টালেও রিয়েলটাইমে সিঙ্ক হবে</Text>
            </View>
          </View>

          {currentMember?.passwordPlain && (
            <View style={styles.currPassRow}>
              <Text style={styles.currPassLabel}>বর্তমান পাসওয়ার্ড:</Text>
              <Text style={styles.currPassVal}>{currentMember.passwordPlain}</Text>
            </View>
          )}

          <View style={styles.passInputWrap}>
            <Lock size={16} color="#94a3b8" />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="নতুন পাসওয়ার্ড লিখুন (যেমন: 123456)"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              style={styles.passInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={isUpdating || !newPassword.trim()}
            style={[styles.savePassBtn, (!newPassword.trim() || isUpdating) && styles.btnDisabled]}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Check size={16} color="#ffffff" />
                <Text style={styles.savePassText}>পাসওয়ার্ড আপডেট করুন</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#e11d48" />
          <Text style={styles.logoutText}>লগআউট (Logout)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#10b981',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  profileUsername: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    width: 60,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  passCard: {
    backgroundColor: '#062e1a',
    borderColor: '#0a4227',
  },
  passHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  passTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  passSub: {
    fontSize: 10,
    color: '#a7f3d0',
  },
  currPassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  currPassLabel: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  currPassVal: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    color: '#34d399',
  },
  passInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  passInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  savePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  savePassText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff1f2',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#fecdd3',
    gap: 8,
  },
  logoutText: {
    color: '#e11d48',
    fontSize: 14,
    fontWeight: '800',
  },
});
