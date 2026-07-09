package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.EvenementTraceCreationDTO;
import ma.marocsphere.dto.EvenementTraceResponseDTO;
import ma.marocsphere.entity.Artisan;
import ma.marocsphere.entity.EvenementTrace;
import ma.marocsphere.repository.ArtisanRepo;
import ma.marocsphere.repository.EvenementTraceRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Primary
@RequiredArgsConstructor
public class EvenementTraceServiceImpl implements EvenementTraceService {

    private final EvenementTraceRepo evenementTraceRepo;
    private final ArtisanRepo artisanRepo;

    @Override
    public EvenementTraceResponseDTO getById(Long id) {
        EvenementTrace evenement = evenementTraceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("EvenementTrace non trouvé avec l'id : " + id));
        return toResponseDTO(evenement);
    }

    @Override
    public EvenementTraceResponseDTO create(EvenementTraceCreationDTO dto) {
        Artisan artisan = artisanRepo.findById(dto.getArtisanId())
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé : " + dto.getArtisanId()));
        EvenementTrace evenement = EvenementTrace.builder()
                .artisan(artisan)
                .etape(dto.getEtape())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .photoPreuve(dto.getPhotoPreuve())
                .build();
        EvenementTrace saved = evenementTraceRepo.save(evenement);
        return toResponseDTO(saved);
    }

    private EvenementTraceResponseDTO toResponseDTO(EvenementTrace evenement) {
        return EvenementTraceResponseDTO.builder()
                .id(evenement.getId())
                .artisanId(evenement.getArtisan().getId())
                .etape(evenement.getEtape())
                .timestamp(evenement.getTimestamp())
                .photoPreuve(evenement.getPhotoPreuve())
                .build();
    }
}
