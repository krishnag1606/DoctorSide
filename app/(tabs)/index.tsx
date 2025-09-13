import { AppointmentCard } from '@/components/AppointmentCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { analyticsAdapter } from '@/services/analyticsAdapter';
import { apiClient } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['todayAppointments'],
    queryFn: () => apiClient.getTodayAppointments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    analyticsAdapter.trackEvent('screen_view', { screen: 'dashboard' });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const stats = {
    total: appointments?.length || 0,
    waiting: appointments?.filter(apt => apt.status === 'waiting').length || 0,
    checkedIn: appointments?.filter(apt => apt.status === 'checked-in').length || 0,
    completed: appointments?.filter(apt => apt.status === 'completed').length || 0,
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load dashboard data" onRetry={refetch} />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, Dr. Smith</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color="#7B61FF" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#FF9800" />
          <Text style={styles.statNumber}>{stats.waiting}</Text>
          <Text style={styles.statLabel}>Waiting</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={24} color="#00C853" />
          <Text style={styles.statNumber}>{stats.checkedIn}</Text>
          <Text style={styles.statLabel}>Checked In</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Appointments</Text>
        {appointments?.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
        {appointments?.length === 0 && (
          <Text style={styles.emptyText}>No appointments scheduled for today</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#7B61FF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#E8E2FF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    paddingVertical: 40,
  },
});