package ma.marocsphere.service;

import ma.marocsphere.dto.HotelCreationDTO;
import ma.marocsphere.dto.HotelResponseDTO;

public interface HotelService {
    HotelResponseDTO getById(Long id);
    HotelResponseDTO create(HotelCreationDTO dto);
}
