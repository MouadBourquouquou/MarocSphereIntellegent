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

    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String type;
    private String localisation;
    private Double latitude;
    private Double longitude;
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    @ToString.Exclude
    private Destination destination;
}
