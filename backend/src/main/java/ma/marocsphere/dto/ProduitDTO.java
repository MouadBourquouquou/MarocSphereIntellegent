package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitDTO {
    private Long id;
    private String nom;
    private String description;
    private String categorie;
    private Double prix;
    private Integer stock;
    private String disponibilite;
    private Double note;
    private Integer nbCommandes;
    private String imageUrl;
    private String materiels;
    private String processFabrication;
    private Long artisanId;
    private LocalDateTime dateCreation;
}
