package ma.marocsphere.service;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AdminServiceFake implements AdminService {

    @Override
    public AdminResponseDTO getById(UUID id) {
        return AdminResponseDTO.builder()
                .id(id)
                .email("superadmin@marocsphere.ma")
                .nom("Benali")
                .prenom("Karim")
                .telephone("+212 661-000001")
                .nationalite("MA")
                .languePreferee("fr")
                .role("SUPER_ADMIN")
                .dateCreation(LocalDateTime.now().minusYears(2))
                .build();
    }

    @Override
    public AdminResponseDTO create(AdminCreationDTO dto) {
        return AdminResponseDTO.builder()
                .id(UUID.randomUUID())
                .email(dto.getEmail())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .role(dto.getRole())
                .dateCreation(LocalDateTime.now())
                .build();
    }
}
