package ma.marocsphere.service;

import ma.marocsphere.dto.ItineraireCreationDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;

import java.util.UUID;

public interface ItineraireService {
    ItineraireResponseDTO getById(UUID id);
    ItineraireResponseDTO create(ItineraireCreationDTO dto);
}
