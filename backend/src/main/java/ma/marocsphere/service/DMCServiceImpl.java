package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import ma.marocsphere.dto.DMCUpdateDTO;
import ma.marocsphere.entity.DMC;
import ma.marocsphere.repository.DMCRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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
    public List<DMCResponseDTO> getAll() {
        return dmcRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!dmcRepo.existsById(id)) {
            throw new RuntimeException("DMC non trouvé avec l'id : " + id);
        }
        dmcRepo.deleteById(id);
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

    @Override
    @Transactional
    public DMCResponseDTO update(Long id, DMCUpdateDTO dto) {
        DMC dmc = dmcRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("DMC non trouvé avec l'id : " + id));
        if (dto.getNomEntreprise() != null) dmc.setNomEntreprise(dto.getNomEntreprise());
        if (dto.getZoneCouverture() != null) dmc.setZoneCouverture(dto.getZoneCouverture());
        return toResponseDTO(dmcRepo.save(dmc));
    }

    private DMCResponseDTO toResponseDTO(DMC dmc) {
        return DMCResponseDTO.builder()
                .id(dmc.getId())
                .nomEntreprise(dmc.getNomEntreprise())
                .zoneCouverture(dmc.getZoneCouverture())
                .build();
    }
}
