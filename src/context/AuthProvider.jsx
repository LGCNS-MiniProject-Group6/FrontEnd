import { useCallback, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import { AuthContext } from './authContext'

const STORAGE_KEY = 'support-check-auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null
      if (storedAuth?.accessToken?.startsWith('mock-')) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      return storedAuth
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  })

  const saveAuth = useCallback((nextAuth) => {
    setAuth(nextAuth)
    if (nextAuth) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const login = useCallback(async ({ email, password }, userOverrides = {}) => {
    const { data: tokens } = await authApi.login({ email, password })

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      throw new Error('로그인 응답에 인증 토큰이 없습니다.')
    }

    const tokenAuth = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: tokens.tokenType || 'Bearer',
      accessTokenExpiresIn: tokens.accessTokenExpiresIn,
      refreshTokenExpiresIn: tokens.refreshTokenExpiresIn,
    }

    // 사용자 조회 요청에 Access Token이 즉시 사용되도록 먼저 저장합니다.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenAuth))

    try {
      const { data: profile } = await authApi.getMyInfo()
      const nextAuth = {
        ...tokenAuth,
        user: { ...profile, ...userOverrides },
      }
      saveAuth(nextAuth)
      return nextAuth
    } catch (error) {
      saveAuth(null)
      throw error
    }
  }, [saveAuth])

  const signup = useCallback(async (payload) => {
    const { data: signupResult } = await authApi.signup(payload)
    return signupResult
  }, [])

  const logout = useCallback(async () => {
    try {
      if (auth?.refreshToken) {
        await authApi.logout({ refreshToken: auth.refreshToken })
      }
    } finally {
      saveAuth(null)
    }
  }, [auth?.refreshToken, saveAuth])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(auth?.accessToken),
      user: auth?.user ?? null,
      login,
      signup,
      logout,
    }),
    [auth, login, logout, signup],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
