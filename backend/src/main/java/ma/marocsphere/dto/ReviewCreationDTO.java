package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewCreationDTO {
    private Long utilisateurId;
    private Long destinationId;
    private Integer note;
    private String commentaire;
}
