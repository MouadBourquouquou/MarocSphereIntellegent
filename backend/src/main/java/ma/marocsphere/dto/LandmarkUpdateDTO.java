package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandmarkUpdateDTO {
    private String nom;
    private String categorie;
    private String zone;
    private Double latitude;
    private Double longitude;
    private String categoriePrix;
    private Double prixEntree;
    private String historicalPeriod;
    private Boolean unesco;
    private String intangibleHeritage;
    private String architecturalNotes;
    private String description;
}
