import { useState, useEffect } from 'react';
import sseService from '../services/sseService';

// Hook to manage SSE connection and provide real-time photo updates
export const useSSE = (schoolId = null) => {
  const [connectionStatus, setConnectionStatus] = useState(sseService.getConnectionStatus());
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Update connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(sseService.getConnectionStatus());
    }, 1000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    if (!schoolId) return;

    const unsubscribe = sseService.subscribe(schoolId, (eventType, schoolId, data) => {
      setLastUpdate({
        eventType,
        schoolId,
        data,
        timestamp: new Date()
      });
    });

    return unsubscribe;
  }, [schoolId]);

  return {
    connectionStatus,
    lastUpdate,
    isConnected: connectionStatus.isConnected
  };
};

// Hook for global SSE updates (admin/dashboard views)
export const useSSEGlobal = () => {
  const [connectionStatus, setConnectionStatus] = useState(sseService.getConnectionStatus());
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Update connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(sseService.getConnectionStatus());
    }, 1000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    const unsubscribe = sseService.subscribeAll((eventType, schoolId, data) => {
      setLastUpdate({
        eventType,
        schoolId,
        data,
        timestamp: new Date()
      });
    });

    return unsubscribe;
  }, []);

  return {
    connectionStatus,
    lastUpdate,
    isConnected: connectionStatus.isConnected
  };
};