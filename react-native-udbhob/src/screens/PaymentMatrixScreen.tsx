import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar
} from 'lucide-react-native';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';

const MONTHS_BN = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
];

export default function PaymentMatrixScreen() {
  const {
    members,
    payments,
    selectedYear,
    setSelectedYear,
    availableYears,
    addPayment,
    deletePayment,
  } = useFund();

  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter((m) =>
    (m.nameBn || m.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  const getPaymentForMemberAndMonth = (memberId: string, month: number) => {
    return payments.find(
      (p) => p.memberId === memberId && p.year === selectedYear && p.month === month
    );
  };

  const handleCellPress = async (member: any, monthIndex: number) => {
    if (!isAdmin) return;

    const existing = getPaymentForMemberAndMonth(member.id, monthIndex + 1);
    if (existing) {
      // Toggle to unpaid (delete)
      await deletePayment(existing.id);
    } else {
      // Toggle to paid
      await addPayment({
        memberId: member.id,
        year: selectedYear,
        month: monthIndex + 1,
        amount: member.monthlyShareAmount || 1000,
        status: 'paid',
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash / Bank',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>১২ মাসের পেমেন্ট ম্যাট্রিক্স</Text>
          <Text style={styles.subtitle}>সদস্যদের কিস্তি ও শেয়ার জমার সার্বিক হিসাব</Text>
        </View>

        {/* Year Selector */}
        <View style={styles.yearRow}>
          {availableYears.map((yr) => (
            <TouchableOpacity
              key={yr}
              onPress={() => setSelectedYear(yr)}
              style={[
                styles.yearPill,
                selectedYear === yr && styles.yearPillActive
              ]}
            >
              <Text
                style={[
                  styles.yearText,
                  selectedYear === yr && styles.yearTextActive
                ]}
              >
                {yr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Search size={16} color="#64748b" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="সদস্যের নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Matrix Horizontal & Vertical Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.matrixContainer}>
        <View>
          {/* Table Header Row */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.fixedColHeader}>
              <Text style={styles.thText}>সদস্য</Text>
            </View>
            {MONTHS_BN.map((m, idx) => (
              <View key={idx} style={styles.monthHeaderCol}>
                <Text style={styles.thText}>{m}</Text>
              </View>
            ))}
          </View>

          {/* Member Rows */}
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
            {filteredMembers.map((member) => (
              <View key={member.id} style={styles.tableRow}>
                {/* Member Info Col */}
                <View style={styles.memberCol}>
                  <Image source={{ uri: member.avatarUrl }} style={styles.miniAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.mName}>{member.nameBn || member.name}</Text>
                    <Text style={styles.mShare}>৳{member.monthlyShareAmount}/মাস</Text>
                  </View>
                </View>

                {/* 12 Months Cells */}
                {MONTHS_BN.map((_, mIdx) => {
                  const payment = getPaymentForMemberAndMonth(member.id, mIdx + 1);
                  const isPaid = payment?.status === 'paid';

                  return (
                    <TouchableOpacity
                      key={mIdx}
                      activeOpacity={isAdmin ? 0.7 : 1}
                      onPress={() => handleCellPress(member, mIdx)}
                      style={[
                        styles.monthCell,
                        isPaid ? styles.cellPaid : styles.cellUnpaid
                      ]}
                    >
                      {isPaid ? (
                        <CheckCircle2 size={16} color="#059669" />
                      ) : (
                        <XCircle size={16} color="#fda4af" />
                      )}
                      <Text style={[styles.cellText, isPaid ? styles.textPaid : styles.textUnpaid]}>
                        {isPaid ? 'পরিশোধ' : 'বাকি'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  yearRow: {
    flexDirection: 'row',
    gap: 8,
  },
  yearPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  yearPillActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  yearTextActive: {
    color: '#ffffff',
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
  matrixContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  fixedColHeader: {
    width: 140,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  monthHeaderCol: {
    width: 65,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
  },
  thText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  memberCol: {
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#fafafa',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  mName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  mShare: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
  },
  monthCell: {
    width: 65,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
    gap: 2,
  },
  cellPaid: {
    backgroundColor: '#ecfdf5',
  },
  cellUnpaid: {
    backgroundColor: '#fff1f2',
  },
  cellText: {
    fontSize: 9,
    fontWeight: '700',
  },
  textPaid: {
    color: '#047857',
  },
  textUnpaid: {
    color: '#be123c',
  },
});
