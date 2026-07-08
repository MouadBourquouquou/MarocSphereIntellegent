package ma.marocsphere.service;

import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;

import java.util.UUID;

public interface ArtisanService {
    ArtisanResponseDTO getById(UUID id);
    ArtisanResponseDTO create(ArtisanCreationDTO dto);
}
