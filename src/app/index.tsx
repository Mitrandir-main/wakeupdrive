import { Link } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, View, TouchableOpacity, Animated, Easing, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SleepAlarm from "../components/SleepAlarm";

// It's good practice to require images like this
const logo = require("../assets/logo.jpg");

export default function Page() {
  const { top } = useSafeAreaInsets(); // Get safe area inset for top padding
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [showSleepAlarm, setShowSleepAlarm] = useState(false);
  const themeAnimation = useRef(new Animated.Value(0)).current; // 0 for dark, 1 for light

  const toggleTheme = () => {
    const newValue = isLightTheme ? 0 : 1;
    setIsLightTheme(!isLightTheme);
    Animated.timing(themeAnimation, {
      toValue: newValue,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const startMonitoring = () => {
    setShowSleepAlarm(true);
  };

  const stopMonitoring = () => {
    setShowSleepAlarm(false);
  };

  const animatedScreenBackgroundColor = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1E293B", "#F8FAFC"], // Dark: slate-800, Light: slate-50
  });

  const animatedTitleTextColor = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#A5B4FC", "#4F46E5"], // Dark: indigo-300, Light: indigo-600 (Adjusted for better visibility in header)
  });

  const animatedBodyTextColor = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E2E8F0", "#334155"], // Dark: slate-200, Light: slate-700
  });

  const animatedButtonBackgroundColor = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#6366F1", "#4338CA"], // Dark: indigo-500, Light: indigo-700
  });

  const animatedButtonTextColor = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#E0E7FF"], // Dark: white, Light: indigo-100
  });

  if (showSleepAlarm) {
    return <SleepAlarm onReturn={stopMonitoring} closedEyeThreshold={2000} />;
  }

  return (
    <Animated.View style={{ flex: 1, backgroundColor: animatedScreenBackgroundColor, paddingTop: top }}>
      {/* Header Section */}
      <View className="flex-row justify-between items-center w-full px-6 py-4">
        <Image source={logo} style={{ width: 120, height: 120, borderRadius: 10 }} />
        <Animated.Text style={{ color: animatedTitleTextColor }} className="text-3xl font-bold tracking-wider ml-4">
          WakeUpDrive
        </Animated.Text>
      </View>

      {/* Main Content Section */}
      <View className="flex-1 justify-center items-center px-6 pb-8">
        <Animated.Text style={{ color: animatedBodyTextColor }} className="text-lg text-center mb-6 mt-4">
          Your co-pilot for safer journeys. WakeUpDrive monitors your alertness and helps prevent drowsiness behind the wheel.
        </Animated.Text>
        <Animated.Text style={{ color: animatedTitleTextColor }} className="text-2xl font-semibold text-center tracking-wider mb-4">
          How It Works
        </Animated.Text>
        <Animated.Text style={{ color: animatedBodyTextColor }} className="text-md text-center mb-10">
          Using advanced algorithms and your phone's camera, the app detects signs of fatigue. If it senses you're nodding off, it triggers an alert to help you stay awake and focused.
        </Animated.Text>

        {/* Start Monitoring Button */}
        <TouchableOpacity
          onPress={startMonitoring}
          activeOpacity={0.8}
          className="mb-4"
        >
          <Animated.View style={{ backgroundColor: "#10B981", borderRadius: 8 }} className="py-3 px-8">
            <Animated.Text style={{ color: "#FFFFFF" }} className="text-xl font-bold text-center">
              Start Monitoring
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Theme Toggle Button */}
        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <Animated.View style={{ backgroundColor: animatedButtonBackgroundColor, borderRadius: 8 }} className="py-3 px-8">
            <Animated.Text style={{ color: animatedButtonTextColor }} className="text-xl font-bold text-center">
              Toggle Theme
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
