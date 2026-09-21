import { userMock } from '../mocks/userMock'
import { maskEmail } from '../utils/authUtils'

const MOCK_VERIFICATION_CODE = '123456'
const MOCK_DELAY = 250

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY))
}

function createMockError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

export const authMockService = {
  async findId({ name, phone }) {
    await wait()
    if (phone === '010-0000-0000') throw createMockError('NETWORK_ERROR')

    const found = name === userMock.name && phone === userMock.phone
    return {
      found,
      maskedId: found ? maskEmail(userMock.email) : null,
    }
  },

  async sendPhoneVerification({ email }) {
    await wait()
    if (email === 'network@example.com') throw createMockError('NETWORK_ERROR')
    return { sent: true }
  },

  async verifyPhoneVerification({ code }) {
    await wait()
    return { verified: code === MOCK_VERIFICATION_CODE }
  },

  async resetPassword({ verificationCompleted }) {
    await wait()
    if (!verificationCompleted) throw createMockError('VERIFICATION_REQUIRED')
    return { changed: true }
  },
}
