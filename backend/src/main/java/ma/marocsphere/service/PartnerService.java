package ma.marocsphere.service;

import ma.marocsphere.dto.PartnerCreationDTO;
import ma.marocsphere.dto.PartnerResponseDTO;

public interface PartnerService {
    PartnerResponseDTO getById(Long id);
    PartnerResponseDTO create(PartnerCreationDTO dto);
}
