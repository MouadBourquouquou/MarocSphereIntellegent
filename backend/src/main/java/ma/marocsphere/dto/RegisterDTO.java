package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDTO {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    private String role; // "CLIENT", "GUIDE", "ARTISAN"

    // CLIENT-specific
    private String tierAbonnement;

    // ARTISAN-specific
    private String categorieArtisanat;
    private Boolean eligibleExport;
    private Boolean independant;
    private String cooperativeNom; // user types the name; resolved to ID server-side
}
