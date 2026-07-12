package ma.marocsphere.service;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;

public interface AdminService {
    AdminResponseDTO getById(Long id);
    AdminResponseDTO create(AdminCreationDTO dto);
}
