package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.CommandeDTO;
import ma.marocsphere.dto.CommandeItemDTO;
import ma.marocsphere.dto.CommandeUpdateDTO;
import ma.marocsphere.entity.Commande;
import ma.marocsphere.entity.CommandeItem;
import ma.marocsphere.repository.CommandeRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepo commandeRepo;

    @Override
    public List<CommandeDTO> getByArtisanId(Long artisanId) {
        return commandeRepo.findByArtisanId(artisanId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public CommandeDTO getById(Long id) {
        Commande commande = commandeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'id : " + id));
        return toDTO(commande);
    }

    @Override
    @Transactional
    public CommandeDTO updateStatut(Long id, CommandeUpdateDTO dto) {
        Commande commande = commandeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'id : " + id));

        String newStatut = dto.getStatut();
        commande.setStatut(newStatut);

        switch (newStatut) {
            case "Confirmed":
                commande.setStatutPaiement("Escrow Held");
                break;
            case "Completed":
                commande.setStatutPaiement("Released");
                break;
            case "Rejected":
                commande.setStatutPaiement("Refund Pending");
                break;
            default:
                break;
        }

        Commande saved = commandeRepo.save(commande);
        return toDTO(saved);
    }

    private CommandeDTO toDTO(Commande commande) {
        List<CommandeItemDTO> items = commande.getItems().stream()
                .map(item -> CommandeItemDTO.builder()
                        .id(item.getId())
                        .quantite(item.getQuantite())
                        .prixUnitaire(item.getPrixUnitaire())
                        .produitId(item.getProduit().getId())
                        .produitNom(item.getProduit().getNom())
                        .build())
                .toList();

        return CommandeDTO.builder()
                .id(commande.getId())
                .statut(commande.getStatut())
                .montantTotal(commande.getMontantTotal())
                .adresseLivraison(commande.getAdresseLivraison())
                .methodePaiement(commande.getMethodePaiement())
                .statutPaiement(commande.getStatutPaiement())
                .notes(commande.getNotes())
                .dateCommande(commande.getDateCommande())
                .clientId(commande.getClient().getId())
                .clientNom(commande.getClient().getNom())
                .clientPrenom(commande.getClient().getPrenom())
                .clientEmail(commande.getClient().getEmail())
                .items(items)
                .build();
    }
}
