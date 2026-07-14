export function fullName(prenom: string, nom: string): string {
  return `${prenom} ${nom}`.trim();
}

export function avatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
}

export function itineraireTitle(jours: string | null | undefined): string {
  if (!jours) {
    return 'Itinéraire personnalisé';
  }
  try {
    const parsed = JSON.parse(jours) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return `Voyage de ${parsed.length} jour(s)`;
    }
  } catch {
    // jours n'est pas du JSON
  }
  return jours.length > 50 ? `${jours.slice(0, 50)}…` : jours;
}

export function itineraireDaysCount(jours: string | null | undefined): number {
  if (!jours) {
    return 0;
  }
  try {
    const parsed = JSON.parse(jours) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.length;
    }
  } catch {
    // ignore
  }
  return 0;
}

export function roleDashboardPath(role: string | null | undefined): string {
  const routes: Record<string, string> = {
    client: '/dashboard-client',
    guide: '/dashboard-guide',
    artisan: '/dashboard-artisan',
    admin: '/dashboard-client',
  };
  return routes[role?.toLowerCase() ?? ''] ?? '/landing';
}
