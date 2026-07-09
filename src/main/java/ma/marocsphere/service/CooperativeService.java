package ma.marocsphere.service;

import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;

public interface CooperativeService {
    CooperativeResponseDTO getById(Long id);
    CooperativeResponseDTO create(CooperativeCreationDTO dto);
}
