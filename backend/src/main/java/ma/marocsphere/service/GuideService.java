package ma.marocsphere.service;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;

import java.util.List;

public interface GuideService {
    GuideResponseDTO getById(Long id);
    List<GuideResponseDTO> getAll();
    GuideResponseDTO create(GuideCreationDTO dto);
}
