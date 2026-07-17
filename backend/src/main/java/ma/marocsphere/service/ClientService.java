package ma.marocsphere.service;

import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.dto.ClientUpdateDTO;
import java.util.List;

public interface ClientService {
    ClientResponseDTO getById(Long id);
    ClientResponseDTO getByEmail(String email);
    List<ClientResponseDTO> getAll();
    ClientResponseDTO create(ClientCreationDTO dto);
    ClientResponseDTO update(Long id, ClientUpdateDTO dto);
    void delete(Long id);
}
