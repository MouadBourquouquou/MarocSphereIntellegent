package ma.marocsphere.service;

import ma.marocsphere.dto.CommandeDTO;
import ma.marocsphere.dto.CommandeUpdateDTO;

import java.util.List;

public interface CommandeService {
    List<CommandeDTO> getByArtisanId(Long artisanId);
    CommandeDTO getById(Long id);
    CommandeDTO updateStatut(Long id, CommandeUpdateDTO dto);
}
