'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    year: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup data:', formData);
    // Handle signup logic here
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
          <h2 className="text-2xl font-semibold text-[var(--gray-900)]">Create Account</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Join the community and start creating friendships
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Year in College */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              Year in College
            </label>
            <select
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors bg-white"
            >
              <option value="">Select year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          {/* Profile Picture */}
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              Profile Picture <span className="text-[var(--muted)] font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="w-16 h-16 border border-[var(--border)] overflow-hidden flex-shrink-0">
                  <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label
                htmlFor="profilePicture"
                className="flex-1 px-4 py-2.5 text-sm border border-[var(--input-border)] hover:border-[var(--gray-400)] transition-colors cursor-pointer text-[var(--muted)] bg-white"
              >
                {formData.profilePicture ? formData.profilePicture.name : 'Choose file'}
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* CMU Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              CMU Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@andrew.cmu.edu"
              required
              pattern=".*@andrew\.cmu\.edu$"
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
            />
            <p className="mt-1.5 text-xs text-[var(--muted)]">Must be a valid CMU email address</p>
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
              minLength={8}
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--gray-900)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-2.5 text-sm border border-[var(--input-border)] focus:border-[var(--gray-400)] focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 border border-[var(--gray-900)] bg-[var(--gray-900)] text-white text-sm font-medium hover:bg-[var(--gray-800)] transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--gray-900)] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
