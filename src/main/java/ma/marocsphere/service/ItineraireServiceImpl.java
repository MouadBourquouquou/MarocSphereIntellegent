package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ItineraireCreationDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Itineraire;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.ItineraireRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace ItineraireServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class ItineraireServiceImpl implements ItineraireService {

    private final ItineraireRepo itineraireRepo;
    private final ClientRepo clientRepo;

    @Override
    public ItineraireResponseDTO getById(UUID id) {
        Itineraire itineraire = itineraireRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Itinéraire non trouvé avec l'id : " + id));
        return toResponseDTO(itineraire);
    }

    @Override
    public ItineraireResponseDTO create(ItineraireCreationDTO dto) {
        Long clientId = dto.getClientId().getMostSignificantBits() & Long.MAX_VALUE;
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + dto.getClientId()));

        Itineraire itineraire = Itineraire.builder()
                .client(client)
                .genereParIA(dto.getGenereParIA())
                .jours(dto.getJours())
                .build();

        Itineraire saved = itineraireRepo.save(itineraire);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private ItineraireResponseDTO toResponseDTO(Itineraire itineraire) {
        return ItineraireResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("itineraire-" + itineraire.getId()).getBytes()))
                .clientId(UUID.nameUUIDFromBytes(("client-" + itineraire.getClient().getId()).getBytes()))
                .genereParIA(itineraire.getGenereParIA())
                .jours(itineraire.getJours())
                .build();
    }
}
