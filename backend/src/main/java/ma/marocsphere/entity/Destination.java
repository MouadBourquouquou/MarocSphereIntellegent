package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String localisation;
    private String region;
    private String pays;
    private String type;
    private String photoUrl;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Landmark> landmarks = new ArrayList<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Partner> partners = new ArrayList<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Review> reviews = new ArrayList<>();
}
