package ma.marocsphere.service;

import ma.marocsphere.dto.EvenementTraceCreationDTO;
import ma.marocsphere.dto.EvenementTraceResponseDTO;

public interface EvenementTraceService {
    EvenementTraceResponseDTO getById(Long id);
    EvenementTraceResponseDTO create(EvenementTraceCreationDTO dto);
}
