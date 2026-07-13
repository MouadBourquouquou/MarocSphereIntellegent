package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.SubscriptionCreationDTO;
import ma.marocsphere.dto.SubscriptionResponseDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Subscription;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.SubscriptionRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepo subscriptionRepo;
    private final ClientRepo clientRepo;

    @Override
    public SubscriptionResponseDTO getById(Long id) {
        Subscription subscription = subscriptionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement non trouvé avec l'id : " + id));
        return toResponseDTO(subscription);
    }

    @Override
    @Transactional
    public SubscriptionResponseDTO create(SubscriptionCreationDTO dto) {
        Client client = clientRepo.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getClientId()));

        Subscription subscription = Subscription.builder()
                .client(client)
                .type(dto.getType())
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .statut("ACTIVE")
                .prix(dto.getPrix())
                .build();
        Subscription saved = subscriptionRepo.save(subscription);
        return toResponseDTO(saved);
    }

    private SubscriptionResponseDTO toResponseDTO(Subscription subscription) {
        return SubscriptionResponseDTO.builder()
                .id(subscription.getId())
                .clientId(subscription.getClient().getId())
                .type(subscription.getType())
                .dateDebut(subscription.getDateDebut())
                .dateFin(subscription.getDateFin())
                .statut(subscription.getStatut())
                .prix(subscription.getPrix())
                .build();
    }
}
