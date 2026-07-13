package ma.marocsphere.service;

import ma.marocsphere.dto.DestinationCreationDTO;
import ma.marocsphere.dto.DestinationResponseDTO;

public interface DestinationService {
    DestinationResponseDTO getById(Long id);
    DestinationResponseDTO create(DestinationCreationDTO dto);
}
