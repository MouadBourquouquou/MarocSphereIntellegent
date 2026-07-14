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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class ArtisanServiceImpl implements ArtisanService {

    private final ArtisanRepo artisanRepo;
    private final CooperativeRepo cooperativeRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ArtisanResponseDTO getById(Long id) {
        Artisan artisan = artisanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé avec l'id : " + id));
        return toResponseDTO(artisan);
    }

    @Override
    public List<ArtisanResponseDTO> getAll() {
        return artisanRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ArtisanResponseDTO create(ArtisanCreationDTO dto) {
        if (artisanRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un artisan avec cet email existe déjà : " + dto.getEmail());
        }
        Cooperative cooperative = null;
        if (dto.getCooperativeId() != null && !Boolean.TRUE.equals(dto.getIndependant())) {
            cooperative = cooperativeRepo.findById(dto.getCooperativeId())
                    .orElseThrow(() -> new RuntimeException("Coopérative non trouvée : " + dto.getCooperativeId()));
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

    private ArtisanResponseDTO toResponseDTO(Artisan artisan) {
        Long cooperativeId = artisan.getCooperative() != null ? artisan.getCooperative().getId() : null;
        return ArtisanResponseDTO.builder()
                .id(artisan.getId())
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
                .cooperativeId(cooperativeId)
                .dateCreation(artisan.getDateCreation())
                .build();
    }
}
