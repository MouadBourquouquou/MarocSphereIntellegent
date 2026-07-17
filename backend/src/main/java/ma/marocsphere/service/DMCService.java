package ma.marocsphere.service;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import java.util.List;

public interface DMCService {
    DMCResponseDTO getById(Long id);
    List<DMCResponseDTO> getAll();
    DMCResponseDTO create(DMCCreationDTO dto);
    void delete(Long id);
}
