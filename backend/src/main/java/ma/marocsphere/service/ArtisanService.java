package ma.marocsphere.service;

import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;
import ma.marocsphere.dto.ArtisanUpdateDTO;

import java.util.List;

public interface ArtisanService {
    ArtisanResponseDTO getById(Long id);
    ArtisanResponseDTO getByEmail(String email);
    List<ArtisanResponseDTO> getAll();
    ArtisanResponseDTO create(ArtisanCreationDTO dto);
    ArtisanResponseDTO update(Long id, ArtisanUpdateDTO dto);
}
