import type { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      companyId: string | null
      companyName?: string
      companyStatus?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    companyId: string | null
    companyName?: string
    companyStatus?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    companyId: string | null
    companyName?: string
    companyStatus?: string
  }
}
