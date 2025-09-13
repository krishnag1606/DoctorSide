import AsyncStorage from '@react-native-async-storage/async-storage';
import mockData from '@/data/mock-data.json';

export interface Patient {
  id: string;
  name: string;
  avatarUrl: string;
  vitals: {
    bp: string;
    temp: string;
    pulse: string;
    weight: string;
  };
  allergies: string[];
  medications: string[];
  lastVisitNotes: string;
}

export interface Appointment {
  id: string;
  time: string;
  status: 'waiting' | 'checked-in' | 'completed';
  patient: Patient;
}

const CACHE_KEY = 'appointments_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Mock API client using local data
export const apiClient = {
  async getTodayAppointments(): Promise<Appointment[]> {
    try {
      // Try to get from cache first
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const appointments = mockData.schedule;
      
      // Cache the data
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        data: appointments,
        timestamp: Date.now()
      }));

      return appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  async getAppointments(): Promise<Appointment[]> {
    return this.getTodayAppointments();
  },

  async getWeeklySchedule(): Promise<Appointment[]> {
    // For demo, return same appointments but spread across the week
    const appointments = await this.getTodayAppointments();
    const weeklySchedule = [...appointments];
    
    // Add some appointments for other days
    const today = new Date();
    for (let i = 1; i < 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      // Add 1-2 appointments per day
      const dailyAppointments = appointments.slice(0, Math.random() > 0.5 ? 2 : 1).map((apt, index) => ({
        ...apt,
        id: `${apt.id}_day_${i}_${index}`,
        time: futureDate.toISOString(),
        status: Math.random() > 0.7 ? 'completed' : 'waiting'
      }));
      
      weeklySchedule.push(...dailyAppointments);
    }
    
    return weeklySchedule;
  },

  async getPatientDetails(patientId: string): Promise<Patient | null> {
    const appointments = await this.getAppointments();
    const appointment = appointments.find(apt => apt.patient.id === patientId);
    return appointment?.patient || null;
  }
};