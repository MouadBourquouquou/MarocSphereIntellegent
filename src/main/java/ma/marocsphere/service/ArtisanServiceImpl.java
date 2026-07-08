package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;
import ma.marocsphere.entity.Artisan;
import ma.marocsphere.entity.Cooperative;
import ma.marocsphere.entity.Role;
import ma.marocsphere.repository.ArtisanRepo;
import ma.marocsphere.repository.CooperativeRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace ArtisanServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class ArtisanServiceImpl implements ArtisanService {

    private final ArtisanRepo artisanRepo;
    private final CooperativeRepo cooperativeRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ArtisanResponseDTO getById(UUID id) {
        Artisan artisan = artisanRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé avec l'id : " + id));
        return toResponseDTO(artisan);
    }

    @Override
    public ArtisanResponseDTO create(ArtisanCreationDTO dto) {
        if (artisanRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un artisan avec cet email existe déjà : " + dto.getEmail());
        }

        // Récupérer la coopérative si l'artisan n'est pas indépendant
        Cooperative cooperative = null;
        if (dto.getCooperativeId() != null && !Boolean.TRUE.equals(dto.getIndependant())) {
            Long coopId = dto.getCooperativeId().getMostSignificantBits() & Long.MAX_VALUE;
            cooperative = cooperativeRepo.findById(coopId)
                    .orElseThrow(() -> new RuntimeException("Coopérative non trouvée avec l'id : " + dto.getCooperativeId()));
        }

        Artisan artisan = Artisan.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .categorieArtisanat(dto.getCategorieArtisanat())
                .qrTraceId(dto.getQrTraceId())
                .eligibleExport(dto.getEligibleExport())
                .independant(dto.getIndependant())
                .cooperative(cooperative)
                .role(Role.ARTISAN)
                .build();

        Artisan saved = artisanRepo.save(artisan);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private ArtisanResponseDTO toResponseDTO(Artisan artisan) {
        UUID cooperativeUUID = artisan.getCooperative() != null
                ? UUID.nameUUIDFromBytes(("cooperative-" + artisan.getCooperative().getId()).getBytes())
                : null;

        return ArtisanResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("artisan-" + artisan.getId()).getBytes()))
                .email(artisan.getEmail())
                .nom(artisan.getNom())
                .prenom(artisan.getPrenom())
                .telephone(artisan.getTelephone())
                .nationalite(artisan.getNationalite())
                .languePreferee(artisan.getLanguePreferee())
                .categorieArtisanat(artisan.getCategorieArtisanat())
                .qrTraceId(artisan.getQrTraceId())
                .eligibleExport(artisan.getEligibleExport())
                .independant(artisan.getIndependant())
                .cooperativeId(cooperativeUUID)
                .dateCreation(artisan.getDateCreation())
                .build();
    }
}
