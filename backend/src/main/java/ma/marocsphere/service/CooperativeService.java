package ma.marocsphere.service;

import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;

import java.util.Optional;

public interface CooperativeService {
    CooperativeResponseDTO getById(Long id);
    CooperativeResponseDTO create(CooperativeCreationDTO dto);
    Optional<CooperativeResponseDTO> findByNom(String nom);
}
