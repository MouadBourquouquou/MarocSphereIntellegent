package ma.marocsphere.service;

import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;

import java.util.UUID;

public interface CooperativeService {
    CooperativeResponseDTO getById(UUID id);
    CooperativeResponseDTO create(CooperativeCreationDTO dto);
}
