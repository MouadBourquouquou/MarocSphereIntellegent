package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandeDTO {
    private Long id;
    private String statut;
    private Double montantTotal;
    private String adresseLivraison;
    private String methodePaiement;
    private String statutPaiement;
    private String notes;
    private LocalDateTime dateCommande;
    private Long clientId;
    private String clientNom;
    private String clientPrenom;
    private String clientEmail;
    private List<CommandeItemDTO> items;
}
