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
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepo reservationRepo;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;

    @Override
    public List<ReservationResponseDTO> getAll() {
        return reservationRepo.findAllWithClientAndGuide().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!reservationRepo.existsById(id)) {
            throw new RuntimeException("Réservation non trouvée avec l'id : " + id);
        }
        reservationRepo.deleteById(id);
    }

    @Override
    public ReservationResponseDTO getById(Long id) {
        Reservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id : " + id));
        return toResponseDTO(reservation);
    }

    @Override
    public List<ReservationResponseDTO> getByClientId(Long clientId) {
        return reservationRepo.findByClientId(clientId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<ReservationResponseDTO> getByGuideId(Long guideId) {
        return reservationRepo.findByGuideIdWithClient(guideId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ReservationResponseDTO updateStatut(Long id, String statut) {
        Reservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id : " + id));
        reservation.setStatut(statut);
        Reservation saved = reservationRepo.save(reservation);
        saved.getClient().getNom();
        return toResponseDTO(saved);
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
        Client client = reservation.getClient();
        Long guideId = reservation.getGuide() != null ? reservation.getGuide().getId() : null;
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .clientId(client.getId())
                .guideId(guideId)
                .statut(reservation.getStatut())
                .date(reservation.getDate())
                .clientNom(client.getNom())
                .clientPrenom(client.getPrenom())
                .clientEmail(client.getEmail())
                .clientTelephone(client.getTelephone())
                .clientNationalite(client.getNationalite())
                .build();
    }
}
