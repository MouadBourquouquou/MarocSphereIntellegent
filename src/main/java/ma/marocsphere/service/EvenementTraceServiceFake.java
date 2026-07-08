package ma.marocsphere.service;

import ma.marocsphere.dto.EvenementTraceCreationDTO;
import ma.marocsphere.dto.EvenementTraceResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EvenementTraceServiceFake implements EvenementTraceService {

    @Override
    public EvenementTraceResponseDTO getById(UUID id) {
        return EvenementTraceResponseDTO.builder()
                .id(id)
                .artisanId(UUID.randomUUID())
                .etape("Teinture naturelle de la laine avec le safran")
                .timestamp(LocalDateTime.now().minusDays(2))
                .gps("31.6295° N, 7.9811° W") // Coordonnées de Marrakech
                .photoPreuve("https://storage.marocsphere.ma/photos/teinture_safran_2026.jpg")
                .build();
    }

    @Override
    public EvenementTraceResponseDTO create(EvenementTraceCreationDTO dto) {
        return EvenementTraceResponseDTO.builder()
                .id(UUID.randomUUID())
                .artisanId(dto.getArtisanId())
                .etape(dto.getEtape())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .gps(dto.getGps())
                .photoPreuve(dto.getPhotoPreuve())
                .build();
    }
}
