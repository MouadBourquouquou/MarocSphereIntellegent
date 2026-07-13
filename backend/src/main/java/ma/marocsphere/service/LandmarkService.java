package ma.marocsphere.service;

import ma.marocsphere.dto.LandmarkCreationDTO;
import ma.marocsphere.dto.LandmarkResponseDTO;

public interface LandmarkService {
    LandmarkResponseDTO getById(Long id);
    LandmarkResponseDTO create(LandmarkCreationDTO dto);
}
