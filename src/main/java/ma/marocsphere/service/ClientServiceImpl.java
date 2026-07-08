package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Role;
import ma.marocsphere.repository.ClientRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace ClientServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepo clientRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ClientResponseDTO getById(UUID id) {
        Client client = clientRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
        return toResponseDTO(client);
    }

    @Override
    public ClientResponseDTO create(ClientCreationDTO dto) {
        if (clientRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un client avec cet email existe déjà : " + dto.getEmail());
        }

        Client client = Client.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .tierAbonnement(dto.getTierAbonnement())
                .role(Role.CLIENT)
                .build();

        Client saved = clientRepo.save(client);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private ClientResponseDTO toResponseDTO(Client client) {
        return ClientResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("client-" + client.getId()).getBytes()))
                .email(client.getEmail())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .telephone(client.getTelephone())
                .nationalite(client.getNationalite())
                .languePreferee(client.getLanguePreferee())
                .tierAbonnement(client.getTierAbonnement())
                .dateCreation(client.getDateCreation())
                .build();
    }
}
