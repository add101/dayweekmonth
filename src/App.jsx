import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sun, Moon } from 'lucide-react';
import useStore from './store/useStore';
import Auth from './components/Auth';
import ErrorNotification from './components/ErrorNotification';

// Helper function to format dates
const formatDate = (date, options = {}) => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Helper function to get the start of the week (Sunday)
const getStartOfWeek = (date) => {
  const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const diff = date.getDate() - day; // Adjust to Sunday
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

// Helper function to get days in a month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the first day of the month
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
};

// Event Modal Component
const EventModal = ({ isOpen, onClose, onSave, date, eventToEdit, darkMode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setTime(eventToEdit.time);
    } else {
      setTitle('');
      setDescription('');
      setTime('09:00');
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: eventToEdit ? eventToEdit.id : Date.now(), // Use existing ID or generate new one
      date: formatDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time,
      title,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl p-6 w-full max-w-md border ${darkMode ? 'moon-border bg-[#1f2747]/90 backdrop-blur-sm' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-[#e5de44]' : 'text-gray-800'}`}>{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#e5de44] focus:border-[#e5de44] sm:text-sm ${darkMode ? 'bg-[#1c375c]/50 border-[#e5de44]/30 text-slate-100 placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#e5de44] focus:border-[#e5de44] sm:text-sm ${darkMode ? 'bg-[#1c375c]/50 border-[#e5de44]/30 text-slate-100 placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900'}`}
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="time" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#e5de44] focus:border-[#e5de44] sm:text-sm ${darkMode ? 'bg-[#1c375c]/50 border-[#e5de44]/30 text-slate-100' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out ${darkMode ? 'bg-[#1c375c] text-slate-200 hover:bg-[#1c375c]/80 focus:ring-[#e5de44]' : 'bg-gray-200 text-gray-800 focus:ring-gray-400'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md ${darkMode ? 'bg-[#e5de44] text-[#151633] hover:bg-[#e5de44]/90 focus:ring-[#e5de44] moon-glow' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
            >
              {eventToEdit ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Day View Component
const DayView = ({ currentDate, events, onAddEvent, onEditEvent, onDeleteEvent, darkMode }) => {
  const formattedDate = formatDate(currentDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayEvents = events.filter(event =>
    event.date === formatDate(currentDate, { year: 'numeric', month: '2-digit', day: '2-digit' })
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className={`p-6 rounded-lg shadow-md border min-h-[calc(100vh-180px)] flex flex-col ${darkMode ? 'moon-border bg-[#1f2747]/50 backdrop-blur-sm' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>{formattedDate}</h2>
      <div className="flex-grow">
        {dayEvents.length > 0 ? (
          <ul className="space-y-4">
            {dayEvents.map(event => (
              <li key={event.id} className={`p-4 rounded-lg shadow-sm border flex justify-between items-center ${darkMode ? 'bg-[#1c375c]/30 border-[#e5de44]/30 moon-glow' : 'bg-blue-50 border-blue-100'}`}>
                <div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-[#e5de44]' : 'text-blue-800'}`}>{event.title}</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{event.time} - {event.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditEvent(event)}
                    className={`p-2 rounded-full transition duration-150 ease-in-out ${darkMode ? 'bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    aria-label="Edit event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"></path></svg>
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className={`p-2 rounded-full transition duration-150 ease-in-out ${darkMode ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    aria-label="Delete event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-center py-10 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>No events for this day. Click the '+' button to add one!</p>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onAddEvent(currentDate)}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out ${darkMode ? 'bg-[#e5de44] text-[#151633] hover:bg-[#e5de44]/90 focus:ring-[#e5de44] moon-glow' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
          aria-label="Add new event"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

// Week View Component
const WeekView = ({ currentDate, events, onAddEvent, onEditEvent, onDeleteEvent, darkMode }) => {
  const startOfWeek = getStartOfWeek(currentDate);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfWeek && eventDate < new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7);
  });

  return (
    <div className={`p-6 rounded-lg shadow-md border min-h-[calc(100vh-180px)] flex flex-col ${darkMode ? 'moon-border bg-[#1f2747]/50 backdrop-blur-sm' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>
        Week of {formatDate(startOfWeek, { month: 'long', day: 'numeric', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 flex-grow">
        {days.map(day => {
          const formattedDay = formatDate(day, { year: 'numeric', month: '2-digit', day: '2-digit' });
          const dayEvents = weekEvents.filter(event => event.date === formattedDay).sort((a, b) => a.time.localeCompare(b.time));
          const isToday = formatDate(day, { year: 'numeric', month: '2-digit', day: '2-digit' }) === formatDate(new Date(), { year: 'numeric', month: '2-digit', day: '2-digit' });

          return (
            <div key={formattedDay} className={`p-3 rounded-lg border flex flex-col ${
              isToday
                ? (darkMode ? 'border-[#e5de44] bg-[#e5de44]/10' : 'border-blue-400 bg-blue-50')
                : (darkMode ? 'border-[#e5de44]/30 bg-[#1c375c]/30' : 'border-gray-200 bg-gray-50')
            }`}>
              <h3 className={`text-center font-semibold mb-2 ${isToday ? (darkMode ? 'text-[#e5de44]' : 'text-blue-700') : (darkMode ? 'text-[#e5de44]' : 'text-gray-700')}`}>
                {formatDate(day, { weekday: 'short', day: 'numeric' })}
              </h3>
              <div className="flex-grow space-y-2 text-sm overflow-y-auto max-h-48 md:max-h-full">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <div key={event.id} className={`p-2 rounded-md shadow-sm border break-words ${darkMode ? 'bg-[#151633]/50 border-[#e5de44]/20 text-slate-100' : 'bg-white border-gray-100 text-gray-800'}`}>
                      <p className={`font-medium ${darkMode ? 'text-[#e5de44]' : 'text-blue-600'}`}>{event.title}</p>
                      <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>{event.time}</p>
                      <div className="flex justify-end space-x-1 mt-1">
                        <button
                          onClick={() => onEditEvent(event)}
                          className={`p-1 rounded-full transition duration-150 ${darkMode ? 'text-yellow-400 hover:bg-yellow-900' : 'text-yellow-600 hover:bg-yellow-100'}`}
                          aria-label="Edit event"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2 0 0 1 3 3L12 15l-4 1 1-4Z"></path></svg>
                        </button>
                        <button
                          onClick={() => onDeleteEvent(event.id)}
                          className={`p-1 rounded-full transition duration-150 ${darkMode ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-100'}`}
                          aria-label="Delete event"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No events</p>
                )}
              </div>
              <button
                onClick={() => onAddEvent(day)}
                className={`mt-2 flex items-center justify-center w-8 h-8 mx-auto rounded-full shadow-md transition duration-150 ease-in-out ${darkMode ? 'bg-[#e5de44] text-[#151633] hover:bg-[#e5de44]/90' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                aria-label={`Add event for ${formatDate(day, { month: 'short', day: 'numeric' })}`}
              >
                <Plus size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Month View Component
const MonthView = ({ currentDate, events, onAddEvent, onEditEvent, onDeleteEvent, darkMode }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month); // 0 for Sunday

  const days = [];
  // Fill leading empty days
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Fill days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const monthEventsMap = new Map();
  events.forEach(event => {
    const eventDate = new Date(event.date);
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const dayKey = eventDate.getDate();
      if (!monthEventsMap.has(dayKey)) {
        monthEventsMap.set(dayKey, []);
      }
      monthEventsMap.get(dayKey).push(event);
    }
  });

  return (
    <div className={`p-6 rounded-lg shadow-md border min-h-[calc(100vh-180px)] flex flex-col ${darkMode ? 'moon-border bg-[#1f2747]/50 backdrop-blur-sm' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>
        {formatDate(currentDate, { month: 'long', year: 'numeric' })}
      </h2>
      <div className={`grid grid-cols-7 gap-2 text-center text-sm font-semibold mb-2 ${darkMode ? 'text-[#e5de44]' : 'text-gray-600'}`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 flex-grow">
        {days.map((day, index) => {
          const isCurrentDay = day && formatDate(day, { year: 'numeric', month: '2-digit', day: '2-digit' }) === formatDate(currentDate, { year: 'numeric', month: '2-digit', day: '2-digit' });
          const isToday = day && formatDate(day, { year: 'numeric', month: '2-digit', day: '2-digit' }) === formatDate(new Date(), { year: 'numeric', month: '2-digit', day: '2-digit' });
          const dayEvents = day ? monthEventsMap.get(day.getDate()) || [] : [];

          return (
            <div
              key={index}
              className={`relative h-28 p-1 rounded-lg border flex flex-col ${
                day
                  ? (darkMode ? 'bg-[#1c375c]/30' : 'bg-gray-50')
                  : (darkMode ? 'bg-[#151633]/20' : 'bg-gray-100')
              } ${
                isCurrentDay
                  ? (darkMode ? 'border-[#e5de44] bg-[#e5de44]/10' : 'border-blue-500 bg-blue-100')
                  : (darkMode ? 'border-[#e5de44]/30' : 'border-gray-200')
              } ${isToday && !isCurrentDay
                  ? (darkMode ? 'border-[#e5de44] bg-[#e5de44]/5' : 'border-green-400 bg-green-50')
                  : ''
              }`}
            >
              {day ? (
                <>
                  <span className={`text-sm font-medium ${isCurrentDay ? (darkMode ? 'text-[#e5de44]' : 'text-blue-800') : (darkMode ? 'text-slate-100' : 'text-gray-800')}`}>
                    {day.getDate()}
                  </span>
                  <div className="flex-grow overflow-y-auto text-xs space-y-0.5 mt-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`rounded-sm px-1 py-0.5 truncate cursor-pointer transition duration-150 ${darkMode ? 'bg-[#e5de44]/20 text-[#e5de44] hover:bg-[#e5de44]/30 border border-[#e5de44]/30' : 'bg-blue-200 text-blue-900 hover:bg-blue-300'}`}
                        onClick={() => onEditEvent(event)}
                        title={`${event.time} - ${event.title}`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onAddEvent(day)}
                    className={`absolute bottom-1 right-1 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition duration-150 ease-in-out ${darkMode ? 'bg-[#e5de44] text-[#151633] hover:bg-[#e5de44]/90' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    aria-label={`Add event for ${day.getDate()}`}
                  >
                    <Plus size={14} />
                  </button>
                </>
              ) : (
                <div className="text-gray-400"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month'); // 'day', 'week', 'month'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  
  // Get state from store
  const { 
    user, 
    events, 
    darkMode, 
    toggleDarkMode, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    initialize 
  } = useStore();

  // Initialize store on component mount
  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  // Function to handle adding a new event
  const handleAddEvent = useCallback((date) => {
    setSelectedDateForModal(date);
    setEventToEdit(null); // Ensure we're adding, not editing
    setIsModalOpen(true);
  }, []);

  // Function to handle editing an existing event
  const handleEditEvent = useCallback((event) => {
    setSelectedDateForModal(new Date(event.date));
    setEventToEdit(event);
    setIsModalOpen(true);
  }, []);

  // Function to save an event (add or update)
  const handleSaveEvent = useCallback(async (newEvent) => {
    if (eventToEdit) {
      await updateEvent(newEvent.id, newEvent);
    } else {
      await addEvent(newEvent);
    }
    setIsModalOpen(false);
    setEventToEdit(null);
  }, [eventToEdit, addEvent, updateEvent]);

  // Function to delete an event
  const handleDeleteEvent = useCallback(async (idToDelete) => {
    await deleteEvent(idToDelete);
  }, [deleteEvent]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (currentView === 'day') {
        newDate.setDate(prevDate.getDate() - 1);
      } else if (currentView === 'week') {
        newDate.setDate(prevDate.getDate() - 7);
      } else if (currentView === 'month') {
        newDate.setMonth(prevDate.getMonth() - 1);
      }
      return newDate;
    });
  }, [currentView]);

  const goToNext = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (currentView === 'day') {
        newDate.setDate(prevDate.getDate() + 1);
      } else if (currentView === 'week') {
        newDate.setDate(prevDate.getDate() + 7);
      } else if (currentView === 'month') {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  }, [currentView]);

  // Determine header title based on current view
  const getHeaderTitle = useCallback(() => {
    if (currentView === 'day') {
      return formatDate(currentDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } else if (currentView === 'week') {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${formatDate(startOfWeek, { month: 'short', day: 'numeric' })} - ${formatDate(endOfWeek, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (currentView === 'month') {
      return formatDate(currentDate, { month: 'long', year: 'numeric' });
    }
    return '';
  }, [currentDate, currentView]);

  return (
    <div className={`min-h-screen font-sans p-4 sm:p-6 ${darkMode ? 'bg-gradient-to-br from-[#151633] via-[#1f2747] to-[#1c375c] text-slate-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        
        /* Night sky background with subtle stars */
        .night-sky-bg {
          background: radial-gradient(ellipse at top, #1f2747 0%, #151633 50%, #0f172a 100%);
          position: relative;
        }
        
        .night-sky-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #ffffff15, transparent),
            radial-gradient(2px 2px at 40px 70px, #ffffff10, transparent),
            radial-gradient(1px 1px at 90px 40px, #ffffff08, transparent),
            radial-gradient(1px 1px at 130px 80px, #ffffff15, transparent),
            radial-gradient(2px 2px at 160px 30px, #ffffff10, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: twinkle 6s ease-in-out infinite alternate;
          pointer-events: none;
        }
        
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
        
        /* Custom scrollbar for event lists */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: ${darkMode ? '#151633' : '#f1f1f1'};
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#1c375c' : '#888'};
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#e5de44' : '#555'};
        }
        
        /* Moon glow effects */
        .moon-glow {
          box-shadow: 0 0 20px rgba(229, 222, 68, 0.15);
        }
        
        .moon-border {
          border: 1px solid rgba(229, 222, 68, 0.3);
          background: linear-gradient(135deg, rgba(229, 222, 68, 0.05) 0%, rgba(229, 222, 68, 0.02) 100%);
        }
        `}
      </style>

      {/* Error Notification */}
      <ErrorNotification />

      {/* Header with Authentication */}
      <div className={`rounded-lg shadow-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between border ${darkMode ? 'moon-border moon-glow bg-[#1f2747]/50 backdrop-blur-sm' : 'bg-white border-gray-200'}`}>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <button
            onClick={goToPrevious}
            className={`p-2 rounded-full transition duration-150 ease-in-out shadow-sm ${darkMode ? 'bg-[#1c375c]/50 text-[#e5de44] hover:bg-[#e5de44]/20 hover:text-[#e5de44] border border-[#e5de44]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className={`text-2xl font-bold text-center flex-grow min-w-[200px] ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>{getHeaderTitle()}</h1>
          <button
            onClick={goToNext}
            className={`p-2 rounded-full transition duration-150 ease-in-out shadow-sm ${darkMode ? 'bg-[#1c375c]/50 text-[#e5de44] hover:bg-[#e5de44]/20 hover:text-[#e5de44] border border-[#e5de44]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* View Selection Buttons */}
        <div className={`flex space-x-2 p-1 rounded-full shadow-inner ${darkMode ? 'bg-[#1c375c]/30 border border-[#e5de44]/20' : 'bg-gray-100'}`}>
          <button
            onClick={() => setCurrentView('day')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out ${
              currentView === 'day' ? 'bg-[#e5de44] text-[#151633] shadow-lg' : (darkMode ? 'text-slate-300 hover:bg-[#e5de44]/20 hover:text-[#e5de44]' : 'text-gray-700 hover:bg-gray-200')
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out ${
              currentView === 'week' ? 'bg-[#e5de44] text-[#151633] shadow-lg' : (darkMode ? 'text-slate-300 hover:bg-[#e5de44]/20 hover:text-[#e5de44]' : 'text-gray-700 hover:bg-gray-200')
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setCurrentView('month')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out ${
              currentView === 'month' ? 'bg-[#e5de44] text-[#151633] shadow-lg' : (darkMode ? 'text-slate-300 hover:bg-[#e5de44]/20 hover:text-[#e5de44]' : 'text-gray-700 hover:bg-gray-200')
            }`}
          >
            Month
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Authentication */}
          <Auth />
          
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition duration-150 ease-in-out shadow-sm ${
              darkMode ? 'bg-[#e5de44] text-[#151633] hover:bg-[#e5de44]/90 moon-glow' : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 hover:from-yellow-500 hover:to-orange-500'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </div>

      {/* Show sync status for unauthenticated users */}
      {!user && (
        <div className={`mb-4 p-3 rounded-lg border ${darkMode ? 'moon-border bg-[#1f2747]/30 text-[#e5de44]' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
              Events are saved locally. Sign in to sync across devices and access your data from anywhere.
            </span>
          </div>
        </div>
      )}

      {/* Render the current view */}
      {currentView === 'day' && (
        <DayView
          currentDate={currentDate}
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          darkMode={darkMode}
        />
      )}
      {currentView === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          darkMode={darkMode}
        />
      )}
      {currentView === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          darkMode={darkMode}
        />
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        date={selectedDateForModal}
        eventToEdit={eventToEdit}
        darkMode={darkMode}
      />
    </div>
  );
};

export default App;
