package ma.marocsphere.service;

import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;

import java.util.List;

public interface AvisService {
    AvisResponseDTO getById(Long id);
    List<AvisResponseDTO> getByGuideId(Long guideId);
    List<AvisResponseDTO> getByArtisanId(Long artisanId);
    AvisResponseDTO create(AvisCreationDTO dto);
}
