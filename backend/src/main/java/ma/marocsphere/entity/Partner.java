package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String type;
    private String email;
    private String telephone;
    private String localisation;
    private String siteWeb;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    @ToString.Exclude
    private Destination destination;
}
