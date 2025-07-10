import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  subscribeToEvents
} from '../services/eventService';
import { 
  signInWithGoogle, 
  signOut, 
  getCurrentUser, 
  onAuthStateChange 
} from '../services/authService';

// Local storage helpers
const LOCAL_STORAGE_KEY = 'task-scheduler-events';

const getLocalEvents = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading local events:', error);
    return [];
  }
};

const saveLocalEvents = (events) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving local events:', error);
  }
};

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    user: null,
    events: getLocalEvents(), // Start with local events
    loading: false,
    error: null,
    darkMode: localStorage.getItem('darkMode') === 'true',

    // Auth actions
    signIn: async () => {
      set({ loading: true, error: null });
      try {
        const { user, error } = await signInWithGoogle();
        if (error) throw error;
        set({ user, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    signOut: async () => {
      set({ loading: true, error: null });
      try {
        const { error } = await signOut();
        if (error) throw error;
        set({ user: null, events: getLocalEvents(), loading: false }); // Fall back to local events
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    checkAuth: async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          set({ user });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    },

    // Event actions
    addEvent: async (eventData) => {
      const { user } = get();
      
      if (user) {
        // User is authenticated - save to Firebase
        set({ loading: true, error: null });
        try {
          const newEvent = await createEvent(eventData);
          set(state => ({
            events: [...state.events, newEvent],
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      } else {
        // User is not authenticated - save locally
        const newEvent = {
          ...eventData,
          id: Date.now().toString(), // Simple ID for local events
          userId: 'local',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => {
          const updatedEvents = [...state.events, newEvent];
          saveLocalEvents(updatedEvents);
          return { events: updatedEvents };
        });
      }
    },

    updateEvent: async (eventId, eventData) => {
      const { user } = get();
      
      if (user) {
        // User is authenticated - update in Firebase
        set({ loading: true, error: null });
        try {
          const updatedEvent = await updateEvent(eventId, eventData);
          set(state => ({
            events: state.events.map(event => 
              event.id === eventId ? updatedEvent : event
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      } else {
        // User is not authenticated - update locally
        set(state => {
          const updatedEvents = state.events.map(event => 
            event.id === eventId 
              ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
              : event
          );
          saveLocalEvents(updatedEvents);
          return { events: updatedEvents };
        });
      }
    },

    deleteEvent: async (eventId) => {
      const { user } = get();
      
      if (user) {
        // User is authenticated - delete from Firebase
        set({ loading: true, error: null });
        try {
          await deleteEvent(eventId);
          set(state => ({
            events: state.events.filter(event => event.id !== eventId),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      } else {
        // User is not authenticated - delete locally
        set(state => {
          const updatedEvents = state.events.filter(event => event.id !== eventId);
          saveLocalEvents(updatedEvents);
          return { events: updatedEvents };
        });
      }
    },

    // UI actions
    toggleDarkMode: () => {
      set(state => {
        const newDarkMode = !state.darkMode;
        localStorage.setItem('darkMode', newDarkMode.toString());
        return { darkMode: newDarkMode };
      });
    },

    clearError: () => set({ error: null }),

    // Initialize store
    initialize: () => {
      const { checkAuth } = get();
      
      // Check auth state
      checkAuth();
      
      // Set up auth state listener
      const unsubscribeAuth = onAuthStateChange((user) => {
        if (user) {
          // User signed in - switch to Firebase events
          set({ user });
        } else {
          // User signed out - switch back to local events
          set({ user: null, events: getLocalEvents() });
        }
      });

      // Set up real-time events subscription (only when authenticated)
      let unsubscribeEvents = () => {};
      
      const setupEventSubscription = () => {
        const { user } = get();
        if (user) {
          unsubscribeEvents = subscribeToEvents((events) => {
            set({ events });
          });
        }
      };

      // Initial setup
      setupEventSubscription();

      // Return cleanup function
      return () => {
        unsubscribeAuth();
        unsubscribeEvents();
      };
    }
  }))
);

export default useStore; 