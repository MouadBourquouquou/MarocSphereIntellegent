package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.entity.Admin;
import ma.marocsphere.entity.Role;
import ma.marocsphere.repository.AdminRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepo adminRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminResponseDTO getById(Long id) {
        Admin admin = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé avec l'id : " + id));
        return toResponseDTO(admin);
    }

    @Override
    @Transactional
    public AdminResponseDTO create(AdminCreationDTO dto) {
        if (adminRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un admin avec cet email existe déjà : " + dto.getEmail());
        }
        Admin admin = Admin.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .role(Role.ADMIN)
                .build();
        Admin saved = adminRepo.save(admin);
        return toResponseDTO(saved);
    }

    private AdminResponseDTO toResponseDTO(Admin admin) {
        return AdminResponseDTO.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .nom(admin.getNom())
                .prenom(admin.getPrenom())
                .telephone(admin.getTelephone())
                .nationalite(admin.getNationalite())
                .languePreferee(admin.getLanguePreferee())
                .role(admin.getRole().name())
                .dateCreation(admin.getDateCreation())
                .build();
    }
}
