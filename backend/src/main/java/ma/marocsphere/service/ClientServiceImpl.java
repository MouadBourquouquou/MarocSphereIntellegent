package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.dto.ClientUpdateDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Role;
import ma.marocsphere.entity.UserStatus;
import ma.marocsphere.entity.Utilisateur;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.UtilisateurRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepo clientRepo;
    private final UtilisateurRepo utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ClientResponseDTO getById(Long id) {
        Client client = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
        return toResponseDTO(client);
    }

    @Override
    public ClientResponseDTO getByEmail(String email) {
        Utilisateur user = utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));
        if (!(user instanceof Client)) {
            throw new RuntimeException("L'utilisateur n'est pas un client : " + email);
        }
        return toResponseDTO((Client) user);
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

    @Override
    public List<ClientResponseDTO> getAll() {
        return clientRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!clientRepo.existsById(id)) {
            throw new RuntimeException("Client non trouvé avec l'id : " + id);
        }
        clientRepo.deleteById(id);
    }

    @Override
    @Transactional
    public ClientResponseDTO update(Long id, ClientUpdateDTO dto) {
        Client client = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
        if (dto.getNom() != null) client.setNom(dto.getNom());
        if (dto.getPrenom() != null) client.setPrenom(dto.getPrenom());
        if (dto.getTelephone() != null) client.setTelephone(dto.getTelephone());
        if (dto.getNationalite() != null) client.setNationalite(dto.getNationalite());
        if (dto.getLanguePreferee() != null) client.setLanguePreferee(dto.getLanguePreferee());
        if (dto.getStatus() != null) {
            client.setStatus(UserStatus.valueOf(dto.getStatus().toUpperCase()));
        }
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
                .status(client.getStatus().name())
                .dateCreation(client.getDateCreation())
                .build();
    }
}
