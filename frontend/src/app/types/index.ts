export interface Donor {
  username: string;
  profile?: {
    avatarImage?: string | null;
  };
}

export interface DonationApi {
  id: number;
  amount: number;
  specialMessage: string;
  donor: {
    username: string;
    avatarImage?: string | null;
  };
}

export interface Donation {
  id: number;
  amount: number;
  specialMessage: string;
  socialURLOrBuyMeACoffee?: string; 
  createdAt: string; 
  donor: Donor;
}

export interface User {
  id: number;
  email: string;
}

export interface Profile {
  name?: string;
  avatarImage?: string;
}

export interface Supporter {
  id: number;
  amount: number;
  specialMessage: string;
  createdAt: string;
  socialURLOrBuyMeACoffee?: string; 
  donor: {
    username: string;
    profile?: {
      avatarImage?: string | null;
    };
  };
}