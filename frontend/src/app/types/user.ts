// src/app/types/user.ts

export interface Profile {
  id: number;
  userId: number;           // 🔑 User-тай FK
  username: string;
  name: string;
  about: string;
  avatarImage: string;
  socialMediaURL: string;
  coverImage?: string;
  successMessage?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  profile?: Profile | null;
}

export interface BankCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  country: string;
  firstName: string;
  lastName: string;
}
