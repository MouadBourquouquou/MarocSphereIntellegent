package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvenementTraceCreationDTO {
    private UUID artisanId;
    private String etape;
    private LocalDateTime timestamp;
    private String gps;
    private String photoPreuve;
}
