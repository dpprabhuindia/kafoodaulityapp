// SSE Service for real-time photo updates
class SSEService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.isConnected = false;
  }

  connect() {
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return; // Already connected or connecting
    }

    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5010';
    const sseUrl = `${apiBaseUrl}/api/photos/events`;

    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        console.log('📡 SSE connection established');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.isConnected = false;
        
        if (this.eventSource.readyState === EventSource.CLOSED) {
          this.handleReconnect();
        }
      };

    } catch (error) {
      console.error('Error creating SSE connection:', error);
      this.handleReconnect();
    }
  }

  handleMessage(data) {
    const { type, schoolId } = data;

    switch (type) {
      case 'connected':
        console.log('📡 SSE client connected:', data.clientId);
        break;
      
      case 'photo_added':
        console.log('📸 New photo added via SSE:', data.data);
        this.notifyListeners('photo_added', schoolId, data.data);
        break;
      
      case 'photo_deleted':
        console.log('🗑️ Photo deleted via SSE:', data.data);
        this.notifyListeners('photo_deleted', schoolId, data.data);
        break;
      
      case 'photos_refreshed':
        console.log('🔄 Photos refreshed via SSE for school:', schoolId);
        this.notifyListeners('photos_refreshed', schoolId, data.data);
        break;
      
      default:
        console.log('📡 SSE message:', data);
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
    return this.subscribe('*', callback);
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
      readyState: this.eventSource?.readyState,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const sseService = new SSEService();

export default sseService;