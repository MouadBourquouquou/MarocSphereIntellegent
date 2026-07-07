package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "guides")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Guide extends Utilisateur {

    private String numeroLicence;
    private String statutCertification;
    private Float scoreCertification;
    private Boolean disponible;

    @OneToMany(mappedBy = "guide", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Avis> avisRecus = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dmc_id")
    @ToString.Exclude
    private DMC dmc;

    @Override
    protected Role assignerRole() {
        return Role.GUIDE;
    }
}