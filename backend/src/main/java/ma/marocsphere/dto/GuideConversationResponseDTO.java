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
public class GuideConversationResponseDTO {
    private Long id;
    private Long guideId;
    private Long clientId;
    private String clientNom;
    private String clientPrenom;
    private String dernierMessage;
    private LocalDateTime dateDernierMessage;
    private Integer messagesNonLus;
}
