package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionResponseDTO {
    private Long id;
    private Long clientId;
    private String type;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String statut;
    private Double prix;
}
