package ma.marocsphere.service;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import ma.marocsphere.dto.DMCUpdateDTO;
import java.util.List;

public interface DMCService {
    DMCResponseDTO getById(Long id);
    List<DMCResponseDTO> getAll();
    DMCResponseDTO create(DMCCreationDTO dto);
    DMCResponseDTO update(Long id, DMCUpdateDTO dto);
    void delete(Long id);
}
