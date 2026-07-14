package ma.marocsphere.service;

import ma.marocsphere.dto.ItineraireCreationDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;

import java.util.List;

public interface ItineraireService {
    ItineraireResponseDTO getById(Long id);
    List<ItineraireResponseDTO> getByClientId(Long clientId);
    ItineraireResponseDTO create(ItineraireCreationDTO dto);
}
