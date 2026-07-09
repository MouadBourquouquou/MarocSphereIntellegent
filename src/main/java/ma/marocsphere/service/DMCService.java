package ma.marocsphere.service;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;

public interface DMCService {
    DMCResponseDTO getById(Long id);
    DMCResponseDTO create(DMCCreationDTO dto);
}
