'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    // Handle password reset logic here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--gray-900)]">
              TeamTartan
            </h1>
          </Link>

          <div className="border border-[var(--border)] p-8">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--gray-900)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-2">
              Check Your Email
            </h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors"
            >
              Back to Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-[var(--gray-900)]">Reset Password</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@andrew.cmu.edu"
              required
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Remember your password?{' '}
          <Link href="/login" className="text-[var(--gray-900)] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
