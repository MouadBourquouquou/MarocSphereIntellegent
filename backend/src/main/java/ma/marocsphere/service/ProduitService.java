package ma.marocsphere.service;

import ma.marocsphere.dto.ProduitCreationDTO;
import ma.marocsphere.dto.ProduitDTO;

import java.util.List;

public interface ProduitService {
    List<ProduitDTO> getByArtisanId(Long artisanId);
    ProduitDTO getById(Long id);
    ProduitDTO create(Long artisanId, ProduitCreationDTO dto);
    ProduitDTO update(Long id, ProduitCreationDTO dto);
    void delete(Long id);
}
