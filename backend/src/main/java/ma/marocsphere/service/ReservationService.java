package ma.marocsphere.service;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import java.util.List;

public interface ReservationService {
    ReservationResponseDTO getById(Long id);
    List<ReservationResponseDTO> getAll();
    List<ReservationResponseDTO> getByClientId(Long clientId);
    List<ReservationResponseDTO> getByGuideId(Long guideId);
    ReservationResponseDTO create(ReservationCreationDTO dto);
    ReservationResponseDTO updateStatut(Long id, String statut);
    void delete(Long id);
}
