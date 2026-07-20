package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformStatsDTO {
    private long totalClients;
    private long totalGuides;
    private long totalArtisans;
    private long totalDmcs;
    private long totalAdmins;
    private long totalReservations;
    private long reservationsConfirmees;
    private long reservationsEnAttente;
    private long guidesDisponibles;
    private long artisansEligiblesExport;
}
