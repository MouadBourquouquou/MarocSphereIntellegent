package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "commande_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantite;
    private Double prixUnitaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @ToString.Exclude
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    @ToString.Exclude
    private Produit produit;
}
