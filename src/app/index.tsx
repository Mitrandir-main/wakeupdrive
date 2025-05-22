import { Link } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Animated, Easing, Image, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// It's good practice to require images like this
const logo = require("../assets/logo.jpg");

export default function Page() {
  const { top } = useSafeAreaInsets();
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(false);
  const [isAnimationScreen, setIsAnimationScreen] = useState(false);
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [isEndSessionModalVisible, setIsEndSessionModalVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('30 minutes');
  const [remainingMinutes, setRemainingMinutes] = useState(30);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const welcomeTextAnim = useRef(new Animated.Value(0)).current;
  const finalTextAnim = useRef(new Animated.Value(0)).current;
  const driveSafelyAnim = useRef(new Animated.Value(0)).current;
  const driveSafelySlideAnim = useRef(new Animated.Value(50)).current;
  const speedAnim = useRef(new Animated.Value(0)).current;
  const arrivalAnim = useRef(new Animated.Value(0)).current;
  const breakAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Extract minutes from selectedDuration
    const minutes = parseInt(selectedDuration);
    setRemainingMinutes(minutes);

    // Set up the countdown timer
    const timer = setInterval(() => {
      setRemainingMinutes(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute (60000 ms)

    // Clean up the timer when component unmounts or selectedDuration changes
    return () => clearInterval(timer);
  }, [selectedDuration]);

  const showWelcomeScreen = () => {
    setIsWelcomeScreen(true);
    setIsAnimationScreen(true);
    // Reset animation values
    driveSafelySlideAnim.setValue(50);
    speedAnim.setValue(0);
    arrivalAnim.setValue(0);
    breakAnim.setValue(0);
    buttonsAnim.setValue(0);
    
    // Start the welcome screen animations
    Animated.sequence([
      // Fade in welcome screen and "Welcome!" text together
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(welcomeTextAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]),
      // Hold for a moment
      Animated.delay(1000),
      // Fade out "Welcome!"
      Animated.timing(welcomeTextAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Fade in "Let's get driving."
      Animated.timing(finalTextAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Fade out "Let's get driving." and start fading in the next screen
      Animated.parallel([
        // Fade out "Let's get driving."
        Animated.timing(finalTextAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Fade in "Drive safely." with slide
        Animated.timing(driveSafelyAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(driveSafelySlideAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Fade in speed info
        Animated.timing(speedAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Fade in arrival time
        Animated.timing(arrivalAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Fade in break info
        Animated.timing(breakAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Fade in buttons
        Animated.timing(buttonsAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      setIsAnimationScreen(false);
    });
  };

  const goHome = () => {
    // First fade out the current screen
    Animated.parallel([
      Animated.timing(welcomeTextAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(finalTextAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(driveSafelyAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      // After fade out, switch screens and fade in
      setIsWelcomeScreen(false);
      setIsAnimationScreen(false);
      welcomeTextAnim.setValue(0);
      finalTextAnim.setValue(0);
      driveSafelyAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  if (!isWelcomeScreen) {
    return (
      <Animated.View style={{ flex: 1, backgroundColor: '#030046', paddingTop: top, opacity: fadeAnim }}>
        {/* Header and Logo Section */}
        <View className="items-center justify-start w-full">
          <Image 
            source={logo} 
            style={{ 
              width: '90%', 
              height: undefined,
              aspectRatio: 1,
              borderRadius: 15 
            }} 
            resizeMode="contain"
          />
        </View>

        {/* Main Content Section */}
        <View className="w-full items-center px-6 mt-2">
          <Text style={{ color: '#E2E8F0' }} className="text-xl text-center mb-6">
            Your co-pilot for safer journeys. WakeUpDrive monitors your alertness and helps prevent drowsiness behind the wheel.
          </Text>
          <Text style={{ color: '#A5B4FC' }} className="text-3xl font-semibold text-center tracking-wider mb-4">
            How It Works
          </Text>
          <Text style={{ color: '#E2E8F0' }} className="text-xl text-center mb-8">
            Using advanced algorithms and your phone's camera, the app detects signs of fatigue. If it senses you're nodding off, it triggers an alert to help you stay awake and focused.
          </Text>
          <TouchableOpacity
            onPress={showWelcomeScreen}
            activeOpacity={0.8}
          >
            <View style={{ backgroundColor: '#4F46E5', borderRadius: 8 }} className="py-3 px-8">
              <Text style={{ color: '#FFFFFF' }} className="text-xl font-bold text-center">
                Get Started
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (isAnimationScreen) {
    return (
      <Animated.View 
        style={{ 
          flex: 1, 
          backgroundColor: '#030046',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}
      >
        <View style={{ 
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Animated.Text 
            style={{ 
              position: 'absolute',
              color: '#FFFFFF',
              fontSize: 48,
              fontWeight: 'bold',
              opacity: welcomeTextAnim,
              textAlign: 'center'
            }}
          >
            Welcome!
          </Animated.Text>
          <Animated.Text 
            style={{ 
              position: 'absolute',
              color: '#FFFFFF',
              fontSize: 48,
              fontWeight: 'bold',
              opacity: finalTextAnim,
              textAlign: 'center'
            }}
          >
            Let's get driving.
          </Animated.Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        backgroundColor: '#030046',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeAnim,
      }}
    >
      <View style={{ 
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Animated.Text 
          style={{ 
            position: 'absolute',
            top: 100,
            color: '#79D9F6',
            fontSize: 48,
            fontWeight: 'bold',
            opacity: driveSafelyAnim,
            textAlign: 'center',
            transform: [{ translateY: driveSafelySlideAnim }]
          }}
        >
          Drive safely.
        </Animated.Text>
        <Animated.Text 
          style={{ 
            position: 'absolute',
            top: '35%',
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: 'bold',
            opacity: speedAnim,
            textAlign: 'center'
          }}
        >
          Your speed: <Text style={{ color: '#22C55E' }}>83 km/h</Text>
        </Animated.Text>
        <Animated.Text 
          style={{ 
            position: 'absolute',
            top: '45%',
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: 'bold',
            opacity: arrivalAnim,
            textAlign: 'center'
          }}
        >
          Arrival time: <Text style={{ color: '#22C55E' }}>19:00</Text>
        </Animated.Text>
        <Animated.Text 
          style={{ 
            position: 'absolute',
            top: '55%',
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: 'bold',
            opacity: breakAnim,
            textAlign: 'center'
          }}
        >
          Next break in <Text style={{ color: '#22C55E' }}>{remainingMinutes} minutes</Text>
        </Animated.Text>
      </View>
      <TouchableOpacity
        onPress={() => setIsEmergencyModalVisible(true)}
        activeOpacity={0.8}
        style={{ position: 'absolute', bottom: 140, opacity: buttonsAnim }}
      >
        <View style={{ backgroundColor: '#22C55E', borderRadius: 8, width: 200 }} className="py-3 px-8">
          <Text style={{ color: '#FFFFFF' }} className="text-xl font-bold text-center">
            Change break
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsEndSessionModalVisible(true)}
        activeOpacity={0.8}
        style={{ position: 'absolute', bottom: 80, opacity: buttonsAnim }}
      >
        <View style={{ backgroundColor: '#4F46E5', borderRadius: 8, width: 200 }} className="py-3 px-8">
          <Text style={{ color: '#FFFFFF' }} className="text-xl font-bold text-center">
            End of session
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isEmergencyModalVisible}
        onRequestClose={() => setIsEmergencyModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxWidth: 400 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' }}>
              Please choose duration:
            </Text>
            <TouchableOpacity onPress={() => {
              setSelectedDuration('10 minutes');
              setRemainingMinutes(10);
              setIsEmergencyModalVisible(false);
            }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 8, textAlign: 'center' }}>
                10 minutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectedDuration('20 minutes');
              setRemainingMinutes(20);
              setIsEmergencyModalVisible(false);
            }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 8, textAlign: 'center' }}>
                20 minutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectedDuration('30 minutes');
              setRemainingMinutes(30);
              setIsEmergencyModalVisible(false);
            }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 15, textAlign: 'center' }}>
                30 minutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEmergencyModalVisible(false)}
              style={{ backgroundColor: '#22C55E', padding: 10, borderRadius: 5, marginTop: 10 }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isEndSessionModalVisible}
        onRequestClose={() => setIsEndSessionModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxWidth: 400 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' }}>
              End Session
            </Text>
            <Text style={{ fontSize: 16, color: '#666', marginBottom: 15, textAlign: 'center' }}>
              Are you sure you want to end this session?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => setIsEndSessionModalVisible(false)}
                style={{ backgroundColor: '#4F46E5', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEndSessionModalVisible(false);
                  goHome();
                }}
                style={{ backgroundColor: '#EF4444', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}
