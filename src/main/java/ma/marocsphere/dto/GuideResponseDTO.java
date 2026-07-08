package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideResponseDTO {
    private UUID id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    private String numeroLicence;
    private String statutCertification;
    private Float scoreCertification;
    private Boolean disponible;
    private LocalDateTime dateCreation;
}
