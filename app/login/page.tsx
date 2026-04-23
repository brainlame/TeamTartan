'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Handle login logic here
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
            className="w-full py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors"
          >
            Log In
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
