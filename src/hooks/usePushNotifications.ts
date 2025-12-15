import { useState, useEffect, useCallback } from 'react';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      
      // Check if already subscribed
      const subscribed = localStorage.getItem('push-notifications-subscribed') === 'true';
      setIsSubscribed(subscribed);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setIsSubscribed(true);
        localStorage.setItem('push-notifications-subscribed', 'true');
        
        // Show a welcome notification
        showNotification(
          'Notifications activées !',
          'Vous recevrez les dernières actualités de PANA RADIO.',
          '/pana-radio-192.png'
        );
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '/pana-radio-192.png',
        badge: '/pana-radio-192.png',
        tag: 'pana-radio-notification',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [permission]);

  const unsubscribe = useCallback(() => {
    setIsSubscribed(false);
    localStorage.removeItem('push-notifications-subscribed');
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    showNotification,
    unsubscribe,
  };
};
