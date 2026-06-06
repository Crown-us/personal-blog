export type UserRole = "user" | "publisher" | "admin";
export type UserPlan = "free" | "pro" | "business";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role: UserRole;
  plan: UserPlan;
  stripeCustomerId?: string;
  emailVerified: boolean;
  newsletterSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  accessToken: string;
  expiresAt: number;
}
