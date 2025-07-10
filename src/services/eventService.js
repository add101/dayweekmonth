import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

// Events collection reference
const getEventsCollection = () => collection(db, 'events');

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const event = {
      ...eventData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(getEventsCollection(), event);
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const eventRef = doc(db, 'events', eventId);
    const updateData = {
      ...eventData,
      updatedAt: serverTimestamp()
    };

    await updateDoc(eventRef, updateData);
    return { id: eventId, ...updateData };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Get all events for current user (real-time)
export const subscribeToEvents = (callback) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    getEventsCollection(),
    where('userId', '==', user.uid),
    orderBy('date', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    callback(events);
  });
};

// Get events for a specific date range
export const getEventsByDateRange = async (startDate, endDate) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      getEventsCollection(),
      where('userId', '==', user.uid),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (error) {
    console.error('Error getting events by date range:', error);
    throw error;
  }
}; 