package ma.marocsphere.service;

import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ArtisanServiceFake implements ArtisanService {

    @Override
    public ArtisanResponseDTO getById(UUID id) {
        return ArtisanResponseDTO.builder()
                .id(id)
                .email("hassan.potier@marocsphere.ma")
                .nom("Ait Benhaddou")
                .prenom("Hassan")
                .telephone("+212 666-778899")
                .nationalite("MA")
                .languePreferee("ar")
                .categorieArtisanat("Poterie")
                .qrTraceId("QR-POT-2026-00341")
                .eligibleExport(true)
                .independant(false)
                .cooperativeId(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                .dateCreation(LocalDateTime.now().minusMonths(6))
                .build();
    }

    @Override
    public ArtisanResponseDTO create(ArtisanCreationDTO dto) {
        return ArtisanResponseDTO.builder()
                .id(UUID.randomUUID())
                .email(dto.getEmail())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .nationalite(dto.getNationalite())
                .languePreferee(dto.getLanguePreferee())
                .categorieArtisanat(dto.getCategorieArtisanat())
                .qrTraceId(dto.getQrTraceId())
                .eligibleExport(dto.getEligibleExport())
                .independant(dto.getIndependant())
                .cooperativeId(dto.getCooperativeId())
                .dateCreation(LocalDateTime.now())
                .build();
    }
}
