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
public class ReservationResponseDTO {
    private Long id;
    private Long clientId;
    private String clientName;
    private String statut;
    private LocalDateTime date;
    private String resourceType;
    private Long resourceId;
    private String resourceName;
}
