import { analyticsAdapter } from '@/services/analyticsAdapter';
import { Appointment } from '@/services/apiClient';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Clock, FileText, Phone } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PatientCardProps {
  appointment: Appointment;
}

export function PatientCard({ appointment }: PatientCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return '#FF9800';
      case 'checked-in':
        return '#7B61FF';
      case 'completed':
        return '#00C853';
      default:
        return '#666666';
    }
  };

  const handleMedicalRecord = () => {
    analyticsAdapter.trackEvent('medical_record_opened', { 
      patientId: appointment.patient.id 
    });
    router.push({
      pathname: '/medical-record',
      params: { patientId: appointment.patient.id }
    });
  };

  const handleVideoCall = () => {
    analyticsAdapter.trackEvent('video_call_attempted', { 
      patientId: appointment.patient.id 
    });
    router.push({
      pathname: '/video-call',
      params: { 
        patientId: appointment.patient.id,
        patientName: appointment.patient.name
      }
    });
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image
          source={{ uri: appointment.patient.avatarUrl }}
          style={styles.avatar}
          defaultSource={require('@/assets/images/icon.png')}
        />
        
        <View style={styles.info}>
          <Text style={styles.name}>{appointment.patient.name}</Text>
          <View style={styles.timeContainer}>
            <Clock size={14} color="#666666" />
            <Text style={styles.time}>
              {format(new Date(appointment.time), 'h:mm a')}
            </Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>
            {appointment.status.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.vitals}>
        <Text style={styles.vitalsText}>
          BP: {appointment.patient.vitals.bp} | Temp: {appointment.patient.vitals.temp}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMedicalRecord}>
          <FileText size={16} color="#7B61FF" />
          <Text style={styles.actionText}>Record</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={handleVideoCall}>
          <Phone size={16} color="#FFFFFF" />
          <Text style={[styles.actionText, styles.callText]}>Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 13,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  vitals: {
    marginBottom: 12,
  },
  vitalsText: {
    fontSize: 13,
    color: '#666666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    gap: 4,
  },
  callButton: {
    backgroundColor: '#7B61FF',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7B61FF',
  },
  callText: {
    color: '#FFFFFF',
  },
});