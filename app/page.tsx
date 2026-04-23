'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const FILTERS = ['All Events', 'Social', 'Sports', 'Academic', 'Arts', 'Volunteer'];

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  hashtags: string[];
  category: string;
  created_at?: string;
  updated_at?: string;
}

export default function Home() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social',
    tags: '',
  });

  // Fetch events from Supabase
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Convert time from "2:00 PM" to "14:00" format for time input
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  // Convert time from "14:00" to "2:00 PM" format
  const convertTo12Hour = (time24h: string) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const modifier = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${modifier}`;
  };

  // Filter and search events
  const filteredEvents = events.filter((event) => {
    const matchesFilter = activeFilter === 'All Events' || event.category === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Close modals with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setShowCreateForm(false);
        setEditingEvent(null);
        setDeletingEvent(null);
      }
    };

    if (selectedEvent || showCreateForm || editingEvent || deletingEvent) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedEvent, showCreateForm, editingEvent, deletingEvent]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          {/* Login Button */}
          <div className="flex justify-end mb-8">
            <a
              href="/login"
              className="px-5 py-2 text-sm border border-[var(--gray-900)] bg-[var(--gray-900)] text-white hover:bg-[var(--gray-800)] transition-colors"
            >
              Log In
            </a>
          </div>

          <div className="text-center">
            <h1 className="text-6xl font-semibold tracking-tight text-[var(--gray-900)] sm:text-7xl lg:text-8xl">
              TeamTartan
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)] tracking-wide">
              creating friendships
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full px-4 py-3 text-base border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--gray-400)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filters and Create Button */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-center">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-5 py-2.5 text-sm border border-[var(--gray-900)] bg-[var(--gray-900)] text-white hover:bg-[var(--gray-800)] transition-colors"
              >
                Create Event
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    activeFilter === filter
                      ? 'border-[var(--gray-900)] bg-[var(--gray-900)] text-white'
                      : 'border-[var(--border)] bg-white text-[var(--gray-700)] hover:border-[var(--gray-300)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[var(--muted)]">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[var(--muted)]">No events found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="aspect-square border border-[var(--border)] bg-white hover:border-[var(--gray-300)] transition-colors relative group"
            >
              <button
                onClick={() => setSelectedEvent(event)}
                className="w-full h-full p-4 text-left cursor-pointer"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--gray-900)] line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--muted)]">
                      {formatDate(event.date)} • {event.time}
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {event.location}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {event.participants.length} {event.participants.length === 1 ? 'participant' : 'participants'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Edit and Delete buttons */}
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingEvent(event);
                  }}
                  className="p-1.5 bg-white border border-[var(--border)] hover:border-[var(--gray-400)] transition-colors"
                  title="Edit event"
                >
                  <svg className="w-4 h-4 text-[var(--gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingEvent(event);
                  }}
                  className="p-1.5 bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 transition-colors"
                  title="Delete event"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </main>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white border border-[var(--border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[var(--border)] p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-[var(--gray-900)]">
                    {selectedEvent.title}
                  </h2>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                      <span>{formatDate(selectedEvent.date)}</span>
                      <span>•</span>
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors ml-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-900)] mb-2">Description</h3>
                <p className="text-sm text-[var(--gray-700)] leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Participants */}
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-900)] mb-3">
                  Participants ({selectedEvent.participants.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm border border-[var(--border)] bg-[var(--gray-50)] text-[var(--gray-700)]"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-900)] mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm text-[var(--muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[var(--border)] p-6">
              <button className="w-full py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors">
                Join Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="bg-white border border-[var(--border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form Header */}
            <div className="border-b border-[var(--border)] p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-[var(--gray-900)]">Create Event</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe your event"
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors bg-white"
                >
                  <option value="Social">Social</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Arts">Arts</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                  placeholder="Enter tags separated by commas (e.g., social, networking, fun)"
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                />
                <p className="mt-1.5 text-xs text-[var(--muted)]">Separate tags with commas</p>
              </div>
            </form>

            {/* Form Footer */}
            <div className="border-t border-[var(--border)] p-6 flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-3 border border-[var(--border)] bg-white text-[var(--gray-700)] text-sm font-medium hover:bg-[var(--gray-50)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault();

                  // Validate required fields
                  if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
                    alert('Please fill in all required fields.');
                    return;
                  }

                  try {
                    const { error } = await supabase
                      .from('events')
                      .insert([
                        {
                          title: newEvent.title,
                          description: newEvent.description,
                          date: newEvent.date,
                          time: convertTo12Hour(newEvent.time),
                          location: newEvent.location,
                          category: newEvent.category,
                          hashtags: newEvent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                          participants: [],
                        }
                      ]);

                    if (error) {
                      console.error('Error creating event:', error);
                      alert('Failed to create event. Please try again.');
                      return;
                    }

                    // Refresh events list
                    await fetchEvents();
                    setShowCreateForm(false);

                    // Reset form
                    setNewEvent({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      category: 'Social',
                      tags: '',
                    });
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to create event. Please try again.');
                  }
                }}
                className="flex-1 py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setEditingEvent(null)}
        >
          <div
            className="bg-white border border-[var(--border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form Header */}
            <div className="border-b border-[var(--border)] p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-[var(--gray-900)]">Edit Event</h2>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form className="p-6 space-y-6" id="edit-event-form">
              {/* Title */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  defaultValue={editingEvent.title}
                  placeholder="Enter event title"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingEvent.description}
                  placeholder="Describe your event"
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    defaultValue={editingEvent.date}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="edit-time" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    id="edit-time"
                    name="time"
                    defaultValue={convertTo24Hour(editingEvent.time)}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="edit-location" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="edit-location"
                  name="location"
                  defaultValue={editingEvent.location}
                  placeholder="Enter event location"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  defaultValue={editingEvent.category}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors bg-white"
                >
                  <option value="Social">Social</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Arts">Arts</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="edit-tags"
                  name="tags"
                  defaultValue={editingEvent.hashtags.join(', ')}
                  placeholder="Enter tags separated by commas (e.g., social, networking, fun)"
                  className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
                />
                <p className="mt-1.5 text-xs text-[var(--muted)]">Separate tags with commas</p>
              </div>
            </form>

            {/* Form Footer */}
            <div className="border-t border-[var(--border)] p-6 flex gap-3">
              <button
                onClick={() => setEditingEvent(null)}
                type="button"
                className="flex-1 py-3 border border-[var(--border)] bg-white text-[var(--gray-700)] text-sm font-medium hover:bg-[var(--gray-50)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    const form = document.getElementById('edit-event-form') as HTMLFormElement;
                    const formData = new FormData(form);

                    const { error } = await supabase
                      .from('events')
                      .update({
                        title: formData.get('title') as string,
                        description: formData.get('description') as string,
                        date: formData.get('date') as string,
                        time: convertTo12Hour(formData.get('time') as string),
                        location: formData.get('location') as string,
                        category: formData.get('category') as string,
                        hashtags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag),
                      })
                      .eq('id', editingEvent.id);

                    if (error) {
                      console.error('Error updating event:', error);
                      alert('Failed to update event. Please try again.');
                      return;
                    }

                    // Refresh events list
                    await fetchEvents();
                    setEditingEvent(null);
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to update event. Please try again.');
                  }
                }}
                type="button"
                className="flex-1 py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setDeletingEvent(null)}
        >
          <div
            className="bg-white border border-[var(--border)] max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-red-200 bg-red-50">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--gray-900)]">Delete Event</h3>
                  <p className="mt-2 text-sm text-[var(--gray-700)]">
                    Are you sure you want to delete &quot;{deletingEvent.title}&quot;? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[var(--border)] p-6 flex gap-3">
              <button
                onClick={() => setDeletingEvent(null)}
                className="flex-1 py-2.5 border border-[var(--border)] bg-white text-[var(--gray-700)] text-sm font-medium hover:bg-[var(--gray-50)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('events')
                      .delete()
                      .eq('id', deletingEvent.id);

                    if (error) {
                      console.error('Error deleting event:', error);
                      alert('Failed to delete event. Please try again.');
                      return;
                    }

                    // Refresh events list
                    await fetchEvents();
                    setDeletingEvent(null);
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to delete event. Please try again.');
                  }
                }}
                className="flex-1 py-2.5 border border-red-600 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
