package ma.marocsphere.service;

import ma.marocsphere.dto.HotelCreationDTO;
import ma.marocsphere.dto.HotelResponseDTO;

import java.util.UUID;

public interface HotelService {
    HotelResponseDTO getById(UUID id);
    HotelResponseDTO create(HotelCreationDTO dto);
}
