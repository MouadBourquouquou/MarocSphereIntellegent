package ma.marocsphere.service;

import ma.marocsphere.dto.ExperienceCreationDTO;
import ma.marocsphere.dto.ExperienceResponseDTO;

import java.util.List;

public interface ExperienceService {
    Long getGuideIdByEmail(String email);
    List<ExperienceResponseDTO> getByGuideId(Long guideId);
    ExperienceResponseDTO getById(Long id);
    ExperienceResponseDTO create(Long guideId, ExperienceCreationDTO dto);
    ExperienceResponseDTO update(Long id, ExperienceCreationDTO dto);
    ExperienceResponseDTO toggleStatus(Long id);
    void delete(Long id);
}
