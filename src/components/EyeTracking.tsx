import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useCameraPermission, Camera as VisionCamera } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera-face-detector';

// Get window dimensions for auto mode
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface EyeTrackingProps {
    onEyesClosed: (duration: number) => void;
    onEyesOpen: () => void;
    closedThreshold: number; // Time in ms before triggering alert
}

export default function EyeTracking({
    onEyesClosed,
    onEyesOpen,
    closedThreshold = 2000
}: EyeTrackingProps) {
    const { hasPermission, requestPermission } = useCameraPermission();
    const [device, setDevice] = useState<any>(null);
    const [eyesClosedStartTime, setEyesClosedStartTime] = useState<number | null>(null);
    const [eyesClosedDuration, setEyesClosedDuration] = useState<number>(0);
    const [alertTriggered, setAlertTriggered] = useState<boolean>(false);

    // Interval ref for continuous tracking
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Request camera permission on mount
    useEffect(() => {
        const checkPermission = async () => {
            if (!hasPermission) {
                await requestPermission();
            }
        };

        checkPermission();

        // Clean up interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [hasPermission, requestPermission]);

    // Get the front camera device
    useEffect(() => {
        const getDevice = async () => {
            try {
                const devices = await VisionCamera.getAvailableCameraDevices();
                const frontCamera = devices.find(d => d.position === 'front');
                if (frontCamera) {
                    setDevice(frontCamera);
                }
            } catch (error) {
                console.error('Failed to get camera device:', error);
            }
        };

        getDevice();
    }, []);

    // Face detection options
    const faceDetectionOptions = {
        performanceMode: 'fast' as const,
        landmarkMode: 'all' as const,
        contourMode: 'none' as const,
        classificationMode: 'all' as const,
        minFaceSize: 0.15,
        trackingEnabled: true,
    };

    // Function to handle face detection results
    function handleFacesDetection(faces: any[], frame: any) {
        if (faces.length > 0) {
            const face = faces[0];

            // Check if eyes are closed
            // The threshold value might need adjustment based on testing
            const CLOSED_THRESHOLD = 0.2;

            const leftEyeOpen = face.leftEyeOpenProbability || 0;
            const rightEyeOpen = face.rightEyeOpenProbability || 0;
            const eyesClosed = leftEyeOpen < CLOSED_THRESHOLD && rightEyeOpen < CLOSED_THRESHOLD;

            if (eyesClosed) {
                // Start tracking closed eyes duration
                if (!eyesClosedStartTime) {
                    const now = Date.now();
                    setEyesClosedStartTime(now);

                    // Start a timer to update duration
                    intervalRef.current = setInterval(() => {
                        const currentDuration = Date.now() - now;
                        setEyesClosedDuration(currentDuration);

                        // Check if we've reached the threshold for alert
                        if (currentDuration >= closedThreshold && !alertTriggered) {
                            setAlertTriggered(true);
                            onEyesClosed(currentDuration);
                        }
                    }, 100);
                }
            } else {
                // Eyes are open, reset tracking
                if (eyesClosedStartTime) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }

                    setEyesClosedStartTime(null);
                    setEyesClosedDuration(0);

                    if (alertTriggered) {
                        setAlertTriggered(false);
                        onEyesOpen();
                    }
                }
            }
        } else {
            // No face detected, reset tracking
            if (eyesClosedStartTime && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setEyesClosedStartTime(null);
                setEyesClosedDuration(0);

                if (alertTriggered) {
                    setAlertTriggered(false);
                    onEyesOpen();
                }
            }
        }
    }

    if (!hasPermission || !device) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Waiting for camera permission...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                faceDetectionOptions={faceDetectionOptions}
                faceDetectionCallback={handleFacesDetection}
            />
            <View style={styles.overlay}>
                <Text style={styles.text}>
                    {eyesClosedStartTime ?
                        `Eyes closed for: ${Math.round(eyesClosedDuration / 1000)}s` :
                        'Eyes open'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 5,
    }
}); 