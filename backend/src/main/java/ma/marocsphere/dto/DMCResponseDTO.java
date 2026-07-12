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
public class DMCResponseDTO {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    private String nomEntreprise;
    private String zoneCouverture;
    private LocalDateTime dateCreation;
}
