package ma.marocsphere.service;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;
import ma.marocsphere.dto.GuideUpdateDTO;

import java.util.List;

public interface GuideService {
    GuideResponseDTO getById(Long id);
    GuideResponseDTO getByEmail(String email);
    List<GuideResponseDTO> getAll();
    GuideResponseDTO create(GuideCreationDTO dto);
    GuideResponseDTO update(Long id, GuideUpdateDTO dto);
}
