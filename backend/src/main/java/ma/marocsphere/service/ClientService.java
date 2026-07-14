package ma.marocsphere.service;

import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.dto.ClientUpdateDTO;

public interface ClientService {
    ClientResponseDTO getById(Long id);
    ClientResponseDTO getByEmail(String email);
    ClientResponseDTO create(ClientCreationDTO dto);
    ClientResponseDTO update(Long id, ClientUpdateDTO dto);
}
