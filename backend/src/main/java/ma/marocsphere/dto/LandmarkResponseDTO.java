package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandmarkResponseDTO {
    private Long id;
    private Long destinationId;
    private String nom;
    private String description;
    private String type;
    private String localisation;
    private Double latitude;
    private Double longitude;
    private String photoUrl;
}
