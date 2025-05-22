# Migration from expo-av to expo-audio

This document explains the changes made to migrate the app from the deprecated `expo-av` package to the new `expo-audio` package.

## Why we migrated

According to the Expo documentation, `expo-av` has been deprecated and will be removed in SDK 54. The recommended replacement packages are:
- `expo-audio` for audio functionality
- `expo-video` for video functionality

## Changes made

1. **Package installation**:
   ```bash
   npx expo install expo-audio
   npm uninstall expo-av
   ```

2. **Updated SleepAlarm component**:
   - Changed imports from `import { Audio } from 'expo-av'` to `import { useAudioPlayer } from 'expo-audio'`
   - Replaced `Audio.Sound` usage with the new `useAudioPlayer` hook
   - Replaced methods like `sound.playAsync()` with `player.play()`
   - Replaced methods like `sound.stopAsync()` with `player.pause()`
   - Replaced `sound.unloadAsync()` with automatic cleanup provided by the hook

3. **Updated app.json**:
   - Added proper plugin configuration for `expo-audio`
   - Added required permissions for Android and iOS:
     - `android.permission.RECORD_AUDIO`
     - `NSMicrophoneUsageDescription`

## Code comparison

### Before (using expo-av):
```typescript
import { Audio } from 'expo-av';

// Load sound
const soundRef = useRef<Audio.Sound | null>(null);

useEffect(() => {
    const loadSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/alarm.mp3'),
                { shouldPlay: false, isLooping: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.error('Failed to load sound', error);
        }
    };

    loadSound();

    // Cleanup
    return () => {
        if (soundRef.current) {
            soundRef.current.unloadAsync();
        }
    };
}, []);

// Play sound
if (soundRef.current) {
    await soundRef.current.playAsync();
}

// Stop sound
if (soundRef.current) {
    await soundRef.current.stopAsync();
}
```

### After (using expo-audio):
```typescript
import { useAudioPlayer } from 'expo-audio';

// Initialize audio player with the alarm sound
const player = useAudioPlayer(require('../assets/alarm.mp3'));

// Set looping property
useEffect(() => {
    if (player) {
        player.loop = true;
    }
}, [player]);

// Play sound
player.play();

// Stop sound
player.pause();
```

## Benefits of using expo-audio

1. **Simpler API**: The new API is more straightforward and uses modern React hooks
2. **Automatic cleanup**: The hook automatically manages resource cleanup
3. **Better performance**: The new package is optimized for performance
4. **Future-proof**: Ensures compatibility with upcoming Expo SDK versions

## Additional notes

- The new API doesn't require `async/await` for play/pause operations
- The hook-based approach is more React-idiomatic
- For more information, see the [official expo-audio documentation](https://docs.expo.dev/versions/latest/sdk/audio/) 