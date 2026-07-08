package ma.marocsphere.service;

import ma.marocsphere.dto.EvenementTraceCreationDTO;
import ma.marocsphere.dto.EvenementTraceResponseDTO;

import java.util.UUID;

public interface EvenementTraceService {
    EvenementTraceResponseDTO getById(UUID id);
    EvenementTraceResponseDTO create(EvenementTraceCreationDTO dto);
}
