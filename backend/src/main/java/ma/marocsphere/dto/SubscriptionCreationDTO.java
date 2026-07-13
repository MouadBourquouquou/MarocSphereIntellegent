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
public class SubscriptionCreationDTO {
    private Long clientId;
    private String type;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Double prix;
}
