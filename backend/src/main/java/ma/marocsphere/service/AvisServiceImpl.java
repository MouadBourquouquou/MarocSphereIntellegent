package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;
import ma.marocsphere.entity.Avis;
import ma.marocsphere.entity.Artisan;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.repository.AvisRepo;
import ma.marocsphere.repository.ArtisanRepo;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.GuideRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class AvisServiceImpl implements AvisService {

    private final AvisRepo avisRepo;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;
    private final ArtisanRepo artisanRepo;

    @Override
    public AvisResponseDTO getById(Long id) {
        Avis avis = avisRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé avec l'id : " + id));
        return toResponseDTO(avis);
    }

    @Override
    public List<AvisResponseDTO> getByGuideId(Long guideId) {
        return avisRepo.findByGuideId(guideId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public List<AvisResponseDTO> getByArtisanId(Long artisanId) {
        return avisRepo.findByArtisanId(artisanId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public AvisResponseDTO create(AvisCreationDTO dto) {
        Client client = clientRepo.findById(dto.getAuteurId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getAuteurId()));

        Avis.AvisBuilder builder = Avis.builder()
                .client(client)
                .note(dto.getNote())
                .commentaire(dto.getCommentaire());

        if (dto.getArtisanId() != null) {
            Artisan artisan = artisanRepo.findById(dto.getArtisanId())
                    .orElseThrow(() -> new RuntimeException("Artisan non trouvé : " + dto.getArtisanId()));
            builder.artisan(artisan);
        } else if (dto.getCibleId() != null) {
            Guide guide = guideRepo.findById(dto.getCibleId())
                    .orElseThrow(() -> new RuntimeException("Guide non trouvé : " + dto.getCibleId()));
            builder.guide(guide);
        }

        Avis saved = avisRepo.save(builder.build());
        return toResponseDTO(saved);
    }

    private AvisResponseDTO toResponseDTO(Avis avis) {
        return AvisResponseDTO.builder()
                .id(avis.getId())
                .auteurId(avis.getClient().getId())
                .cibleId(avis.getGuide() != null ? avis.getGuide().getId() : null)
                .artisanId(avis.getArtisan() != null ? avis.getArtisan().getId() : null)
                .note(avis.getNote())
                .commentaire(avis.getCommentaire())
                .build();
    }
}
