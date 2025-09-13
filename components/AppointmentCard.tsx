import { analyticsAdapter } from '@/services/analyticsAdapter';
import { Appointment } from '@/services/apiClient';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Clock, FileText, Phone } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'checked-in':
        return 'Checked In';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleMedicalRecord = () => {
    analyticsAdapter.trackEvent('medical_record_opened', { 
      patientId: appointment.patient.id,
      appointmentId: appointment.id 
    });
    router.push({
      pathname: '/medical-record',
      params: { patientId: appointment.patient.id }
    });
  };

  const handleVideoCall = () => {
    analyticsAdapter.trackEvent('video_call_attempted', { 
      patientId: appointment.patient.id,
      appointmentId: appointment.id 
    });
    
    Alert.alert(
      'Video Call',
      `Initiating video call with ${appointment.patient.name}.\n\nThis is a placeholder - video calling feature to be implemented.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Call', onPress: () => console.log('Video call started') }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <Image
            source={{ uri: appointment.patient.avatarUrl }}
            style={styles.avatar}
            defaultSource={require('@/assets/images/icon.png')}
          />
          <View style={styles.details}>
            <Text style={styles.patientName}>{appointment.patient.name}</Text>
            <View style={styles.timeContainer}>
              <Clock size={16} color="#666666" />
              <Text style={styles.time}>
                {format(new Date(appointment.time), 'h:mm a')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMedicalRecord}>
          <FileText size={18} color="#7B61FF" />
          <Text style={styles.actionButtonText}>Medical Record</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.videoCallButton]}
          onPress={handleVideoCall}>
          <Phone size={18} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, styles.videoCallButtonText]}>Video Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  details: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
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
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  videoCallButton: {
    backgroundColor: '#7B61FF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B61FF',
  },
  videoCallButtonText: {
    color: '#FFFFFF',
  },
});