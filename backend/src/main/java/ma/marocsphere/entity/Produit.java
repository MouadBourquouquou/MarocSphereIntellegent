package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "produits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;
    private String categorie;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private Integer stock;

    private String disponibilite;

    private Double note;
    private Integer nbCommandes;

    private String imageUrl;
    private String materiels;
    private String processFabrication;

    @Column(updatable = false)
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    @ToString.Exclude
    private Artisan artisan;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.disponibilite == null) this.disponibilite = "In Stock";
        if (this.note == null) this.note = 0.0;
        if (this.nbCommandes == null) this.nbCommandes = 0;
    }
}
