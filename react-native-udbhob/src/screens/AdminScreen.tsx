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
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  UserPlus,
  Key,
  Check,
  X,
  Trash2,
  Phone,
  Search,
  Lock
} from 'lucide-react-native';
import { useFund } from '../context/FundContext';
import { Member } from '../types';

export default function AdminScreen() {
  const {
    members,
    addMember,
    updateMemberPassword,
    deleteMember,
  } = useFund();

  const [search, setSearch] = useState('');
  const [editingPassMemberId, setEditingPassMemberId] = useState<string | null>(null);
  const [newPassInput, setNewPassInput] = useState('');

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberShare, setNewMemberShare] = useState('1000');
  const [newMemberPass, setNewMemberPass] = useState('123456');

  const filteredMembers = members.filter((m) =>
    (m.nameBn || m.name).toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  const handleSavePassword = async (memberId: string) => {
    if (!newPassInput.trim()) {
      Alert.alert('সতর্কতা', 'পাসওয়ার্ড খালি রাখা যাবে না');
      return;
    }
    try {
      await updateMemberPassword(memberId, newPassInput.trim());
      Alert.alert('সফল', 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      setEditingPassMemberId(null);
      setNewPassInput('');
    } catch (e: any) {
      Alert.alert('ত্রুটি', e.message || 'পাসওয়ার্ড পরিবর্তনে ব্যর্থ');
    }
  };

  const handleCreateMember = async () => {
    if (!newMemberName.trim() || !newMemberPhone.trim()) {
      Alert.alert('সতর্কতা', 'সদস্যের নাম ও মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    try {
      await addMember({
        name: newMemberName.trim(),
        nameBn: newMemberName.trim(),
        phone: newMemberPhone.trim(),
        email: `${newMemberPhone.replace(/[^0-9]/g, '')}@udbhob.fund`,
        monthlyShareAmount: Number(newMemberShare) || 1000,
        role: 'member',
        country: 'Saudi Arabia',
        city: 'Riyadh',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        username: newMemberName.trim().toLowerCase().replace(/\s+/g, '_'),
        passwordPlain: newMemberPass.trim() || '123456',
      });

      Alert.alert('সফল', 'নতুন সদস্য সফলভাবে যুক্ত করা হয়েছে!');
      setShowAddModal(false);
      setNewMemberName('');
      setNewMemberPhone('');
    } catch (e: any) {
      Alert.alert('ত্রুটি', e.message || 'সদস্য যুক্ত করা যায়নি।');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>এডমিন কন্ট্রোল সেন্টার</Text>
          <Text style={styles.subtitle}>সদস্য ও পাসওয়ার্ড পর্যবেক্ষণ</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <UserPlus size={16} color="#ffffff" />
          <Text style={styles.addBtnText}>নতুন সদস্য</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Search size={16} color="#64748b" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Members List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filteredMembers.map((m) => (
          <View key={m.id} style={styles.memberCard}>
            <View style={styles.mRow}>
              <Image source={{ uri: m.avatarUrl }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.mName}>{m.nameBn || m.name}</Text>
                <Text style={styles.mUser}>@{m.username || 'user'}</Text>
                <Text style={styles.mPhone}>{m.phone}</Text>
              </View>

              <View style={styles.mShareWrap}>
                <Text style={styles.mShareVal}>৳{m.monthlyShareAmount}</Text>
                <Text style={styles.mShareLabel}>প্রতি মাসে</Text>
              </View>
            </View>

            {/* Password Bar */}
            <View style={styles.passRow}>
              <View style={styles.passLabelWrap}>
                <Key size={14} color="#059669" />
                <Text style={styles.passLabel}>লগইন পাসওয়ার্ড:</Text>
              </View>

              {editingPassMemberId === m.id ? (
                <View style={styles.editPassWrap}>
                  <TextInput
                    value={newPassInput}
                    onChangeText={setNewPassInput}
                    placeholder="New Pass"
                    placeholderTextColor="#94a3b8"
                    style={styles.passInput}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.savePassIcon}
                    onPress={() => handleSavePassword(m.id)}
                  >
                    <Check size={14} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelPassIcon}
                    onPress={() => setEditingPassMemberId(null)}
                  >
                    <X size={14} color="#334155" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.passPill}
                  onPress={() => {
                    setEditingPassMemberId(m.id);
                    setNewPassInput(m.passwordPlain || '123456');
                  }}
                >
                  <Text style={styles.passText}>{m.passwordPlain || '123456'}</Text>
                  <Text style={styles.passEditText}>পরিবর্তন</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Member Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>নতুন সদস্য যুক্ত করুন</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={newMemberName}
              onChangeText={setNewMemberName}
              placeholder="সদস্যের নাম (বাংলা বা ইংরেজি)"
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
            />

            <TextInput
              value={newMemberPhone}
              onChangeText={setNewMemberPhone}
              placeholder="মোবাইল নম্বর (+966...)"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              style={styles.modalInput}
            />

            <TextInput
              value={newMemberShare}
              onChangeText={setNewMemberShare}
              placeholder="মাসিক কিস্তির পরিমাণ (টাকা)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              style={styles.modalInput}
            />

            <TextInput
              value={newMemberPass}
              onChangeText={setNewMemberPass}
              placeholder="ডিফল্ট পাসওয়ার্ড (যেমন: 123456)"
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateMember}>
              <Check size={18} color="#ffffff" />
              <Text style={styles.modalSubmitText}>সদস্য যুক্ত করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  mName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  mUser: {
    fontSize: 11,
    color: '#64748b',
  },
  mPhone: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  mShareWrap: {
    alignItems: 'flex-end',
  },
  mShareVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  mShareLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  passLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  passPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    gap: 6,
  },
  passText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    color: '#0f172a',
  },
  passEditText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  editPassWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontFamily: 'monospace',
    width: 80,
  },
  savePassIcon: {
    backgroundColor: '#059669',
    padding: 5,
    borderRadius: 6,
  },
  cancelPassIcon: {
    backgroundColor: '#e2e8f0',
    padding: 5,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 10,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    marginTop: 6,
  },
  modalSubmitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
