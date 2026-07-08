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
public class AvisResponseDTO {
    private UUID id;
    private UUID auteurId;
    private UUID cibleId;
    private Integer note;
    private String commentaire;
}
