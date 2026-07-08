package ma.marocsphere.service;

import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;

import java.util.UUID;

public interface AvisService {
    AvisResponseDTO getById(UUID id);
    AvisResponseDTO create(AvisCreationDTO dto);
}
