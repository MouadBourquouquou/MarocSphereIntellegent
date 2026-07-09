package ma.marocsphere.service;

import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;

public interface AvisService {
    AvisResponseDTO getById(Long id);
    AvisResponseDTO create(AvisCreationDTO dto);
}
