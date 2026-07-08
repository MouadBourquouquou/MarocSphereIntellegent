package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtisanCreationDTO {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    private String categorieArtisanat;
    private String qrTraceId;
    private Boolean eligibleExport;
    private Boolean independant;
    private UUID cooperativeId; // nullable : null si l'artisan est indépendant
}
