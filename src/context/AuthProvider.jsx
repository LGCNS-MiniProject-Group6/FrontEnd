import { useEffect, useMemo, useState } from 'react'
import { userMock } from '../mocks/userMock'
import { AuthContext } from './authContext'

const STORAGE_KEY = 'support-check-auth'

export function AuthProvider({ children }) {
  // 새로고침 후에도 화면의 임시 로그인 상태를 유지합니다.
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    else localStorage.removeItem(STORAGE_KEY)
  }, [auth])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(auth?.accessToken),
      user: auth?.user ?? null,
      login: ({ email }) => {
        setAuth({
          accessToken: 'mock-access-token',
          user: { ...userMock, email: email || userMock.email },
        })
      },
      completeSignup: (profile) => {
        setAuth({
          accessToken: 'mock-signup-token',
          user: { ...userMock, ...profile },
        })
      },
      logout: () => setAuth(null),
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
