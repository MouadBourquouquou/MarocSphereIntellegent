// ── Shared type aliases ──────────────────────────────────────────────────────
export type UserRole   = 'Guide' | 'Artisan' | 'Client' | 'DMC' | 'Administrator';
export type UserStatus = 'Certified' | 'Active' | 'Suspended';
export type ToastType  = 'success' | 'error';

/**
 * Unified view-model for ANY entity type shown in the admin tables.
 * Fields mirror backend DTO field names so the mapping layer stays minimal.
 */
export interface PlatformUser {
  id: number;
  /** Combined display name (prenom + nom). */
  name: string;
  role: UserRole;
  email: string;
  /** ISO date string derived from dateCreation. */
  date: string;
  status: UserStatus;
  /** scoreCertification for guides, null otherwise. */
  rating: number | null;
  /** nationalite from the backend. */
  country: string;
  /** languePreferee from the backend. */
  language: string;
  /** avatarUrl if present (Artisan), otherwise a generated placeholder. */
  avatar: string;

  // ── Extra fields carried through so the detail panels can display them ──
  telephone?: string;
  /** Guide-specific */
  numeroLicence?: string;
  statutCertification?: string;
  disponible?: boolean;
  /** Artisan-specific */
  categorieArtisanat?: string;
  eligibleExport?: boolean;
  independant?: boolean;
  cooperativeId?: number | null;
  /** DMC-specific */
  nomEntreprise?: string;
  zoneCouverture?: string;
  /** Client-specific */
  tierAbonnement?: string | null;
}

/** Shape of the reactive form used in the add/edit modal. */
export interface UserFormValue {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  language: string;
}
