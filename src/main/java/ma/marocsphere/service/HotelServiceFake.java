package ma.marocsphere.service;

import ma.marocsphere.dto.HotelCreationDTO;
import ma.marocsphere.dto.HotelResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class HotelServiceFake implements HotelService {

    @Override
    public HotelResponseDTO getById(UUID id) {
        return HotelResponseDTO.builder()
                .id(id)
                .nom("Riad Dar Anika")
                .prix(1200.0f)
                .localisation("Médina, Marrakech")
                .description("Un riad de charme avec piscine, spa et terrasse sur le toit offrant une vue panoramique sur la médina.")
                .build();
    }

    @Override
    public HotelResponseDTO create(HotelCreationDTO dto) {
        return HotelResponseDTO.builder()
                .id(UUID.randomUUID())
                .nom(dto.getNom())
                .prix(dto.getPrix())
                .localisation(dto.getLocalisation())
                .description(dto.getDescription())
                .build();
    }
}
