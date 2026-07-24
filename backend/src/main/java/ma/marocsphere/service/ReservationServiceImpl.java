package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.dto.ReservationStatusDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Reservation;
import ma.marocsphere.entity.ReservationStatus;
import ma.marocsphere.entity.ReservationType;
import ma.marocsphere.repository.ClientRepo;
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

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getAll() {
        return reservationRepo.findAllWithClient().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!reservationRepo.existsById(id)) {
            throw new RuntimeException("Réservation non trouvée avec l'id : " + id);
        }
        reservationRepo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationResponseDTO getById(Long id) {
        Reservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id : " + id));
        return toResponseDTO(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getByClientId(Long clientId) {
        return reservationRepo.findByClientId(clientId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getByGuideId(Long guideId) {
        return reservationRepo.findByResourceTypeAndResourceIdWithClient(ReservationType.GUIDE, guideId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ReservationResponseDTO create(ReservationCreationDTO dto) {
        Client client = clientRepo.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getClientId()));

        ReservationType resourceType;
        try {
            resourceType = ReservationType.valueOf(dto.getResourceType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Type de ressource invalide : " + dto.getResourceType());
        }

        String resourceName = dto.getResourceName();
        if (resourceName == null || resourceName.isBlank()) {
            resourceName = resourceType.name() + " #" + dto.getResourceId();
        }

        Reservation reservation = Reservation.builder()
                .client(client)
                .resourceType(resourceType)
                .resourceId(dto.getResourceId())
                .resourceName(resourceName)
                .date(dto.getDate())
                .statut(ReservationStatus.PENDING)
                .build();

        Reservation saved = reservationRepo.save(reservation);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public ReservationResponseDTO updateStatus(Long id, ReservationStatusDTO dto) {
        Reservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id : " + id));

        ReservationStatus newStatus;
        try {
            newStatus = ReservationStatus.valueOf(dto.getStatut().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide : " + dto.getStatut());
        }

        reservation.setStatut(newStatus);
        Reservation saved = reservationRepo.save(reservation);
        return toResponseDTO(saved);
    }

    private ReservationResponseDTO toResponseDTO(Reservation reservation) {
        String clientName = reservation.getClient().getPrenom() + " " + reservation.getClient().getNom();
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .clientId(reservation.getClient().getId())
                .clientName(clientName)
                .statut(reservation.getStatut().name())
                .date(reservation.getDate())
                .resourceType(reservation.getResourceType().name())
                .resourceId(reservation.getResourceId())
                .resourceName(reservation.getResourceName())
                .build();
    }
}
