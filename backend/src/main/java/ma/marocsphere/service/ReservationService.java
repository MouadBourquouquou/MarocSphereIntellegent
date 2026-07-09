package ma.marocsphere.service;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;

public interface ReservationService {
    ReservationResponseDTO getById(Long id);
    ReservationResponseDTO create(ReservationCreationDTO dto);
}
