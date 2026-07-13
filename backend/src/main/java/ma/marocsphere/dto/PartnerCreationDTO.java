package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerCreationDTO {
    private Long destinationId;
    private String nom;
    private String type;
    private String email;
    private String telephone;
    private String localisation;
    private String siteWeb;
}
