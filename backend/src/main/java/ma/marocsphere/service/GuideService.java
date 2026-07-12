package ma.marocsphere.service;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;

public interface GuideService {
    GuideResponseDTO getById(Long id);
    GuideResponseDTO create(GuideCreationDTO dto);
}
