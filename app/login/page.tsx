'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--gray-900)]">
              TeamTartan
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-[var(--gray-900)]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Log in to continue creating friendships
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@andrew.cmu.edu"
              required
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-[var(--muted)] hover:text-[var(--gray-900)] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--gray-900)] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
