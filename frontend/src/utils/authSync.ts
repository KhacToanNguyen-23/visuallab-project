// Cross-tab authentication synchronization utility
const CHANNEL_NAME = 'edulab_auth_sync_channel';
const STORAGE_KEY = 'edulab_auth_sync_event';

let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    channel = null;
  }
}

export type AuthSyncEvent = {
  type: 'VERIFY_SUCCESS' | 'ONBOARDING_COMPLETED' | 'LOGIN_SUCCESS' | 'LOGOUT';
  email?: string;
  onboardingCompleted?: boolean;
  timestamp: number;
};

export const broadcastAuthEvent = (event: Omit<AuthSyncEvent, 'timestamp'>) => {
  const payload: AuthSyncEvent = {
    ...event,
    timestamp: Date.now(),
  };

  try {
    channel?.postMessage(payload);
  } catch (e) {
    // Ignore postMessage error
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // Ignore localStorage error
  }
};

export const subscribeAuthEvent = (callback: (event: AuthSyncEvent) => void) => {
  const handleMessage = (e: MessageEvent) => {
    if (e.data && e.data.type) {
      callback(e.data as AuthSyncEvent);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        if (data && data.type) {
          callback(data as AuthSyncEvent);
        }
      } catch (err) {
        // Ignore parse error
      }
    }
  };

  if (channel) {
    channel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
};
