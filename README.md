# WakeUpDrive

WakeUpDrive is a mobile application designed to help prevent drowsy driving by monitoring the driver's eye state in real-time. Using advanced face detection technology, the app alerts drivers when it detects signs of drowsiness, helping to keep them alert and safe on the road.

## Features

- **Real-time Eye Tracking**: Using the front camera, the app detects when a driver's eyes are closed for an extended period
- **Customizable Alert Threshold**: Set how long eyes need to be closed before triggering an alert
- **Loud Audio Alerts**: Plays attention-grabbing sounds to wake up drowsy drivers
- **Simple Interface**: Easy to use while driving with minimal distractions
- **Dark/Light Theme**: Comfortable viewing in any lighting condition

## How It Works

1. The app uses the device's front camera to monitor the driver's face
2. Advanced face detection tracks the state of the driver's eyes
3. When the driver's eyes remain closed for longer than the threshold (default: 2 seconds), an alarm sounds
4. The alarm continues until the driver opens their eyes

## Technical Details

This app is built with:
- React Native & Expo
- Vision Camera with Face Detection plugin for real-time eye tracking
- Expo Audio for alert sounds (replaced deprecated expo-av)
- NativeWind for styling

## Development

### Prerequisites
- Node.js
- Expo CLI
- iOS development environment (Xcode)
- Android development environment (Android Studio, Android SDK)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/wakeupdrive.git

# Install dependencies
cd wakeupdrive
npm install

# Create a development build (required as Vision Camera is not supported in Expo Go)
npx expo prebuild
```

### Running the App
```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

### Troubleshooting

#### Android SDK Setup
If you encounter errors like `Failed to resolve the Android SDK path` or `ANDROID_HOME not set`:

1. Install Android Studio
2. Install the Android SDK through Android Studio's SDK Manager
3. Set the ANDROID_HOME environment variable:

```bash
# Add to your .bashrc, .zshrc, or equivalent
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### iOS Development Issues
If you encounter issues with iOS builds:

1. Make sure Xcode is installed and up-to-date
2. Open the iOS project in Xcode:
```bash
open ios/wakeupdrive.xcworkspace
```
3. In Xcode, select a valid simulator or connected device
4. Build and run from Xcode to see detailed error messages

## Important Notes

- This app requires camera and microphone permissions
- The eye tracking feature works best in well-lit conditions
- Do not rely solely on this app for driving safety - it's an aid, not a replacement for proper rest
- Using Vision Camera requires a development build, not compatible with Expo Go

## License

[MIT License](LICENSE)

## Credits

- Alarm sound: Mixkit
- Icon and UI design: Custom design for WakeUpDrive
