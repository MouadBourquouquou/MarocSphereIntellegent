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

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class ItineraireServiceImpl implements ItineraireService {

    private final ItineraireRepo itineraireRepo;
    private final ClientRepo clientRepo;

    @Override
    public ItineraireResponseDTO getById(Long id) {
        Itineraire itineraire = itineraireRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Itinéraire non trouvé avec l'id : " + id));
        return toResponseDTO(itineraire);
    }

    @Override
    public List<ItineraireResponseDTO> getByClientId(Long clientId) {
        return itineraireRepo.findByClientId(clientId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public ItineraireResponseDTO create(ItineraireCreationDTO dto) {
        Client client = clientRepo.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getClientId()));
        Itineraire itineraire = Itineraire.builder()
                .client(client)
                .genereParIA(dto.getGenereParIA())
                .jours(dto.getJours())
                .build();
        Itineraire saved = itineraireRepo.save(itineraire);
        return toResponseDTO(saved);
    }

    private ItineraireResponseDTO toResponseDTO(Itineraire itineraire) {
        return ItineraireResponseDTO.builder()
                .id(itineraire.getId())
                .clientId(itineraire.getClient().getId())
                .genereParIA(itineraire.getGenereParIA())
                .jours(itineraire.getJours())
                .build();
    }
}
