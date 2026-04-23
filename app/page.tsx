'use client';

import { useState, useEffect } from 'react';

const FILTERS = ['All Events', 'Social', 'Sports', 'Academic', 'Arts', 'Volunteer'];

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  participants: string[];
  hashtags: string[];
  category: string;
}

// Sample event data
const EVENTS: Event[] = [
  {
    id: 1,
    title: 'Coffee Chat Meetup',
    description: 'Join us for an informal coffee chat to meet new people and discuss shared interests. Perfect for making new friends on campus.',
    date: '2026-04-25',
    time: '2:00 PM',
    participants: ['Alex Chen', 'Jamie Park', 'Sam Rodriguez', 'Taylor Kim'],
    hashtags: ['coffee', 'networking', 'social'],
    category: 'Social',
  },
  {
    id: 2,
    title: 'Basketball Pickup Game',
    description: 'Weekly pickup basketball game at the rec center. All skill levels welcome. Bring your own water bottle.',
    date: '2026-04-26',
    time: '6:30 PM',
    participants: ['Marcus Johnson', 'Riley Davis', 'Jordan Lee'],
    hashtags: ['basketball', 'sports', 'fitness'],
    category: 'Sports',
  },
  {
    id: 3,
    title: 'Study Group - CS Theory',
    description: 'Group study session for Computer Science Theory. Working through problem sets and preparing for upcoming exams.',
    date: '2026-04-27',
    time: '4:00 PM',
    participants: ['Priya Patel', 'David Wang', 'Emma Thompson', 'Chris Martinez', 'Sophia Liu'],
    hashtags: ['study', 'computerscience', 'academic'],
    category: 'Academic',
  },
  {
    id: 4,
    title: 'Open Mic Night',
    description: 'Showcase your talents at our monthly open mic night. Music, poetry, comedy - all performances welcome.',
    date: '2026-04-28',
    time: '7:00 PM',
    participants: ['Aiden Murphy', 'Luna Garcia'],
    hashtags: ['music', 'performance', 'arts'],
    category: 'Arts',
  },
  {
    id: 5,
    title: 'Community Garden Workday',
    description: 'Help maintain the community garden. We will be planting spring vegetables and weeding. Tools and gloves provided.',
    date: '2026-04-29',
    time: '10:00 AM',
    participants: ['Olivia Brown', 'Noah Wilson', 'Ava Anderson', 'Ethan Moore'],
    hashtags: ['volunteer', 'sustainability', 'outdoors'],
    category: 'Volunteer',
  },
  {
    id: 6,
    title: 'Game Night',
    description: 'Board games, card games, and video games. Bring your favorite games or try something new. Snacks provided.',
    date: '2026-04-30',
    time: '7:30 PM',
    participants: ['Mason Taylor', 'Isabella Thomas', 'Lucas Jackson', 'Mia White', 'Logan Harris', 'Harper Martin'],
    hashtags: ['games', 'social', 'fun'],
    category: 'Social',
  },
  {
    id: 7,
    title: 'Ultimate Frisbee Practice',
    description: 'Practice session for our ultimate frisbee club. New players always welcome to join and learn.',
    date: '2026-05-01',
    time: '5:00 PM',
    participants: ['Benjamin Clark', 'Amelia Lewis', 'Henry Robinson'],
    hashtags: ['frisbee', 'sports', 'team'],
    category: 'Sports',
  },
  {
    id: 8,
    title: 'Tutoring Session - Math',
    description: 'Free math tutoring for Calculus I and II. Drop-in format, bring your questions and homework.',
    date: '2026-05-02',
    time: '3:00 PM',
    participants: ['Charlotte Walker', 'James Hall'],
    hashtags: ['tutoring', 'math', 'academic'],
    category: 'Academic',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter and search events
  const filteredEvents = EVENTS.filter((event) => {
    const matchesFilter = activeFilter === 'All Events' || event.category === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
    };

    if (selectedEvent) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedEvent]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
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

          {/* Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
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
      </header>

      {/* Events Grid */}
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="aspect-square border border-[var(--border)] bg-white hover:border-[var(--gray-300)] transition-colors cursor-pointer p-4 text-left"
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
                  <p className="text-xs text-[var(--muted)]">
                    {event.participants.length} {event.participants.length === 1 ? 'participant' : 'participants'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
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
                  <div className="mt-2 flex items-center gap-4 text-sm text-[var(--muted)]">
                    <span>{formatDate(selectedEvent.date)}</span>
                    <span>•</span>
                    <span>{selectedEvent.time}</span>
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
    </div>
  );
}
