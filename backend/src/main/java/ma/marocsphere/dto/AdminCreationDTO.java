package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCreationDTO {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    // "SUPER_ADMIN" pour la gestion globale ou "ADMIN_DATA" pour les statistiques
    private String role;
}
