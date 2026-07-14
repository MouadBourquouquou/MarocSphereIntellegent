package ma.marocsphere.service;

import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;

import java.util.List;

public interface ArtisanService {
    ArtisanResponseDTO getById(Long id);
    List<ArtisanResponseDTO> getAll();
    ArtisanResponseDTO create(ArtisanCreationDTO dto);
}
