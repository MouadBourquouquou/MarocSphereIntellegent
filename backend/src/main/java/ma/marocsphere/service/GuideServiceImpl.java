package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.entity.Role;
import ma.marocsphere.repository.GuideRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Primary
@RequiredArgsConstructor
public class GuideServiceImpl implements GuideService {

    private final GuideRepo guideRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public GuideResponseDTO getById(Long id) {
        Guide guide = guideRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Guide non trouvé avec l'id : " + id));
        return toResponseDTO(guide);
    }

    @Override
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
                .dateCreation(guide.getDateCreation())
                .build();
    }
}
