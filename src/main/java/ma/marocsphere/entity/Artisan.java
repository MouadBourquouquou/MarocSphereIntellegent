package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artisans")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Artisan extends Utilisateur {

    private String categorieArtisanat;
    private String qrTraceId;
    private Boolean eligibleExport;
    private Boolean independant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_id")
    @ToString.Exclude
    private Cooperative cooperative;

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<EvenementTrace> evenementsTrace = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dmc_id")
    @ToString.Exclude
    private DMC dmc;

    @Override
    protected Role assignerRole() {
        return Role.ARTISAN;
    }
}
