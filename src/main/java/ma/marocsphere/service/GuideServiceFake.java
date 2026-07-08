package ma.marocsphere.service;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class GuideServiceFake implements GuideService {

    @Override
    public GuideResponseDTO getById(UUID id) {
        return GuideResponseDTO.builder()
                .id(id)
                .email("fake.guide@marocsphere.ma")
                .nom("El Idrissi")
                .prenom("Youssef")
                .telephone("+212 600-112233")
                .nationalite("MA")
                .languePreferee("fr")
                .numeroLicence("G-8872-2026")
                .statutCertification("CERTIFIED")
                .scoreCertification(4.8f)
                .disponible(true)
                .dateCreation(LocalDateTime.now().minusMonths(2))
                .build();
    }

    @Override
    public GuideResponseDTO create(GuideCreationDTO dto) {
        return GuideResponseDTO.builder()
                .id(UUID.randomUUID())
                .email(dto.getEmail())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .numeroLicence(dto.getNumeroLicence())
                .statutCertification("PENDING")
                .scoreCertification(0.0f)
                .disponible(true)
                .dateCreation(LocalDateTime.now())
                .build();
    }
}
