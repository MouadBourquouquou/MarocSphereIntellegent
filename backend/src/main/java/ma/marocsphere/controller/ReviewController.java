package ma.marocsphere.controller;

import ma.marocsphere.dto.ReviewCreationDTO;
import ma.marocsphere.dto.ReviewResponseDTO;
import ma.marocsphere.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getById(@PathVariable Long id) {
        ReviewResponseDTO response = reviewService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> create(@RequestBody ReviewCreationDTO dto) {
        ReviewResponseDTO response = reviewService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
