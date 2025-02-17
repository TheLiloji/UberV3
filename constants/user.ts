export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
}

export const USER_DATA: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+33 6 12 34 56 78",
  avatar: "https://picsum.photos/200",
}; 