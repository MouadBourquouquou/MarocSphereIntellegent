package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evenements_trace")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvenementTrace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String etape;
    private LocalDateTime timestamp;

    private Double latitude;
    private Double longitude;

    private String photoPreuve;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    @ToString.Exclude
    private Artisan artisan;
}
