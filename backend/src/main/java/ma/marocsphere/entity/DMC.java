package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dmc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DMC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomEntreprise;
    private String zoneCouverture;

    @OneToMany(mappedBy = "dmc", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Guide> guides = new ArrayList<>();

    @OneToMany(mappedBy = "dmc", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Artisan> artisans = new ArrayList<>();
}
