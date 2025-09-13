import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PatientCard } from '@/components/PatientCard';
import { analyticsAdapter } from '@/services/analyticsAdapter';
import { apiClient } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => apiClient.getAppointments(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    analyticsAdapter.trackEvent('screen_view', { screen: 'patients' });
  }, []);

  const filteredAppointments = appointments?.filter((appointment) => {
    const matchesSearch = appointment.patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    analyticsAdapter.trackEvent('patient_search', { query });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load patients" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.filterContainer}>
          {['all', 'waiting', 'checked-in', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive
              ]}
              onPress={() => setStatusFilter(status)}>
              <Text style={[
                styles.filterButtonText,
                statusFilter === status && styles.filterButtonTextActive
              ]}>
                {status === 'all' ? 'All' : status.replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PatientCard appointment={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#7B61FF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
});