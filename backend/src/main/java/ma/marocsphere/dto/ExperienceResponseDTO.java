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
public class ExperienceResponseDTO {
    private Long id;
    private Long guideId;
    private String titre;
    private String description;
    private String localisation;
    private String duree;
    private String prix;
    private String categorie;
    private String image;
    private Float note;
    private Integer nombreReservations;
    private String statut;
    private LocalDateTime dateCreation;
}
