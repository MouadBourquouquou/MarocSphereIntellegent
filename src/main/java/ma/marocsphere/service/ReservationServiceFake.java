package ma.marocsphere.service;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ReservationServiceFake implements ReservationService {

    @Override
    public ReservationResponseDTO getById(UUID id) {
        return ReservationResponseDTO.builder()
                .id(id)
                .clientId(UUID.randomUUID())
                .guideId(UUID.randomUUID())
                .statut("CONFIRMED")
                .date(LocalDateTime.now().plusDays(5))
                .build();
    }

    @Override
    public ReservationResponseDTO create(ReservationCreationDTO dto) {
        return ReservationResponseDTO.builder()
                .id(UUID.randomUUID())
                .clientId(dto.getClientId())
                .guideId(dto.getGuideId())
                .statut("PENDING")
                .date(dto.getDate())
                .build();
    }
}
