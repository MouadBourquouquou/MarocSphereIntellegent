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
public class EvenementTraceResponseDTO {
    private Long id;
    private Long artisanId;
    private String etape;
    private LocalDateTime timestamp;
    private String gps;
    private String photoPreuve;
}
