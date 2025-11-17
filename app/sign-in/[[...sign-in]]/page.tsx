"use client"
import { SignIn, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    console.debug('[sign-in] isLoaded=', isLoaded, 'isSignedIn=', isSignedIn)
    if (isLoaded && isSignedIn) {
      router.replace('/cadastro')
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to continue to your dashboard</p>
        </div>

        <div className="mb-4">
          <SignIn />
        </div>

        <div className="text-center mt-4 text-xs text-gray-400">
          By continuing you agree to our Terms and Privacy Policy.
        </div>
        <div className="mt-3 text-xs text-gray-600">
          <strong>Debug:</strong> isLoaded={String(isLoaded)}, isSignedIn={String(isSignedIn)}
        </div>
      </div>
    </div>
  )
}