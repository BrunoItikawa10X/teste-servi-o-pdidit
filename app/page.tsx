"use client"
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import CadastroForm from './components/CadastroForm'

export default function Page() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  // If signed in show form, otherwise the effect will redirect
  return isSignedIn ? <CadastroForm /> : null
}
