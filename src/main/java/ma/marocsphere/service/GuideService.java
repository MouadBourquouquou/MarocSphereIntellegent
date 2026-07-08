package ma.marocsphere.service;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;

import java.util.UUID;

public interface GuideService {
    GuideResponseDTO getById(UUID id);
    GuideResponseDTO create(GuideCreationDTO dto);
}
