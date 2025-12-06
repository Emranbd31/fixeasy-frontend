
'use client';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [eircode, setEircode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{7,15}$/;
  const canSubmit =
    fullName.trim().length > 1 &&
    emailRegex.test(email) &&
    phoneRegex.test(phone) &&
    address.trim().length > 3 &&
    eircode.trim().length > 2 &&
    passwordRegex.test(password) &&
    password === confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError('Please fill in all fields');
      return;
    }
    // Simulate account creation
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setEircode('');
      setPassword('');
      setConfirmPassword('');
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center mt-16">Sign Up</h1>
        {/* Social Sign In Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition">
            <FcGoogle size={24} /> Sign up with Google
          </button>
          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition">
            <FaApple size={24} /> Sign up with Apple
          </button>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}
        {success ? (
          <div className="text-center">
            <div className="text-5xl mb-3">✅</div>
            <div className="font-bold text-blue-700 mb-2">Account Created!</div>
            <div className="text-sm text-gray-600">You can now book services and enjoy all benefits.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+353 87 123 4567" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Eircode <span className="text-red-500">*</span></label>
              <input type="text" value={eircode} onChange={e => setEircode(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters and include an uppercase letter, a number, and a special character.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition" required />
            </div>
            <button type="submit" disabled={!canSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}
