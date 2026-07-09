package ma.marocsphere.service;

import ma.marocsphere.dto.ItineraireCreationDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;

public interface ItineraireService {
    ItineraireResponseDTO getById(Long id);
    ItineraireResponseDTO create(ItineraireCreationDTO dto);
}
