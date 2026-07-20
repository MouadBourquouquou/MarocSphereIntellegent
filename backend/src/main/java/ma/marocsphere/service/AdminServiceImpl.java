package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.dto.AdminUpdateDTO;
import ma.marocsphere.entity.Admin;
import ma.marocsphere.entity.Role;
import ma.marocsphere.entity.UserStatus;
import ma.marocsphere.repository.AdminRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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
    public List<AdminResponseDTO> getAll() {
        return adminRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!adminRepo.existsById(id)) {
            throw new RuntimeException("Admin non trouvé avec l'id : " + id);
        }
        adminRepo.deleteById(id);
    }

    @Override
    @Transactional
    public AdminResponseDTO create(AdminCreationDTO dto) {
        if (adminRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un admin avec cet email existe déjà : " + dto.getEmail());
        }
        Role roleToAssign;
        try {
            roleToAssign = (dto.getRole() != null) ? Role.valueOf(dto.getRole().toUpperCase()) : Role.ADMIN;
        } catch (IllegalArgumentException e) {
            roleToAssign = Role.ADMIN;
        }

        Admin admin = Admin.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .role(roleToAssign)
                .status(UserStatus.ENABLED)
                .build();
        Admin saved = adminRepo.save(admin);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public AdminResponseDTO update(Long id, AdminUpdateDTO dto) {
        Admin admin = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé avec l'id : " + id));
        if (dto.getNom()            != null) admin.setNom(dto.getNom());
        if (dto.getPrenom()         != null) admin.setPrenom(dto.getPrenom());
        if (dto.getTelephone()      != null) admin.setTelephone(dto.getTelephone());
        if (dto.getNationalite()    != null) admin.setNationalite(dto.getNationalite());
        if (dto.getLanguePreferee() != null) admin.setLanguePreferee(dto.getLanguePreferee());
        if (dto.getStatus() != null) {
            admin.setStatus(UserStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        return toResponseDTO(adminRepo.save(admin));
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
                .status(admin.getStatus().name())
                .dateCreation(admin.getDateCreation())
                .build();
    }
}
