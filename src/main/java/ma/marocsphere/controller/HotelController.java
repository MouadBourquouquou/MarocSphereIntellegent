package ma.marocsphere.controller;

import ma.marocsphere.dto.HotelCreationDTO;
import ma.marocsphere.dto.HotelResponseDTO;
import ma.marocsphere.service.HotelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelResponseDTO> getById(@PathVariable UUID id) {
        HotelResponseDTO response = hotelService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<HotelResponseDTO> create(@RequestBody HotelCreationDTO dto) {
        HotelResponseDTO response = hotelService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
