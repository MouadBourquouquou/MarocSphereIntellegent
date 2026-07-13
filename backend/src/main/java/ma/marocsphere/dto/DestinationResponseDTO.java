package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationResponseDTO {
    private Long id;
    private String nom;
    private String description;
    private String localisation;
    private String region;
    private String pays;
    private String type;
    private String photoUrl;
}
