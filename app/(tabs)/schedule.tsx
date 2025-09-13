import { AppointmentCard } from '@/components/AppointmentCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { analyticsAdapter } from '@/services/analyticsAdapter';
import { apiClient } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, startOfWeek } from 'date-fns';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ScheduleScreen() {
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['weeklySchedule'],
    queryFn: () => apiClient.getWeeklySchedule(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    analyticsAdapter.trackEvent('screen_view', { screen: 'schedule' });
  }, []);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDay = (date: Date) => {
    return appointments?.filter(apt => 
      format(new Date(apt.time), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) || [];
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load schedule" onRetry={refetch} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <Text style={styles.weekRange}>
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </Text>
      </View>

      {weekDays.map((day) => {
        const dayAppointments = getAppointmentsForDay(day);
        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

        return (
          <View key={day.toISOString()} style={styles.daySection}>
            <View style={[styles.dayHeader, isToday && styles.todayHeader]}>
              <Text style={[styles.dayName, isToday && styles.todayText]}>
                {format(day, 'EEEE')}
              </Text>
              <Text style={[styles.dayDate, isToday && styles.todayText]}>
                {format(day, 'MMM d')}
              </Text>
            </View>
            
            {dayAppointments.length > 0 ? (
              dayAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Text style={styles.noAppointments}>No appointments</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  weekRange: {
    fontSize: 16,
    color: '#666666',
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayHeader: {
    backgroundColor: '#7B61FF',
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  dayDate: {
    fontSize: 16,
    color: '#666666',
  },
  todayText: {
    color: '#FFFFFF',
  },
  noAppointments: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
  },
});