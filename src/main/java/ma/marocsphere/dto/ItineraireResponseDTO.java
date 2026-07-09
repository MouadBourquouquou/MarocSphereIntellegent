package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraireResponseDTO {
    private Long id;
    private Long clientId;
    private Boolean genereParIA;
    private String jours;
}
