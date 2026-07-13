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
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepo clientRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ClientResponseDTO getById(Long id) {
        Client client = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
        return toResponseDTO(client);
    }

    @Override
    @Transactional
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

    private ClientResponseDTO toResponseDTO(Client client) {
        return ClientResponseDTO.builder()
                .id(client.getId())
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
