package ma.marocsphere.service;

import ma.marocsphere.dto.ItineraireCreationDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ItineraireServiceFake implements ItineraireService {

    @Override
    public ItineraireResponseDTO getById(UUID id) {
        return ItineraireResponseDTO.builder()
                .id(id)
                .clientId(UUID.randomUUID())
                .genereParIA(true)
                .jours("[{\"jour\":1,\"activites\":[\"Visite du Jardin Majorelle\",\"Déjeuner dans la Médina\",\"Balade à la Place Jemaa el-Fna\"]},{\"jour\":2,\"activites\":[\"Excursion dans la vallée de l'Ourika\",\"Dîner chez l'habitant\"]}]")
                .build();
    }

    @Override
    public ItineraireResponseDTO create(ItineraireCreationDTO dto) {
        return ItineraireResponseDTO.builder()
                .id(UUID.randomUUID())
                .clientId(dto.getClientId())
                .genereParIA(dto.getGenereParIA())
                .jours(dto.getJours())
                .build();
    }
}
