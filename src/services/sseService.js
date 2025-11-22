// SSE Service for real-time photo updates
class SSEService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.isConnected = false;
    this.isConnecting = false; // Add flag to prevent multiple connection attempts
  }

  connect() {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      console.log('📡 SSE connection already in progress, skipping...');
      return;
    }

    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      console.log('📡 SSE already connected or connecting, readyState:', this.eventSource.readyState);
      return; // Already connected or connecting
    }

    this.isConnecting = true;

    // Get base URL and ensure no trailing /api to avoid double /api/api
    const rawBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5010';
    const apiBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');
    const sseUrl = `${apiBaseUrl}/api/photos/events`;

    console.log('📡 Attempting SSE connection to:', sseUrl);

    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        console.log('📡 SSE connection established successfully');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Only log non-heartbeat messages to reduce console spam
          if (data.type !== 'connected') {
            console.log('📡 SSE message received:', data.type, data);
          }
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error, 'Raw data:', event.data);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error, 'ReadyState:', this.eventSource?.readyState);
        this.isConnected = false;
        this.isConnecting = false;
        
        if (this.eventSource.readyState === EventSource.CLOSED) {
          this.handleReconnect();
        }
      };

    } catch (error) {
      console.error('Error creating SSE connection:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  handleMessage(data) {
    const { type, schoolId } = data;

    switch (type) {
      case 'connected':
        // Only log initial connection, not every heartbeat
        if (!this.isConnected) {
          console.log('📡 SSE client connected:', data.clientId);
        }
        break;
      
      case 'photo_added':
        console.log('📸 New photo added via SSE');
        this.notifyListeners('photo_added', schoolId, data.data);
        break;
      
      case 'warden_photo_added':
        console.log('📸 New warden photo added via SSE');
        this.notifyListeners('warden_photo_added', schoolId, data.data);
        break;
      
      case 'warden_photo_status_updated':
        console.log('✅ Warden photo status updated via SSE');
        this.notifyListeners('warden_photo_status_updated', schoolId, data.data);
        break;
      
      case 'warden_photo_deleted':
        console.log('🗑️ Warden photo deleted via SSE');
        this.notifyListeners('warden_photo_deleted', schoolId, data.data);
        break;
      
      case 'photo_deleted':
        console.log('🗑️ Photo deleted via SSE');
        this.notifyListeners('photo_deleted', schoolId, data.data);
        break;
      
      case 'photos_refreshed':
        console.log('🔄 Photos refreshed via SSE for school:', schoolId);
        this.notifyListeners('photos_refreshed', schoolId, data.data);
        break;
      
      default:
        // Reduce logging for unknown message types
        if (type !== 'heartbeat' && type !== 'ping') {
          console.log('📡 Unknown SSE message type:', type);
        }
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max SSE reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting SSE reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Subscribe to photo updates for a specific school
  subscribe(schoolId, callback) {
    if (!this.listeners.has(schoolId)) {
      this.listeners.set(schoolId, new Set());
    }
    this.listeners.get(schoolId).add(callback);

    // Auto-connect if not already connected
    if (!this.isConnected) {
      this.connect();
    }

    // Return unsubscribe function
    return () => {
      const schoolListeners = this.listeners.get(schoolId);
      if (schoolListeners) {
        schoolListeners.delete(callback);
        if (schoolListeners.size === 0) {
          this.listeners.delete(schoolId);
        }
      }
    };
  }

  // Subscribe to all photo updates (for admin/dashboard views)
  subscribeAll(callback) {
    console.log('📡 Subscribing to all SSE events');
    const unsubscribe = this.subscribe('*', callback);
    
    // Ensure connection is established
    if (!this.isConnected && (!this.eventSource || this.eventSource.readyState === EventSource.CLOSED)) {
      console.log('📡 SSE not connected, initiating connection...');
      this.connect();
    }
    
    return unsubscribe;
  }

  notifyListeners(eventType, schoolId, data) {
    // Notify specific school listeners
    const schoolListeners = this.listeners.get(schoolId);
    if (schoolListeners) {
      schoolListeners.forEach(callback => {
        try {
          callback(eventType, schoolId, data);
        } catch (error) {
          console.error('Error in SSE listener callback:', error);
        }
      });
    }

    // Notify global listeners
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach(callback => {
        try {
          callback(eventType, schoolId, data);
        } catch (error) {
          console.error('Error in SSE global listener callback:', error);
        }
      });
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    this.listeners.clear();
    console.log('📡 SSE connection closed');
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      readyState: this.eventSource?.readyState,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const sseService = new SSEService();

export default sseService;