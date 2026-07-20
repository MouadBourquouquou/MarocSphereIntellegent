package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;
import ma.marocsphere.dto.ArtisanUpdateDTO;
import ma.marocsphere.entity.Artisan;
import ma.marocsphere.entity.Cooperative;
import ma.marocsphere.entity.Role;
import ma.marocsphere.entity.UserStatus;
import ma.marocsphere.entity.Utilisateur;
import ma.marocsphere.repository.ArtisanRepo;
import ma.marocsphere.repository.CooperativeRepo;
import ma.marocsphere.repository.UtilisateurRepo;
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
    private final UtilisateurRepo utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ArtisanResponseDTO getById(Long id) {
        Artisan artisan = artisanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé avec l'id : " + id));
        return toResponseDTO(artisan);
    }

    @Override
    public ArtisanResponseDTO getByEmail(String email) {
        Utilisateur user = utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));
        if (!(user instanceof Artisan)) {
            throw new RuntimeException("L'utilisateur n'est pas un artisan : " + email);
        }
        return toResponseDTO((Artisan) user);
    }

    @Override
    public List<ArtisanResponseDTO> getAll() {
        return artisanRepo.findAllWithCooperative().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!artisanRepo.existsById(id)) {
            throw new RuntimeException("Artisan non trouvé avec l'id : " + id);
        }
        artisanRepo.deleteById(id);
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

    @Override
    @Transactional
    public ArtisanResponseDTO update(Long id, ArtisanUpdateDTO dto) {
        Artisan artisan = artisanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé avec l'id : " + id));
        if (dto.getNom() != null) artisan.setNom(dto.getNom());
        if (dto.getPrenom() != null) artisan.setPrenom(dto.getPrenom());
        if (dto.getTelephone() != null) artisan.setTelephone(dto.getTelephone());
        if (dto.getNationalite() != null) artisan.setNationalite(dto.getNationalite());
        if (dto.getLanguePreferee() != null) artisan.setLanguePreferee(dto.getLanguePreferee());
        if (dto.getCategorieArtisanat() != null) artisan.setCategorieArtisanat(dto.getCategorieArtisanat());
        if (dto.getEligibleExport() != null) artisan.setEligibleExport(dto.getEligibleExport());
        if (dto.getIndependant() != null) artisan.setIndependant(dto.getIndependant());
        if (dto.getAvatarUrl() != null) artisan.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getBannerUrl() != null) artisan.setBannerUrl(dto.getBannerUrl());
        if (dto.getStatus() != null) {
            artisan.setStatus(UserStatus.valueOf(dto.getStatus().toUpperCase()));
        }
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
                .avatarUrl(artisan.getAvatarUrl())
                .bannerUrl(artisan.getBannerUrl())
                .status(artisan.getStatus().name())
                .dateCreation(artisan.getDateCreation())
                .build();
    }
}
