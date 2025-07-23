// utils/profile.ts

interface JwtPayload {
  uid: number
  exp?: number
  iat?: number
  // …etc
}

/**
 * JWT를 디코딩만 하는 간단 유틸
 */
function decodeJwt<T>(token: string): T {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('올바른 JWT가 아닙니다')
  }

  // URL-safe Base64 → 일반 Base64
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  // atob로 디코딩 후 UTF-8 인코딩 처리
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(json)
}

export function isOwner(uid: number): boolean {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    console.error('Access token이 없습니다.')
    return false
  }

  try {
    const payload = decodeJwt<JwtPayload>(token)
    return payload.uid === uid
  } catch (err) {
    console.error('JWT 디코딩 실패', err)
    return false
  }
}
