package ma.marocsphere.service;

import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ClientServiceFake implements ClientService {

    @Override
    public ClientResponseDTO getById(UUID id) {
        return ClientResponseDTO.builder()
                .id(id)
                .email("fake.client@marocsphere.ma")
                .nom("Benjelloun")
                .prenom("Amine")
                .telephone("+212 611-223344")
                .nationalite("MA")
                .languePreferee("fr")
                .tierAbonnement("voyager")
                .dateCreation(LocalDateTime.now().minusWeeks(3))
                .build();
    }

    @Override
    public ClientResponseDTO create(ClientCreationDTO dto) {
        return ClientResponseDTO.builder()
                .id(UUID.randomUUID())
                .email(dto.getEmail())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .tierAbonnement(dto.getTierAbonnement())
                .dateCreation(LocalDateTime.now())
                .build();
    }
}
