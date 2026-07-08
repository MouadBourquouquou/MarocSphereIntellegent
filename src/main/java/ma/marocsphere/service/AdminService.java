package ma.marocsphere.service;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;

import java.util.UUID;

public interface AdminService {
    AdminResponseDTO getById(UUID id);
    AdminResponseDTO create(AdminCreationDTO dto);
}
