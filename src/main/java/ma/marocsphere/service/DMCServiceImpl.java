package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import ma.marocsphere.entity.DMC;
import ma.marocsphere.repository.DMCRepo;
import ma.marocsphere.repository.UtilisateurRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace DMCServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class DMCServiceImpl implements DMCService {

    private final DMCRepo dmcRepo;
    private final UtilisateurRepo utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public DMCResponseDTO getById(UUID id) {
        DMC dmc = dmcRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("DMC non trouvé avec l'id : " + id));
        return toResponseDTO(dmc);
    }

    @Override
    public DMCResponseDTO create(DMCCreationDTO dto) {
        if (utilisateurRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà : " + dto.getEmail());
        }

        DMC dmc = DMC.builder()
                .nomEntreprise(dto.getNomEntreprise())
                .zoneCouverture(dto.getZoneCouverture())
                .build();

        DMC saved = dmcRepo.save(dmc);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private DMCResponseDTO toResponseDTO(DMC dmc) {
        return DMCResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("dmc-" + dmc.getId()).getBytes()))
                .nomEntreprise(dmc.getNomEntreprise())
                .zoneCouverture(dmc.getZoneCouverture())
                .build();
    }
}
