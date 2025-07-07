// frontend/src/types/index.ts

export interface Donor {
  username: string;
  avatarImage?: string | null;
}

export interface Donation {
  id: number;
  amount: number;
  specialMessage: string;
  socialURLOrBuyMeACoffee: string;
  donor: Donor;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
}

export interface Profile {
  name?: string;
  avatarImage?: string;
}
