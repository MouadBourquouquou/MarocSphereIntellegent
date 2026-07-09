package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "itineraires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itineraire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean genereParIA;

    @Column(columnDefinition = "TEXT")
    private String jours; // JSON stocké en string

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @ToString.Exclude
    private Client client;
}