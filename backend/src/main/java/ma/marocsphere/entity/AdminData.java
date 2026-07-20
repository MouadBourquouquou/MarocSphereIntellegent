package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "admin_data")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class AdminData extends Utilisateur {

    private String modeAcces;

    @Override
    protected Role assignerRole() {
        return Role.ADMIN_DATA;
    }
}
