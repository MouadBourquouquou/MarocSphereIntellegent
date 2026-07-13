package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.LandmarkCreationDTO;
import ma.marocsphere.dto.LandmarkResponseDTO;
import ma.marocsphere.entity.Destination;
import ma.marocsphere.entity.Landmark;
import ma.marocsphere.repository.DestinationRepo;
import ma.marocsphere.repository.LandmarkRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@RequiredArgsConstructor
public class LandmarkServiceImpl implements LandmarkService {

    private final LandmarkRepo landmarkRepo;
    private final DestinationRepo destinationRepo;

    @Override
    public LandmarkResponseDTO getById(Long id) {
        Landmark landmark = landmarkRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landmark non trouvé avec l'id : " + id));
        return toResponseDTO(landmark);
    }

    @Override
    @Transactional
    public LandmarkResponseDTO create(LandmarkCreationDTO dto) {
        Destination destination = destinationRepo.findById(dto.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination non trouvée : " + dto.getDestinationId()));

        Landmark landmark = Landmark.builder()
                .destination(destination)
                .nom(dto.getNom())
                .description(dto.getDescription())
                .type(dto.getType())
                .localisation(dto.getLocalisation())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .photoUrl(dto.getPhotoUrl())
                .build();
        Landmark saved = landmarkRepo.save(landmark);
        return toResponseDTO(saved);
    }

    private LandmarkResponseDTO toResponseDTO(Landmark landmark) {
        return LandmarkResponseDTO.builder()
                .id(landmark.getId())
                .destinationId(landmark.getDestination().getId())
                .nom(landmark.getNom())
                .description(landmark.getDescription())
                .type(landmark.getType())
                .localisation(landmark.getLocalisation())
                .latitude(landmark.getLatitude())
                .longitude(landmark.getLongitude())
                .photoUrl(landmark.getPhotoUrl())
                .build();
    }
}
