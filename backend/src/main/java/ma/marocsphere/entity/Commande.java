package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String statut;

    private Double montantTotal;
    private String adresseLivraison;
    private String methodePaiement;
    private String statutPaiement;
    private String notes;

    @Column(updatable = false)
    private LocalDateTime dateCommande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @ToString.Exclude
    private Client client;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private List<CommandeItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateCommande = LocalDateTime.now();
        if (this.statut == null) this.statut = "Pending";
        if (this.statutPaiement == null) this.statutPaiement = "Escrow Held";
    }
}
