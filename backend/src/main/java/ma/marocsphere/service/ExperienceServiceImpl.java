package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ExperienceCreationDTO;
import ma.marocsphere.dto.ExperienceResponseDTO;
import ma.marocsphere.entity.Experience;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.entity.Utilisateur;
import ma.marocsphere.repository.ExperienceRepo;
import ma.marocsphere.repository.GuideRepo;
import ma.marocsphere.repository.UtilisateurRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepo experienceRepo;
    private final GuideRepo guideRepo;
    private final UtilisateurRepo utilisateurRepo;

    @Override
    public Long getGuideIdByEmail(String email) {
        Utilisateur user = utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));
        if (!(user instanceof Guide guide)) {
            throw new RuntimeException("L'utilisateur n'est pas un guide : " + email);
        }
        return guide.getId();
    }

    @Override
    public List<ExperienceResponseDTO> getByGuideId(Long guideId) {
        return experienceRepo.findByGuideId(guideId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public ExperienceResponseDTO getById(Long id) {
        Experience experience = experienceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expérience non trouvée avec l'id : " + id));
        return toResponseDTO(experience);
    }

    @Override
    @Transactional
    public ExperienceResponseDTO create(Long guideId, ExperienceCreationDTO dto) {
        Guide guide = guideRepo.findById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide non trouvé : " + guideId));
        Experience experience = Experience.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .localisation(dto.getLocalisation())
                .duree(dto.getDuree())
                .prix(dto.getPrix())
                .categorie(dto.getCategorie())
                .image(dto.getImage())
                .statut(dto.getStatut() != null ? dto.getStatut() : "DRAFT")
                .guide(guide)
                .build();
        Experience saved = experienceRepo.save(experience);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public ExperienceResponseDTO update(Long id, ExperienceCreationDTO dto) {
        Experience experience = experienceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expérience non trouvée avec l'id : " + id));
        if (dto.getTitre() != null) experience.setTitre(dto.getTitre());
        if (dto.getDescription() != null) experience.setDescription(dto.getDescription());
        if (dto.getLocalisation() != null) experience.setLocalisation(dto.getLocalisation());
        if (dto.getDuree() != null) experience.setDuree(dto.getDuree());
        if (dto.getPrix() != null) experience.setPrix(dto.getPrix());
        if (dto.getCategorie() != null) experience.setCategorie(dto.getCategorie());
        if (dto.getImage() != null) experience.setImage(dto.getImage());
        if (dto.getStatut() != null) experience.setStatut(dto.getStatut());
        Experience saved = experienceRepo.save(experience);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public ExperienceResponseDTO toggleStatus(Long id) {
        Experience experience = experienceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expérience non trouvée avec l'id : " + id));
        experience.setStatut("PUBLISHED".equals(experience.getStatut()) ? "DRAFT" : "PUBLISHED");
        Experience saved = experienceRepo.save(experience);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!experienceRepo.existsById(id)) {
            throw new RuntimeException("Expérience non trouvée avec l'id : " + id);
        }
        experienceRepo.deleteById(id);
    }

    private ExperienceResponseDTO toResponseDTO(Experience experience) {
        return ExperienceResponseDTO.builder()
                .id(experience.getId())
                .guideId(experience.getGuide().getId())
                .titre(experience.getTitre())
                .description(experience.getDescription())
                .localisation(experience.getLocalisation())
                .duree(experience.getDuree())
                .prix(experience.getPrix())
                .categorie(experience.getCategorie())
                .image(experience.getImage())
                .note(experience.getNote())
                .nombreReservations(experience.getNombreReservations())
                .statut(experience.getStatut())
                .dateCreation(experience.getDateCreation())
                .build();
    }
}
