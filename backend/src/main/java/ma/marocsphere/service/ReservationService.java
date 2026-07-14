package ma.marocsphere.service;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;

import java.util.List;

public interface ReservationService {
    ReservationResponseDTO getById(Long id);
    List<ReservationResponseDTO> getByClientId(Long clientId);
    ReservationResponseDTO create(ReservationCreationDTO dto);
}
