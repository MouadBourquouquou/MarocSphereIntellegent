package ma.marocsphere.service;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DMCServiceFake implements DMCService {

    @Override
    public DMCResponseDTO getById(UUID id) {
        return DMCResponseDTO.builder()
                .id(id)
                .email("contact@marrakech-dmc.ma")
                .nom("Alaoui")
                .prenom("Nadia")
                .telephone("+212 522-334455")
                .nationalite("MA")
                .languePreferee("fr")
                .nomEntreprise("Marrakech Premium DMC")
                .zoneCouverture("Marrakech, Ouarzazate, Agadir")
                .dateCreation(LocalDateTime.now().minusYears(1))
                .build();
    }

    @Override
    public DMCResponseDTO create(DMCCreationDTO dto) {
        return DMCResponseDTO.builder()
                .id(UUID.randomUUID())
                .email(dto.getEmail())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .nomEntreprise(dto.getNomEntreprise())
                .zoneCouverture(dto.getZoneCouverture())
                .dateCreation(LocalDateTime.now())
                .build();
    }
}
