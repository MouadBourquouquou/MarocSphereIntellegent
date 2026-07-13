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
public class ChatResponseDTO {
    private Long id;
    private Long expediteurId;
    private Long destinataireId;
    private String contenu;
    private LocalDateTime dateEnvoi;
    private Boolean lu;
}
