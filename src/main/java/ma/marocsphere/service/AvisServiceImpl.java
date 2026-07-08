package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;
import ma.marocsphere.entity.Avis;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.repository.AvisRepo;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.GuideRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace AvisServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class AvisServiceImpl implements AvisService {

    private final AvisRepo avisRepo;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;

    @Override
    public AvisResponseDTO getById(UUID id) {
        Avis avis = avisRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé avec l'id : " + id));
        return toResponseDTO(avis);
    }

    @Override
    public AvisResponseDTO create(AvisCreationDTO dto) {
        // L'auteur est toujours un client
        Long clientId = dto.getAuteurId().getMostSignificantBits() & Long.MAX_VALUE;
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client (auteur) non trouvé avec l'id : " + dto.getAuteurId()));

        // La cible est un guide
        Long guideId = dto.getCibleId().getMostSignificantBits() & Long.MAX_VALUE;
        Guide guide = guideRepo.findById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide (cible) non trouvé avec l'id : " + dto.getCibleId()));

        Avis avis = Avis.builder()
                .client(client)
                .guide(guide)
                .note(dto.getNote())
                .commentaire(dto.getCommentaire())
                .build();

        Avis saved = avisRepo.save(avis);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private AvisResponseDTO toResponseDTO(Avis avis) {
        return AvisResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("avis-" + avis.getId()).getBytes()))
                .auteurId(UUID.nameUUIDFromBytes(("client-" + avis.getClient().getId()).getBytes()))
                .cibleId(UUID.nameUUIDFromBytes(("guide-" + avis.getGuide().getId()).getBytes()))
                .note(avis.getNote())
                .commentaire(avis.getCommentaire())
                .build();
    }
}
