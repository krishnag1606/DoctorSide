import { analyticsAdapter } from '@/services/analyticsAdapter';
import { authAdapter } from '@/services/authAdapter';
import { notificationsAdapter } from '@/services/notificationsAdapter';
import { useRouter } from 'expo-router';
import { Bell, Edit, LogOut, Save, Shield, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Smith',
    email: 'dr.smith@hospital.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Cardiology',
  });

  useEffect(() => {
    analyticsAdapter.trackEvent('screen_view', { screen: 'settings' });
  }, []);

  const handleSaveProfile = () => {
    // Save to mock API/local storage
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
    analyticsAdapter.trackEvent('profile_updated');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authAdapter.logout();
            analyticsAdapter.trackEvent('user_logout');
            router.replace('/login');
          },
        },
      ]
    );
  };

  const toggleNotifications = async () => {
    const enabled = await notificationsAdapter.areNotificationsEnabled();
    if (enabled) {
      await notificationsAdapter.disableNotifications();
    } else {
      await notificationsAdapter.requestPermission();
    }
    analyticsAdapter.trackEvent('notifications_toggled', { enabled: !enabled });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={20} color="#7B61FF" />
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            style={styles.editButton}>
            {isEditing ? <Save size={20} color="#7B61FF" /> : <Edit size={20} color="#7B61FF" />}
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.name}
              onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.email}
              onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.phone}
              onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialization</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.specialization}
              onChangeText={(text) => setProfile(prev => ({ ...prev, specialization: text }))}
              editable={isEditing}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color="#7B61FF" />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={toggleNotifications}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color="#7B61FF" />
          <Text style={styles.sectionTitle}>Security</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
          <Text style={styles.settingValue}>•••••••</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
  },
  settingValue: {
    fontSize: 16,
    color: '#666666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});