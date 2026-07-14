package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Client extends Utilisateur {

    private String tierAbonnement;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Itineraire> itineraires = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Avis> avis = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Message> messages = new ArrayList<>();

    @Override
    protected Role assignerRole() {
        return Role.CLIENT;
    }
}