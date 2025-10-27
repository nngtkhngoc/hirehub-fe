export type SignInData = {
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  address: string | null;
  description: string | null;
  isVerified: boolean;
  isBanned: false;
  role: {
    id: string;
    action: string;
    resource: string;
  };
};
