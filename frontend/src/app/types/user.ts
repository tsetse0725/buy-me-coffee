export type Profile = {
  id: number;
  userId: number;
  username: string;
  name: string;
  about: string;
  avatarImage: string;
  socialMediaURL: string;
  coverImage: string;
  successMessage: string;
};


export interface User {
  id: number;
  email: string;
  username: string;
  profile?: Profile | null;
   avatarImage?: string;
}

export interface BankCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  country: string;
  firstName: string;
  lastName: string;
}
