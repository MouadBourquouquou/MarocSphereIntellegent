package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;
import ma.marocsphere.entity.Cooperative;
import ma.marocsphere.repository.CooperativeRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@RequiredArgsConstructor
public class CooperativeServiceImpl implements CooperativeService {

    private final CooperativeRepo cooperativeRepo;

    @Override
    public CooperativeResponseDTO getById(Long id) {
        Cooperative cooperative = cooperativeRepo.findById(id)
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

    private CooperativeResponseDTO toResponseDTO(Cooperative cooperative) {
        return CooperativeResponseDTO.builder()
                .id(cooperative.getId())
                .nom(cooperative.getNom())
                .build();
    }
}
