package ma.marocsphere.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationStatusDTO {

    @NotNull(message = "Le statut est obligatoire")
    private String statut;
}
