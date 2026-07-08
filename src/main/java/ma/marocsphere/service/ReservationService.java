package ma.marocsphere.service;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;

import java.util.UUID;

public interface ReservationService {
    ReservationResponseDTO getById(UUID id);
    ReservationResponseDTO create(ReservationCreationDTO dto);
}
