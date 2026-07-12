package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvisCreationDTO {
    private Long auteurId;
    private Long cibleId;
    private Integer note;
    private String commentaire;
}
