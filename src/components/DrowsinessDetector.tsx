import React from 'react';
import SleepAlarm from './SleepAlarm';

interface DrowsinessDetectorProps {
    onReturn: () => void;
    closedEyeThreshold?: number;
}

/**
 * Component that handles drowsiness detection and alerting
 * This encapsulates just the AI functionality while keeping the main UI in index.tsx
 */
export default function DrowsinessDetector({
    onReturn,
    closedEyeThreshold = 2000
}: DrowsinessDetectorProps) {
    return <SleepAlarm onReturn={onReturn} closedEyeThreshold={closedEyeThreshold} />;
} 