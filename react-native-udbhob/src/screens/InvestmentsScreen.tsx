import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Building2,
  Sprout,
  Briefcase,
  AlertCircle,
  Plus,
  ShieldCheck
} from 'lucide-react-native';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';

export default function InvestmentsScreen() {
  const { investments, totalInvestedAmount } = useFund();
  const { isAdmin } = useAuth();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'agriculture':
        return <Sprout size={18} color="#16a34a" />;
      case 'real_estate':
        return <Building2 size={18} color="#2563eb" />;
      default:
        return <Briefcase size={18} color="#d97706" />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>বিনিয়োগ ও প্রকল্প পোর্টফোলিও</Text>
          <Text style={styles.subtitle}>প্রবাসীদের যৌথ বিনিয়োগ ও হালাল মুনাফা বণ্টন</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>মোট বিনিয়োগকৃত তহবিল</Text>
          <Text style={styles.summaryVal}>৳ {totalInvestedAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.activeTag}>
          <Text style={styles.activeTagText}>{investments.length} টি প্রকল্প</Text>
        </View>
      </View>

      {/* Projects List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {investments.map((inv) => (
          <View key={inv.id} style={styles.projectCard}>
            <View style={styles.cardTop}>
              <View style={styles.catIconWrap}>
                {getCategoryIcon(inv.category)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.projTitle}>{inv.titleBn || inv.title}</Text>
                <Text style={styles.projLocation}>{inv.location || 'বাংলাদেশ'}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{inv.status === 'active' ? 'চলমান' : 'সম্পন্ন'}</Text>
              </View>
            </View>

            <Text style={styles.projDesc}>{inv.description}</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.boxLabel}>মূলধন বিনিয়োগ</Text>
                <Text style={styles.boxVal}>৳ {inv.investedAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.boxLabel}>প্রত্যাশিত লাভ</Text>
                <Text style={[styles.boxVal, { color: '#059669' }]}>+{inv.expectedReturnPercentage}%</Text>
              </View>
            </View>
          </View>
        ))}
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
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#062e1a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryVal: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTagText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  projTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  projLocation: {
    fontSize: 11,
    color: '#64748b',
  },
  statusBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  projDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  statBox: {
    flex: 1,
  },
  boxLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  boxVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
});
