import { Alert } from 'react-native';

// Mock notifications adapter
export const notificationsAdapter = {
  async requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        'Enable Notifications',
        'Would you like to receive appointment reminders and updates?',
        [
          { text: 'Not Now', onPress: () => resolve(false) },
          { text: 'Enable', onPress: () => resolve(true) }
        ]
      );
    });
  },

  async areNotificationsEnabled(): Promise<boolean> {
    // Mock implementation - in real app would check device settings
    return Math.random() > 0.5;
  },

  async disableNotifications(): Promise<void> {
    Alert.alert('Notifications Disabled', 'You can re-enable them in settings.');
  },

  async scheduleAppointmentReminder(appointmentId: string, time: Date): Promise<void> {
    console.log(`Scheduled reminder for appointment ${appointmentId} at ${time}`);
  }
};