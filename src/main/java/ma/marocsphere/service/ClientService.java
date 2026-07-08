package ma.marocsphere.service;

import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;

import java.util.UUID;

public interface ClientService {
    ClientResponseDTO getById(UUID id);
    ClientResponseDTO create(ClientCreationDTO dto);
}
