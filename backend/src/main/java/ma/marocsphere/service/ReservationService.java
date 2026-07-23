package ma.marocsphere.service;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.dto.ReservationStatusDTO;

import java.util.List;

public interface ReservationService {
    ReservationResponseDTO getById(Long id);
    List<ReservationResponseDTO> getAll();
    List<ReservationResponseDTO> getByClientId(Long clientId);
    ReservationResponseDTO create(ReservationCreationDTO dto);
    ReservationResponseDTO updateStatus(Long id, ReservationStatusDTO dto);
    void delete(Long id);
}
