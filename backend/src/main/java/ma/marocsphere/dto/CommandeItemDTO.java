package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandeItemDTO {
    private Long id;
    private Integer quantite;
    private Double prixUnitaire;
    private Long produitId;
    private String produitNom;
}
