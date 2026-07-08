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
import java.util.UUID;

@Service
@Primary // remplace EvenementTraceServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class EvenementTraceServiceImpl implements EvenementTraceService {

    private final EvenementTraceRepo evenementTraceRepo;
    private final ArtisanRepo artisanRepo;

    @Override
    public EvenementTraceResponseDTO getById(UUID id) {
        EvenementTrace evenement = evenementTraceRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("EvenementTrace non trouvé avec l'id : " + id));
        return toResponseDTO(evenement);
    }

    @Override
    public EvenementTraceResponseDTO create(EvenementTraceCreationDTO dto) {
        Long artisanId = dto.getArtisanId().getMostSignificantBits() & Long.MAX_VALUE;
        Artisan artisan = artisanRepo.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé avec l'id : " + dto.getArtisanId()));

        // Parsing des coordonnées GPS depuis le format "lat, lng"
        Double latitude = null;
        Double longitude = null;
        if (dto.getGps() != null && dto.getGps().contains(",")) {
            String[] coords = dto.getGps().split(",");
            try {
                latitude = Double.parseDouble(coords[0].trim().replace("° N", "").replace("° S", ""));
                longitude = Double.parseDouble(coords[1].trim().replace("° W", "").replace("° E", ""));
            } catch (NumberFormatException ignored) {
                // On laisse null si le format GPS est invalide
            }
        }

        EvenementTrace evenement = EvenementTrace.builder()
                .artisan(artisan)
                .etape(dto.getEtape())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .latitude(latitude)
                .longitude(longitude)
                .photoPreuve(dto.getPhotoPreuve())
                .build();

        EvenementTrace saved = evenementTraceRepo.save(evenement);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private EvenementTraceResponseDTO toResponseDTO(EvenementTrace evenement) {
        // Reconstituer le GPS depuis latitude/longitude
        String gps = null;
        if (evenement.getLatitude() != null && evenement.getLongitude() != null) {
            gps = evenement.getLatitude() + "° N, " + evenement.getLongitude() + "° W";
        }

        return EvenementTraceResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("evenement-" + evenement.getId()).getBytes()))
                .artisanId(UUID.nameUUIDFromBytes(("artisan-" + evenement.getArtisan().getId()).getBytes()))
                .etape(evenement.getEtape())
                .timestamp(evenement.getTimestamp())
                .gps(gps)
                .photoPreuve(evenement.getPhotoPreuve())
                .build();
    }
}
