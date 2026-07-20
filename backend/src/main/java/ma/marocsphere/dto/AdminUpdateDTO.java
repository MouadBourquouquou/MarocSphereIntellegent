package ma.marocsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateDTO {
    private String nom;
    private String prenom;
    private String telephone;
    private String nationalite;
    private String languePreferee;
    private String status;
}
