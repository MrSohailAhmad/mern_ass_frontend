export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole.ADMIN | UserRole.USER;
  createdAt: string; // ISO string format
}

export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  availability: string[];
  location: string;
  contact: string;
}

export interface Appointment {
  _id: string;
  doctorId: {
    name: string;
    specialty: string;
  };
  userId: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
}
