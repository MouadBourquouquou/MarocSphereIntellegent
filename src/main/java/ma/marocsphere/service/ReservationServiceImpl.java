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

@Service
@Primary
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepo reservationRepo;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;

    @Override
    public ReservationResponseDTO getById(Long id) {
        Reservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id : " + id));
        return toResponseDTO(reservation);
    }

    @Override
    public ReservationResponseDTO create(ReservationCreationDTO dto) {
        Client client = clientRepo.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getClientId()));
        Guide guide = null;
        if (dto.getGuideId() != null) {
            guide = guideRepo.findById(dto.getGuideId())
                    .orElseThrow(() -> new RuntimeException("Guide non trouvé : " + dto.getGuideId()));
        }
        Reservation reservation = Reservation.builder()
                .client(client)
                .guide(guide)
                .date(dto.getDate())
                .statut("PENDING")
                .build();
        Reservation saved = reservationRepo.save(reservation);
        return toResponseDTO(saved);
    }

    private ReservationResponseDTO toResponseDTO(Reservation reservation) {
        Long guideId = reservation.getGuide() != null ? reservation.getGuide().getId() : null;
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .clientId(reservation.getClient().getId())
                .guideId(guideId)
                .statut(reservation.getStatut())
                .date(reservation.getDate())
                .build();
    }
}
