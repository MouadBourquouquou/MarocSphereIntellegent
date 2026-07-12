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

@Service
@Primary
@RequiredArgsConstructor
public class AvisServiceImpl implements AvisService {

    private final AvisRepo avisRepo;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;

    @Override
    public AvisResponseDTO getById(Long id) {
        Avis avis = avisRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé avec l'id : " + id));
        return toResponseDTO(avis);
    }

    @Override
    public AvisResponseDTO create(AvisCreationDTO dto) {
        Client client = clientRepo.findById(dto.getAuteurId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getAuteurId()));
        Guide guide = guideRepo.findById(dto.getCibleId())
                .orElseThrow(() -> new RuntimeException("Guide non trouvé : " + dto.getCibleId()));
        Avis avis = Avis.builder()
                .client(client)
                .guide(guide)
                .note(dto.getNote())
                .commentaire(dto.getCommentaire())
                .build();
        Avis saved = avisRepo.save(avis);
        return toResponseDTO(saved);
    }

    private AvisResponseDTO toResponseDTO(Avis avis) {
        return AvisResponseDTO.builder()
                .id(avis.getId())
                .auteurId(avis.getClient().getId())
                .cibleId(avis.getGuide().getId())
                .note(avis.getNote())
                .commentaire(avis.getCommentaire())
                .build();
    }
}
