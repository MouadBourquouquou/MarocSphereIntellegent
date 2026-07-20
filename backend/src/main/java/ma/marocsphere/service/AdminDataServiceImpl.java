package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.dto.AdminUpdateDTO;
import ma.marocsphere.entity.AdminData;
import ma.marocsphere.entity.Role;
import ma.marocsphere.entity.UserStatus;
import ma.marocsphere.repository.AdminDataRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDataServiceImpl implements AdminDataService {

    private final AdminDataRepo adminDataRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminResponseDTO getById(Long id) {
        AdminData adminData = adminDataRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("AdminData non trouvé avec l'id : " + id));
        return toResponseDTO(adminData);
    }

    @Override
    public List<AdminResponseDTO> getAll() {
        return adminDataRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!adminDataRepo.existsById(id)) {
            throw new RuntimeException("AdminData non trouvé avec l'id : " + id);
        }
        adminDataRepo.deleteById(id);
    }

    @Override
    @Transactional
    public AdminResponseDTO create(AdminCreationDTO dto) {
        if (adminDataRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un AdminData avec cet email existe déjà : " + dto.getEmail());
        }

        AdminData adminData = AdminData.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .role(Role.ADMIN_DATA)
                .build();
        AdminData saved = adminDataRepo.save(adminData);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public AdminResponseDTO update(Long id, AdminUpdateDTO dto) {
        AdminData adminData = adminDataRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("AdminData non trouvé avec l'id : " + id));
        if (dto.getNom()            != null) adminData.setNom(dto.getNom());
        if (dto.getPrenom()         != null) adminData.setPrenom(dto.getPrenom());
        if (dto.getTelephone()      != null) adminData.setTelephone(dto.getTelephone());
        if (dto.getNationalite()    != null) adminData.setNationalite(dto.getNationalite());
        if (dto.getLanguePreferee() != null) adminData.setLanguePreferee(dto.getLanguePreferee());
        if (dto.getStatus() != null) {
            adminData.setStatus(UserStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        return toResponseDTO(adminDataRepo.save(adminData));
    }

    private AdminResponseDTO toResponseDTO(AdminData adminData) {
        return AdminResponseDTO.builder()
                .id(adminData.getId())
                .email(adminData.getEmail())
                .nom(adminData.getNom())
                .prenom(adminData.getPrenom())
                .telephone(adminData.getTelephone())
                .nationalite(adminData.getNationalite())
                .languePreferee(adminData.getLanguePreferee())
                .role(adminData.getRole().name())
                .status(adminData.getStatus().name())
                .dateCreation(adminData.getDateCreation())
                .build();
    }
}
