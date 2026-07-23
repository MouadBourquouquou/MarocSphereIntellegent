package ma.marocsphere.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationCreationDTO {

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

    @NotNull(message = "Le type de ressource est obligatoire")
    private String resourceType;

    @NotNull(message = "L'identifiant de la ressource est obligatoire")
    private Long resourceId;

    private String resourceName;

    @NotNull(message = "La date est obligatoire")
    private LocalDateTime date;
}
