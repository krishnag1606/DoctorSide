import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { analyticsAdapter } from '@/services/analyticsAdapter';
import { apiClient } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, Download, Heart, Thermometer, Weight, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MedicalRecordScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams();

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => apiClient.getPatientDetails(patientId as string),
    enabled: !!patientId,
  });

  useEffect(() => {
    analyticsAdapter.trackEvent('screen_view', { 
      screen: 'medical_record',
      patientId 
    });
  }, [patientId]);

  const handleExportPDF = () => {
    analyticsAdapter.trackEvent('pdf_export_attempted', { patientId });
    
    Alert.alert(
      'Export to PDF',
      `Exporting medical record for ${patient?.name} to PDF.\n\nThis is a placeholder - PDF export feature to be implemented.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('PDF export started') }
      ]
    );
  };

  if (isLoading) return <LoadingSpinner message="Loading patient record..." />;
  if (error || !patient) return <ErrorMessage message="Failed to load patient record" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}>
          <X size={24} color="#000000" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Medical Record</Text>
        
        <TouchableOpacity
          onPress={handleExportPDF}
          style={styles.exportButton}>
          <Download size={20} color="#7B61FF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.patientHeader}>
          <Image
            source={{ uri: patient.avatarUrl }}
            style={styles.avatar}
            defaultSource={require('@/assets/images/icon.png')}
          />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientId}>ID: {patient.id}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalCard}>
              <Heart size={24} color="#FF3B30" />
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{patient.vitals.bp}</Text>
            </View>
            
            <View style={styles.vitalCard}>
              <Thermometer size={24} color="#FF9800" />
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>{patient.vitals.temp}</Text>
            </View>
            
            <View style={styles.vitalCard}>
              <Activity size={24} color="#00C853" />
              <Text style={styles.vitalLabel}>Pulse</Text>
              <Text style={styles.vitalValue}>{patient.vitals.pulse}</Text>
            </View>
            
            <View style={styles.vitalCard}>
              <Weight size={24} color="#7B61FF" />
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalValue}>{patient.vitals.weight}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <View style={styles.listContainer}>
            {patient.allergies.length > 0 ? (
              patient.allergies.map((allergy, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.allergyDot} />
                  <Text style={styles.listText}>{allergy}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No known allergies</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <View style={styles.listContainer}>
            {patient.medications.length > 0 ? (
              patient.medications.map((medication, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.medicationDot} />
                  <Text style={styles.listText}>{medication}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No current medications</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last Visit Notes</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{patient.lastVisitNotes}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  exportButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  patientHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: '#F5F5F5',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  patientId: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  allergyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  medicationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  listText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
  },
  notesContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
});