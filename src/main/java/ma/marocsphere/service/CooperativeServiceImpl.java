package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;
import ma.marocsphere.entity.Cooperative;
import ma.marocsphere.repository.CooperativeRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace CooperativeServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class CooperativeServiceImpl implements CooperativeService {

    private final CooperativeRepo cooperativeRepo;

    @Override
    public CooperativeResponseDTO getById(UUID id) {
        Cooperative cooperative = cooperativeRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Coopérative non trouvée avec l'id : " + id));
        return toResponseDTO(cooperative);
    }

    @Override
    public CooperativeResponseDTO create(CooperativeCreationDTO dto) {
        Cooperative cooperative = Cooperative.builder()
                .nom(dto.getNom())
                .build();

        Cooperative saved = cooperativeRepo.save(cooperative);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private CooperativeResponseDTO toResponseDTO(Cooperative cooperative) {
        return CooperativeResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("cooperative-" + cooperative.getId()).getBytes()))
                .nom(cooperative.getNom())
                .build();
    }
}
