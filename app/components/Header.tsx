"use client"

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { isSignedIn, isLoaded } = useUser()
  const prevSignedIn = useRef<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    // if user was signed in and now is not -> redirect to Clerk sign-in page
    if (prevSignedIn.current === true && isSignedIn === false) {
      router.replace('/sign-in')
    }
    prevSignedIn.current = isSignedIn
  }, [isLoaded, isSignedIn, router])

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}
