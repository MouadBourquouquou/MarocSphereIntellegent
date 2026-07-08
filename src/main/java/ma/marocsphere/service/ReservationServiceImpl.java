package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.entity.Reservation;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.GuideRepo;
import ma.marocsphere.repository.ReservationRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace ReservationServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepo reservationRepo;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;

    @Override
    public ReservationResponseDTO getById(UUID id) {
        Reservation reservation = reservationRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id : " + id));
        return toResponseDTO(reservation);
    }

    @Override
    public ReservationResponseDTO create(ReservationCreationDTO dto) {
        // Récupérer le client
        Long clientId = dto.getClientId().getMostSignificantBits() & Long.MAX_VALUE;
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + dto.getClientId()));

        // Récupérer le guide (optionnel)
        Guide guide = null;
        if (dto.getGuideId() != null) {
            Long guideId = dto.getGuideId().getMostSignificantBits() & Long.MAX_VALUE;
            guide = guideRepo.findById(guideId)
                    .orElseThrow(() -> new RuntimeException("Guide non trouvé avec l'id : " + dto.getGuideId()));
        }

        Reservation reservation = Reservation.builder()
                .client(client)
                .guide(guide)
                .date(dto.getDate())
                .statut("PENDING") // statut initial
                .build();

        Reservation saved = reservationRepo.save(reservation);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private ReservationResponseDTO toResponseDTO(Reservation reservation) {
        UUID guideUUID = reservation.getGuide() != null
                ? UUID.nameUUIDFromBytes(("guide-" + reservation.getGuide().getId()).getBytes())
                : null;

        return ReservationResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("reservation-" + reservation.getId()).getBytes()))
                .clientId(UUID.nameUUIDFromBytes(("client-" + reservation.getClient().getId()).getBytes()))
                .guideId(guideUUID)
                .statut(reservation.getStatut())
                .date(reservation.getDate())
                .build();
    }
}
