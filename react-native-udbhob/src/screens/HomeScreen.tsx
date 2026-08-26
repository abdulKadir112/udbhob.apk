import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Wallet,
  Users,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Bell,
  MessageCircle,
  Sparkles
} from 'lucide-react-native';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const {
    currentFund,
    members,
    totalFundCapital,
    totalCollectedThisYear,
    totalInvestedAmount,
    activeMembersCount,
    selectedYear,
  } = useFund();

  const { currentMember, isAdmin } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100' }}
              style={styles.logoImage}
            />
            <View>
              <Text style={styles.appName}>Udbhob (উদ্ভব)</Text>
              <Text style={styles.appTagline}>বিনিয়োগে গড়ি নতুন সম্ভাবনা</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Chat')}
            >
              <MessageCircle color="#10b981" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={{
                  uri: currentMember?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
                }}
                style={styles.avatarMini}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Balance Card */}
        <LinearGradient
          colors={['#062e1a', '#0a4227', '#03170d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View style={styles.badgeRow}>
              <View style={styles.badgeLive}>
                <View style={styles.liveDot} />
                <Text style={styles.badgeText}>লাইভ ফান্ড স্টেটাস</Text>
              </View>
              <Text style={styles.yearTag}>{selectedYear} বর্ষ</Text>
            </View>
            <Text style={styles.heroTitle}>{currentFund.nameBn || currentFund.name}</Text>
          </View>

          <View style={styles.heroMain}>
            <Text style={styles.heroLabel}>সর্বমোট সংরক্ষিত মূলধন (Total Capital)</Text>
            <Text style={styles.heroAmount}>৳ {totalFundCapital.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>{selectedYear} আদায়</Text>
              <Text style={styles.statVal}>৳ {totalCollectedThisYear.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>মোট বিনিয়োগ</Text>
              <Text style={styles.statVal}>৳ {totalInvestedAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>সক্রিয় সদস্য</Text>
              <Text style={styles.statVal}>{activeMembersCount} জন</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Action Navigation Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Payments')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#ecfdf5' }]}>
              <Wallet color="#059669" size={22} />
            </View>
            <Text style={styles.actionTitle}>পেমেন্ট ম্যাট্রিক্স</Text>
            <Text style={styles.actionSub}>১২ মাসের কিস্তি হিসাব</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#eff6ff' }]}>
              <MessageCircle color="#2563eb" size={22} />
            </View>
            <Text style={styles.actionTitle}>কমিউনিটি চ্যাট</Text>
            <Text style={styles.actionSub}>সদস্যদের সাথে বার্তা</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Investments')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#fef3c7' }]}>
              <TrendingUp color="#d97706" size={22} />
            </View>
            <Text style={styles.actionTitle}>বিনিয়োগ ও প্রকল্প</Text>
            <Text style={styles.actionSub}>হালাল প্রফিট শেয়ার</Text>
          </TouchableOpacity>

          {isAdmin ? (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Admin')}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#faf5ff' }]}>
                <ShieldCheck color="#7c3aed" size={22} />
              </View>
              <Text style={styles.actionTitle}>এডমিন পোর্টাল</Text>
              <Text style={styles.actionSub}>পাসওয়ার্ড ও কন্ট্রোল</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#fdf2f8' }]}>
                <Users color="#db2777" size={22} />
              </View>
              <Text style={styles.actionTitle}>আমার প্রোফাইল</Text>
              <Text style={styles.actionSub}>পাসওয়ার্ড ও তথ্য</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Members Quick List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ফান্ডের সক্রিয় সদস্যবৃন্দ ({members.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
            <Text style={styles.sectionMore}>সব দেখুন</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
          {members.map((m) => (
            <View key={m.id} style={styles.memberItem}>
              <Image source={{ uri: m.avatarUrl }} style={styles.memberAvatar} />
              <Text numberOfLines={1} style={styles.memberName}>{m.nameBn || m.name}</Text>
              <Text style={styles.memberCity}>{m.city || 'সৌদি আরব'}</Text>
            </View>
          ))}
        </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#092819',
  },
  appName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  appTagline: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  heroCard: {
    margin: 16,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#062e1a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroTop: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
  },
  badgeText: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '700',
  },
  yearTag: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  heroMain: {
    marginBottom: 16,
  },
  heroLabel: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  statVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionMore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  memberScroll: {
    paddingLeft: 16,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 76,
  },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#10b981',
    marginBottom: 6,
  },
  memberName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  memberCity: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
});
