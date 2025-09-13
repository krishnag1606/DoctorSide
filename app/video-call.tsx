import { analyticsAdapter } from '@/services/analyticsAdapter';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VideoCallScreen() {
  const router = useRouter();
  const { patientId, patientName } = useLocalSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    analyticsAdapter.trackEvent('screen_view', { 
      screen: 'video_call',
      patientId 
    });

    // Simulate connecting to call
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      analyticsAdapter.trackEvent('video_call_connected', { patientId });
    }, 2000);

    // Start call duration timer when connected
    let durationTimer: NodeJS.Timeout;
    if (isConnected) {
      durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(connectTimer);
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [patientId, isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            analyticsAdapter.trackEvent('video_call_ended', { 
              patientId,
              duration: callDuration
            });
            router.back();
          }
        }
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    analyticsAdapter.trackEvent('video_call_mute_toggled', { 
      patientId,
      muted: !isMuted
    });
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    analyticsAdapter.trackEvent('video_call_video_toggled', { 
      patientId,
      videoOn: !isVideoOn
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.patientName}>{patientName}</Text>
          <Text style={styles.callStatus}>
            {isConnected ? formatDuration(callDuration) : 'Connecting...'}
          </Text>
        </View>
      </View>

      {/* Video Area */}
      <View style={styles.videoArea}>
        <View style={styles.remoteVideo}>
          <View style={styles.videoPlaceholder}>
            <Camera size={64} color="#FFFFFF" />
            <Text style={styles.placeholderText}>
              {isConnected ? 'Video Call Active' : 'Connecting to call...'}
            </Text>
            <Text style={styles.placeholderSubtext}>
              This is a placeholder for video calling
            </Text>
          </View>
        </View>

        <View style={styles.localVideo}>
          <View style={styles.localVideoPlaceholder}>
            {isVideoOn ? (
              <Camera size={24} color="#FFFFFF" />
            ) : (
              <CameraOff size={24} color="#FFFFFF" />
            )}
          </View>
        </View>
      </View>

      {/* Call Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.mutedButton]}
          onPress={toggleMute}>
          {isMuted ? (
            <MicOff size={24} color="#FFFFFF" />
          ) : (
            <Mic size={24} color="#000000" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}>
          <PhoneOff size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isVideoOn && styles.videoOffButton]}
          onPress={toggleVideo}>
          {isVideoOn ? (
            <Camera size={24} color="#000000" />
          ) : (
            <CameraOff size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Demo Notice */}
      <View style={styles.demoNotice}>
        <Text style={styles.demoText}>
          🎥 This is a demo video call interface. In production, this would integrate with a video calling service like Agora, Twilio, or WebRTC.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    padding: 4,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  videoArea: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  localVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    gap: 30,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: '#FF3B30',
  },
  videoOffButton: {
    backgroundColor: '#FF3B30',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoNotice: {
    backgroundColor: 'rgba(123, 97, 255, 0.9)',
    padding: 16,
    margin: 20,
    borderRadius: 12,
  },
  demoText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
});