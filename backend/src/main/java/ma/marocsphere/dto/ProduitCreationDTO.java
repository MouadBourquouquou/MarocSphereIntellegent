package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitCreationDTO {
    private String nom;
    private String description;
    private String categorie;
    private Double prix;
    private Integer stock;
    private String disponibilite;
    private Double note;
    private String imageUrl;
    private String materiels;
    private String processFabrication;
}
