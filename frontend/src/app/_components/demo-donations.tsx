// src/app/_components/demo-donations.ts

/* ──────────────── types ──────────────── */
export type Donation = {
  id: number;
  amount: number;
  specialMessage: string;
  socialURLOrBuyMeACoffee: string;
  donor: {
    username: string;
    avatarImage: string;
  };
  createdAt: string; // ISO format
};

/* ──────────────── demo data ──────────────── */
export const DEMO_DONATIONS: Donation[] = [
  {
    id: 1,
    amount: 1,
    specialMessage:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I’m feeling down. Although $1 isn’t that much money it’s all I can contribute at the moment ",
    socialURLOrBuyMeACoffee: "instagram.com/welesley",
    donor: {
      username: "Guest",
      avatarImage:
        "https://png.pngtree.com/png-vector/20240910/ourmid/pngtree-business-women-avatar-png-image_13805764.png",
    },
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    amount: 10,
    specialMessage: "Thank you for being so awesome everyday! ",
    socialURLOrBuyMeACoffee: "facebook.com/bdsadas",
    donor: {
      username: "John Doe",
      avatarImage:
        "https://static.vecteezy.com/system/resources/previews/002/002/257/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg",
    },
    createdAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    amount: 2,
    specialMessage: "",
    socialURLOrBuyMeACoffee: "buymeacoffee.com/gkfgrew",
    donor: {
      username: "Radicals",
      avatarImage:
        "https://i.pinimg.com/736x/1b/14/f5/1b14f5d219943c538a3390d422b58219.jpg",
    },
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    amount: 5,
    specialMessage: "",
    socialURLOrBuyMeACoffee: "facebook.com/penelopeb",
    donor: {
      username: "guest",
      avatarImage:
        "https://previews.123rf.com/images/pandavector/pandavector1605/pandavector160500618/56794127-boy-avatar-icon-of-vector-illustration-for-web-and-mobile-design.jpg",
    },
    createdAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    amount: 10,
    specialMessage:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I’m feeling down. Although $1 isn’t that much money it’s all I can contribute at the moment. When I become successful I will be sure to buy you more gifts and donations. Thank you again. ",
    socialURLOrBuyMeACoffee: "buymeacoffee.com/supporterone",
    donor: {
      username: "Fan1",
      avatarImage:
        "https://png.pngtree.com/png-clipart/20250111/original/pngtree-flat-design-female-avatar-icon-with-blue-shirt-simple-and-professional-png-image_19050517.png",
    },
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    amount: 1,
    specialMessage: "",
    socialURLOrBuyMeACoffee: "instagram.com/welesley",
    donor: {
      username: "Fan1",
      avatarImage:
        "https://thumbs.dreamstime.com/b/d-icon-avatar-cartoon-cute-freelancer-woman-working-online-learning-laptop-transparent-png-background-works-embodying-345422695.jpg",
    },
    createdAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
