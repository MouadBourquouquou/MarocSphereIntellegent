package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "landmarks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Landmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;


    @Column(nullable = false)
    private String categorie;

    @Column(nullable = false)
    private String zone;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String categoriePrix;

    @Column(nullable = false)
    private Double prixEntree;

    private String historicalPeriod;

    @Column(nullable = false)
    private Boolean unesco;

    private String intangibleHeritage;

    private String architecturalNotes;
}
