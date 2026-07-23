package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String localisation;
    private String duree;
    private String prix;
    private String categorie;
    private String image;
    private Float note;
    private Integer nombreReservations;

    @Column(nullable = false)
    private String statut; // PUBLISHED or DRAFT

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", nullable = false)
    @ToString.Exclude
    private Guide guide;

    @Column(updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.statut == null) this.statut = "DRAFT";
        if (this.note == null) this.note = 0.0f;
        if (this.nombreReservations == null) this.nombreReservations = 0;
    }
}
