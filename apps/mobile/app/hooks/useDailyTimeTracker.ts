import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const DAILY_GOAL_KEY = 'daily_goal_progress';

export function useDailyTimeTracker(
  onProgressUpdate?: (newTotal: number) => void
) {
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Local cache of current progress
  const currentProgress = useRef<number>(0);

  const startTracking = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      currentProgress.current += 1;
      await incrementDailyProgress(1);
      onProgressUpdate?.(currentProgress.current);
    }, 60_000); // every minute
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // Resumed
      startTracking();
    } else if (
      appState.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // Paused
      stopTracking();
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const init = async () => {
      currentProgress.current = await getTodayProgress();
      onProgressUpdate?.(currentProgress.current);
      startTracking();
    };

    init();

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      stopTracking();
      sub.remove();
    };
  }, []);
}

async function incrementDailyProgress(minutes: number) {
  const today = dayjs().format('YYYY-MM-DD');
  const stored = await AsyncStorage.getItem(DAILY_GOAL_KEY);
  const data = stored ? JSON.parse(stored) : {};

  data[today] = (data[today] || 0) + minutes;
  await AsyncStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(data));
}

export async function getTodayProgress(): Promise<number> {
  const today = dayjs().format('YYYY-MM-DD');
  const stored = await AsyncStorage.getItem(DAILY_GOAL_KEY);
  const data = stored ? JSON.parse(stored) : {};
  return data[today] || 0;
}
