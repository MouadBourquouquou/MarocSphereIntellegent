package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtisanResponseDTO {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    private String categorieArtisanat;
    private String qrTraceId;
    private Boolean eligibleExport;
    private Boolean independant;
    private Long cooperativeId; // null si indépendant
    private LocalDateTime dateCreation;
}
