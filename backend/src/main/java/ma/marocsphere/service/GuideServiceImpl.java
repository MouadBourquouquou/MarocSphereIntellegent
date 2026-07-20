package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;
import ma.marocsphere.dto.GuideUpdateDTO;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.entity.Role;
import ma.marocsphere.entity.UserStatus;
import ma.marocsphere.entity.Utilisateur;
import ma.marocsphere.repository.GuideRepo;
import ma.marocsphere.repository.UtilisateurRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class GuideServiceImpl implements GuideService {

    private final GuideRepo guideRepo;
    private final UtilisateurRepo utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public GuideResponseDTO getById(Long id) {
        Guide guide = guideRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Guide non trouvé avec l'id : " + id));
        return toResponseDTO(guide);
    }

    @Override
    public GuideResponseDTO getByEmail(String email) {
        Utilisateur user = utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));
        if (!(user instanceof Guide guide)) {
            throw new RuntimeException("L'utilisateur n'est pas un guide : " + email);
        }
        return toResponseDTO(guide);
    }

    @Override
    public List<GuideResponseDTO> getAll() {
        return guideRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!guideRepo.existsById(id)) {
            throw new RuntimeException("Guide non trouvé avec l'id : " + id);
        }
        guideRepo.deleteById(id);
    }

    @Override
    @Transactional
    public GuideResponseDTO create(GuideCreationDTO dto) {
        if (guideRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un guide avec cet email existe déjà : " + dto.getEmail());
        }
        Guide guide = Guide.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .numeroLicence(dto.getNumeroLicence())
                .statutCertification("PENDING")
                .scoreCertification(0.0f)
                .disponible(true)
                .role(Role.GUIDE)
                .build();
        Guide saved = guideRepo.save(guide);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public GuideResponseDTO update(Long id, GuideUpdateDTO dto) {
        Guide guide = guideRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Guide non trouvé avec l'id : " + id));
        if (dto.getNom() != null) guide.setNom(dto.getNom());
        if (dto.getPrenom() != null) guide.setPrenom(dto.getPrenom());
        if (dto.getTelephone() != null) guide.setTelephone(dto.getTelephone());
        if (dto.getNationalite() != null) guide.setNationalite(dto.getNationalite());
        if (dto.getLanguePreferee() != null) guide.setLanguePreferee(dto.getLanguePreferee());
        if (dto.getNumeroLicence() != null) guide.setNumeroLicence(dto.getNumeroLicence());
        if (dto.getStatutCertification() != null) guide.setStatutCertification(dto.getStatutCertification());
        if (dto.getDisponible() != null) guide.setDisponible(dto.getDisponible());
        if (dto.getStatus() != null) {
            guide.setStatus(UserStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        Guide saved = guideRepo.save(guide);
        return toResponseDTO(saved);
    }

    private GuideResponseDTO toResponseDTO(Guide guide) {
        return GuideResponseDTO.builder()
                .id(guide.getId())
                .email(guide.getEmail())
                .nom(guide.getNom())
                .prenom(guide.getPrenom())
                .telephone(guide.getTelephone())
                .nationalite(guide.getNationalite())
                .languePreferee(guide.getLanguePreferee())
                .numeroLicence(guide.getNumeroLicence())
                .statutCertification(guide.getStatutCertification())
                .scoreCertification(guide.getScoreCertification())
                .disponible(guide.getDisponible())
                .status(guide.getStatus().name())
                .dateCreation(guide.getDateCreation())
                .build();
    }
}
