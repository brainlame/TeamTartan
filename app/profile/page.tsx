'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@/utils/supabase/client';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const supabase = createClient();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    if (!user) return;

    try {
      // Fetch events created by user
      const { data: created, error: createdError } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', user.id)
        .order('date', { ascending: true });

      if (!createdError && created) {
        setMyEvents(created);
      }

      // Fetch events user has joined
      const { data: joined, error: joinedError } = await supabase
        .from('events')
        .select('*')
        .contains('participants', [user.id])
        .order('date', { ascending: true });

      if (!joinedError && joined) {
        setJoinedEvents(joined);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--gray-900)] transition-colors">
            ← Back to Events
          </Link>
        </div>

        {/* Profile Info */}
        <div className="border border-[var(--border)] p-8 mb-8">
          <div className="flex items-start gap-6">
            {profile.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt="Profile"
                className="w-24 h-24 object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-[var(--gray-200)] flex items-center justify-center">
                <span className="text-2xl font-medium text-[var(--gray-600)]">
                  {profile.first_name[0]}{profile.last_name[0]}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-[var(--muted)] mb-1">{profile.year}</p>
              <p className="text-[var(--muted)]">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Events Sections */}
        <div className="space-y-8">
          {/* My Events */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-4">My Events</h2>
            {loadingEvents ? (
              <p className="text-[var(--muted)]">Loading events...</p>
            ) : myEvents.length === 0 ? (
              <p className="text-[var(--muted)]">You haven't created any events yet.</p>
            ) : (
              <div className="space-y-3">
                {myEvents.map((event) => (
                  <Link
                    key={event.id}
                    href="/"
                    className="block border border-[var(--border)] p-4 hover:border-[var(--gray-300)] transition-colors"
                  >
                    <h3 className="font-medium text-[var(--gray-900)] mb-1">{event.title}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {formatDate(event.date)} • {event.time} • {event.location}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Joined Events */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-4">Joined Events</h2>
            {loadingEvents ? (
              <p className="text-[var(--muted)]">Loading events...</p>
            ) : joinedEvents.length === 0 ? (
              <p className="text-[var(--muted)]">You haven't joined any events yet.</p>
            ) : (
              <div className="space-y-3">
                {joinedEvents.map((event) => (
                  <Link
                    key={event.id}
                    href="/"
                    className="block border border-[var(--border)] p-4 hover:border-[var(--gray-300)] transition-colors"
                  >
                    <h3 className="font-medium text-[var(--gray-900)] mb-1">{event.title}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {formatDate(event.date)} • {event.time} • {event.location}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
