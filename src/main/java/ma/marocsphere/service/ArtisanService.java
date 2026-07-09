package ma.marocsphere.service;

import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;

public interface ArtisanService {
    ArtisanResponseDTO getById(Long id);
    ArtisanResponseDTO create(ArtisanCreationDTO dto);
}
