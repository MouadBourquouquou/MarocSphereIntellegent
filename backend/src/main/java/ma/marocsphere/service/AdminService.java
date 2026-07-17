package ma.marocsphere.service;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import java.util.List;

public interface AdminService {
    AdminResponseDTO getById(Long id);
    List<AdminResponseDTO> getAll();
    AdminResponseDTO create(AdminCreationDTO dto);
    void delete(Long id);
}
