import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import EyeTracking from './EyeTracking';

interface SleepAlarmProps {
    closedEyeThreshold?: number; // Time in ms before triggering alert
    onReturn?: () => void;
}

export default function SleepAlarm({
    closedEyeThreshold = 2000, // Default 2 seconds
    onReturn
}: SleepAlarmProps) {
    const [isMonitoring, setIsMonitoring] = useState(true);
    const [alertActive, setAlertActive] = useState(false);
    const [closedDuration, setClosedDuration] = useState(0);

    // Initialize audio player with the alarm sound
    const player = useAudioPlayer(require('../assets/alarm.mp3'));

    // Set looping to true when player is initialized
    useEffect(() => {
        if (player) {
            // Set loop mode when player is loaded
            player.loop = true;
        }
    }, [player]);

    // Handle when eyes are closed for too long
    const handleEyesClosed = async (duration: number) => {
        setAlertActive(true);
        setClosedDuration(duration);

        // Play alert sound
        try {
            player.play();
        } catch (error) {
            console.error('Failed to play sound', error);
        }
    };

    // Handle when eyes are opened again
    const handleEyesOpened = async () => {
        setAlertActive(false);
        setClosedDuration(0);

        // Stop alert sound
        try {
            player.pause();
        } catch (error) {
            console.error('Failed to stop sound', error);
        }
    };

    // Toggle monitoring state
    const toggleMonitoring = () => {
        setIsMonitoring(!isMonitoring);

        // If turning off monitoring, stop any active alerts
        if (isMonitoring && alertActive) {
            handleEyesOpened();
        }
    };

    return (
        <View style={styles.container}>
            {isMonitoring ? (
                <EyeTracking
                    onEyesClosed={handleEyesClosed}
                    onEyesOpen={handleEyesOpened}
                    closedThreshold={closedEyeThreshold}
                />
            ) : (
                <View style={styles.pausedContainer}>
                    <Text style={styles.pausedText}>Monitoring Paused</Text>
                </View>
            )}

            {alertActive && (
                <View style={styles.alertOverlay}>
                    <Text style={styles.alertText}>WAKE UP!</Text>
                    <Text style={styles.alertSubtext}>
                        Eyes closed for {Math.round(closedDuration / 1000)} seconds
                    </Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, isMonitoring ? styles.stopButton : styles.startButton]}
                    onPress={toggleMonitoring}
                >
                    <Text style={styles.buttonText}>
                        {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                    </Text>
                </TouchableOpacity>

                {onReturn && (
                    <TouchableOpacity
                        style={[styles.button, styles.returnButton]}
                        onPress={onReturn}
                    >
                        <Text style={styles.buttonText}>Return</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    pausedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E293B',
    },
    pausedText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    alertOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    alertText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    alertSubtext: {
        fontSize: 24,
        color: 'white',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        zIndex: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    startButton: {
        backgroundColor: '#10B981', // Green
    },
    stopButton: {
        backgroundColor: '#EF4444', // Red
    },
    returnButton: {
        backgroundColor: '#6366F1', // Indigo
    },
}); 