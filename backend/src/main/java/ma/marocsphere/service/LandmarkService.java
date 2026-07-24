package ma.marocsphere.service;

import ma.marocsphere.dto.LandmarkCreationDTO;
import ma.marocsphere.dto.LandmarkResponseDTO;
import ma.marocsphere.dto.LandmarkUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface LandmarkService {
    LandmarkResponseDTO getById(Long id);
    List<LandmarkResponseDTO> getAll();
    LandmarkResponseDTO create(LandmarkCreationDTO dto);
    LandmarkResponseDTO update(Long id, LandmarkUpdateDTO dto);
    void delete(Long id);
    List<LandmarkResponseDTO> importCsv(MultipartFile file);
}
