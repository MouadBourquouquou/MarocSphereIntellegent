package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.DestinationCreationDTO;
import ma.marocsphere.dto.DestinationResponseDTO;
import ma.marocsphere.entity.Destination;
import ma.marocsphere.repository.DestinationRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@RequiredArgsConstructor
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepo destinationRepo;

    @Override
    public DestinationResponseDTO getById(Long id) {
        Destination destination = destinationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination non trouvée avec l'id : " + id));
        return toResponseDTO(destination);
    }

    @Override
    @Transactional
    public DestinationResponseDTO create(DestinationCreationDTO dto) {
        Destination destination = Destination.builder()
                .nom(dto.getNom())
                .description(dto.getDescription())
                .localisation(dto.getLocalisation())
                .region(dto.getRegion())
                .pays(dto.getPays())
                .type(dto.getType())
                .photoUrl(dto.getPhotoUrl())
                .build();
        Destination saved = destinationRepo.save(destination);
        return toResponseDTO(saved);
    }

    private DestinationResponseDTO toResponseDTO(Destination destination) {
        return DestinationResponseDTO.builder()
                .id(destination.getId())
                .nom(destination.getNom())
                .description(destination.getDescription())
                .localisation(destination.getLocalisation())
                .region(destination.getRegion())
                .pays(destination.getPays())
                .type(destination.getType())
                .photoUrl(destination.getPhotoUrl())
                .build();
    }
}
