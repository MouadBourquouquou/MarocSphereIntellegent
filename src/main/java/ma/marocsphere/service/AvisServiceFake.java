package ma.marocsphere.service;

import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AvisServiceFake implements AvisService {

    @Override
    public AvisResponseDTO getById(UUID id) {
        return AvisResponseDTO.builder()
                .id(id)
                .auteurId(UUID.randomUUID())
                .cibleId(UUID.randomUUID())
                .note(5)
                .commentaire("Une expérience inoubliable ! Le guide était très cultivé et sympathique.")
                .build();
    }

    @Override
    public AvisResponseDTO create(AvisCreationDTO dto) {
        return AvisResponseDTO.builder()
                .id(UUID.randomUUID())
                .auteurId(dto.getAuteurId())
                .cibleId(dto.getCibleId())
                .note(dto.getNote())
                .commentaire(dto.getCommentaire())
                .build();
    }
}
