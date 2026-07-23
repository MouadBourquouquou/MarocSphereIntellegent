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
public class GuideMessageResponseDTO {
    private Long id;
    private Long conversationId;
    private String contenu;
    private String role;
    private LocalDateTime dateEnvoi;
}
