package ma.marocsphere.service;

import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CooperativeServiceFake implements CooperativeService {

    @Override
    public CooperativeResponseDTO getById(UUID id) {
        return CooperativeResponseDTO.builder()
                .id(id)
                .nom("Coopérative Aït Benhaddou - Poterie & Tapis")
                .build();
    }

    @Override
    public CooperativeResponseDTO create(CooperativeCreationDTO dto) {
        return CooperativeResponseDTO.builder()
                .id(UUID.randomUUID())
                .nom(dto.getNom())
                .build();
    }
}
