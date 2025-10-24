'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabaseClient'

export default function UserRegisterPage() {
    const router = useRouter()
    const sb = createSupabaseBrowserClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Form fields
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    function validatePassword(pw: string) {
        // At least 8 chars, one special symbol, one number, one uppercase
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('Please fill in all required fields')
            return
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters, include an uppercase letter, a number, and a special symbol')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        // Validate phone format (basic)
        const phoneRegex = /^[\d\s\+\-\(\)]+$/
        if (!phoneRegex.test(phone)) {
            setError('Please enter a valid phone number')
            return
        }

        setLoading(true)
        try {
            // Create auth user with email verification
            const { data: signUpData, error: signUpError } = await sb.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'client',
                        name,
                        phone
                    },
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            })

            if (signUpError) throw signUpError

            if (!signUpData.user) {
                throw new Error('Registration failed. Please try again.')
            }

            setSuccess(true)
        } catch (e: any) {
            setError(e.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 pt-28 pb-12">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">📧</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Check Your Email!</h1>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification link to <strong>{email}</strong>. Please check your email and click the link to verify your account.
                    </p>
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>Important:</strong> Check your spam/junk folder if you don't see the email within a few minutes.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-28 md:pt-36 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        Create Your Account
                    </h1>
                    <p className="text-lg text-gray-600">
                        Join FixEasy and book trusted professionals in minutes
                    </p>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12">
                        {error && (
                            <div className="mb-8 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700">
                                <p className="font-semibold">⚠️ {error}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">We'll send a verification email to this address</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+353 87 123 4567"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 symbol"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Use a strong password with letters, numbers, and symbols</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="mb-8">
                            <div className="flex flex-col gap-4">
                                <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition">
                                    <img src="/images/services/google-logo.png" alt="Google" className="w-6 h-6" />
                                    Sign up with Google
                                </button>
                                <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition">
                                    <img src="/images/services/apple-logo.png" alt="Apple" className="w-6 h-6" />
                                    Sign up with Apple
                                </button>
                            </div>
                        </div>
                        {/* Terms & Submit */}
                        <div className="pt-6 mt-6 border-t border-gray-200">
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    By creating an account, you agree to FixEasy's{' '}
                                    <Link href="/terms" className="text-blue-600 hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-blue-600 hover:underline">
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Your Account...
                                    </span>
                                ) : (
                                    '680 Create Account'
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-600 mt-6">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                                    Sign In
                                </Link>
                                {' '}|{' '}
                                <Link href="/forgot-password" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                                    Forgot/Reset Password?
                                </Link>
                            </p>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Are you a professional?{' '}
                                <Link href="/register/professional" className="text-green-600 font-semibold hover:text-green-700 transition">
                                    Register as Pro
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Benefits */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="font-bold text-gray-900 mb-2">Secure & Safe</h3>
                        <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="font-bold text-gray-900 mb-2">Quick Setup</h3>
                        <p className="text-sm text-gray-600">Get started in less than 2 minutes</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-4xl mb-3">✅</div>
                        <h3 className="font-bold text-gray-900 mb-2">Verified Pros</h3>
                        <p className="text-sm text-gray-600">All professionals are background checked</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
