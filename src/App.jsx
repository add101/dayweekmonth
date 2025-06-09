import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sun, Moon } from 'lucide-react'; // Added Sun and Moon icons

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
      <div className={`rounded-lg shadow-xl p-6 w-full max-w-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="time" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out ${darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-500' : 'bg-gray-200 text-gray-800 focus:ring-gray-400'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
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
    <div className={`p-6 rounded-lg shadow-md border min-h-[calc(100vh-180px)] flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{formattedDate}</h2>
      <div className="flex-grow">
        {dayEvents.length > 0 ? (
          <ul className="space-y-4">
            {dayEvents.map(event => (
              <li key={event.id} className={`p-4 rounded-lg shadow-sm border flex justify-between items-center ${darkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                <div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>{event.title}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.time} - {event.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditEvent(event)}
                    className={`p-2 rounded-full transition duration-150 ease-in-out ${darkMode ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    aria-label="Edit event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"></path></svg>
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className={`p-2 rounded-full transition duration-150 ease-in-out ${darkMode ? 'bg-red-800 text-red-200 hover:bg-red-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    aria-label="Delete event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No events for this day. Click the '+' button to add one!</p>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onAddEvent(currentDate)}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
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
    <div className={`p-6 rounded-lg shadow-md border min-h-[calc(100vh-180px)] flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
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
                ? (darkMode ? 'border-blue-700 bg-blue-950' : 'border-blue-400 bg-blue-50')
                : (darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50')
            }`}>
              <h3 className={`text-center font-semibold mb-2 ${isToday ? (darkMode ? 'text-blue-300' : 'text-blue-700') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>
                {formatDate(day, { weekday: 'short', day: 'numeric' })}
              </h3>
              <div className="flex-grow space-y-2 text-sm overflow-y-auto max-h-48 md:max-h-full">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <div key={event.id} className={`p-2 rounded-md shadow-sm border break-words ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-100' : 'bg-white border-gray-100 text-gray-800'}`}>
                      <p className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{event.title}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{event.time}</p>
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
                className="mt-2 flex items-center justify-center w-8 h-8 mx-auto bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
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
    <div className={`p-6 rounded-lg shadow-md border min-h-[calc(100vh-180px)] flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {formatDate(currentDate, { month: 'long', year: 'numeric' })}
      </h2>
      <div className={`grid grid-cols-7 gap-2 text-center text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  ? (darkMode ? 'bg-gray-700' : 'bg-gray-50')
                  : (darkMode ? 'bg-gray-800' : 'bg-gray-100')
              } ${
                isCurrentDay
                  ? (darkMode ? 'border-blue-700 bg-blue-950' : 'border-blue-500 bg-blue-100')
                  : (darkMode ? 'border-gray-600' : 'border-gray-200')
              } ${isToday && !isCurrentDay
                  ? (darkMode ? 'border-green-700 bg-green-900' : 'border-green-400 bg-green-50')
                  : ''
              }`}
            >
              {day ? (
                <>
                  <span className={`text-sm font-medium ${isCurrentDay ? (darkMode ? 'text-blue-300' : 'text-blue-800') : (darkMode ? 'text-gray-100' : 'text-gray-800')}`}>
                    {day.getDate()}
                  </span>
                  <div className="flex-grow overflow-y-auto text-xs space-y-0.5 mt-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`rounded-sm px-1 py-0.5 truncate cursor-pointer transition duration-150 ${darkMode ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-200 text-blue-900 hover:bg-blue-300'}`}
                        onClick={() => onEditEvent(event)}
                        title={`${event.time} - ${event.title}`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onAddEvent(day)}
                    className="absolute bottom-1 right-1 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
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
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // New state for dark mode

  // Function to toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

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
  const handleSaveEvent = useCallback((newEvent) => {
    setEvents(prevEvents => {
      const existingEventIndex = prevEvents.findIndex(e => e.id === newEvent.id);
      if (existingEventIndex > -1) {
        // Update existing event
        const updatedEvents = [...prevEvents];
        updatedEvents[existingEventIndex] = newEvent;
        return updatedEvents;
      } else {
        // Add new event
        return [...prevEvents, newEvent];
      }
    });
  }, []);

  // Function to delete an event
  const handleDeleteEvent = useCallback((idToDelete) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== idToDelete));
  }, []);

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
    <div className={`min-h-screen font-sans p-4 sm:p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        /* Custom scrollbar for event lists */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: ${darkMode ? '#333' : '#f1f1f1'};
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#555' : '#888'};
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#777' : '#555'};
        }
        `}
      </style>

      {/* Header for navigation and view selection */}
      <div className={`rounded-lg shadow-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <button
            onClick={goToPrevious}
            className={`p-2 rounded-full transition duration-150 ease-in-out shadow-sm ${darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className={`text-2xl font-bold text-center flex-grow min-w-[200px] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{getHeaderTitle()}</h1>
          <button
            onClick={goToNext}
            className={`p-2 rounded-full transition duration-150 ease-in-out shadow-sm ${darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* View Selection Buttons */}
        <div className={`flex space-x-2 p-1 rounded-full shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <button
            onClick={() => setCurrentView('day')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out ${
              currentView === 'day' ? 'bg-blue-600 text-white shadow-md' : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200')
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out ${
              currentView === 'week' ? 'bg-blue-600 text-white shadow-md' : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200')
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setCurrentView('month')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out ${
              currentView === 'month' ? 'bg-blue-600 text-white shadow-md' : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200')
            }`}
          >
            Month
          </button>
        </div>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition duration-150 ease-in-out shadow-sm mt-4 md:mt-0 ${
            darkMode ? 'bg-blue-700 text-blue-200 hover:bg-blue-600' : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>

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
