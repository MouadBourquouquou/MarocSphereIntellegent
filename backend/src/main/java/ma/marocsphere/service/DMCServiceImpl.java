package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import ma.marocsphere.entity.DMC;
import ma.marocsphere.repository.DMCRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@RequiredArgsConstructor
public class DMCServiceImpl implements DMCService {

    private final DMCRepo dmcRepo;

    @Override
    public DMCResponseDTO getById(Long id) {
        DMC dmc = dmcRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("DMC non trouvé avec l'id : " + id));
        return toResponseDTO(dmc);
    }

    @Override
    public DMCResponseDTO create(DMCCreationDTO dto) {
        DMC dmc = DMC.builder()
                .nomEntreprise(dto.getNomEntreprise())
                .zoneCouverture(dto.getZoneCouverture())
                .build();
        DMC saved = dmcRepo.save(dmc);
        return toResponseDTO(saved);
    }

    private DMCResponseDTO toResponseDTO(DMC dmc) {
        return DMCResponseDTO.builder()
                .id(dmc.getId())
                .nomEntreprise(dmc.getNomEntreprise())
                .zoneCouverture(dmc.getZoneCouverture())
                .build();
    }
}
