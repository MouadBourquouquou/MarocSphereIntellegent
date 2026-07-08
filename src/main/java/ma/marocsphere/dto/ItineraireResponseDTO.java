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
public class ItineraireResponseDTO {
    private UUID id;
    private UUID clientId;
    private Boolean genereParIA;
    private String jours;
}
