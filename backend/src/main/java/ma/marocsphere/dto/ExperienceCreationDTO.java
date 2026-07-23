package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceCreationDTO {
    private String titre;
    private String description;
    private String localisation;
    private String duree;
    private String prix;
    private String categorie;
    private String image;
    private String statut;
}
