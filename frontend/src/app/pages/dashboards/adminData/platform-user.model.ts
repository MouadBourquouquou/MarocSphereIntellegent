export type UserRole = 'Guide' | 'Artisan' | 'Client' | 'DMC' | 'Administrator';
export type UserStatus = 'Certified' | 'Active' | 'Suspended';
export type ToastType = 'success' | 'error';

export interface PlatformUser {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  date: string; // ISO date string, e.g. '2025-01-12'
  status: UserStatus;
  rating: number;
  country: string;
  language: string;
  avatar: string;
}

/** Shape of the reactive form / template-driven form used in the add/edit modal. */
export interface UserFormValue {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  language: string;
}
