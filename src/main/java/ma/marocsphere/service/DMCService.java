package ma.marocsphere.service;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;

import java.util.UUID;

public interface DMCService {
    DMCResponseDTO getById(UUID id);
    DMCResponseDTO create(DMCCreationDTO dto);
}
