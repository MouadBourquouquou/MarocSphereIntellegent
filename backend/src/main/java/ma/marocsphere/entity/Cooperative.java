package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cooperatives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cooperative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @OneToMany(mappedBy = "cooperative", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Artisan> artisans = new ArrayList<>();
}
