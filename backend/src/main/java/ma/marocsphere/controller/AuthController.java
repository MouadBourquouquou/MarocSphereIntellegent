package ma.marocsphere.controller;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.*;
import ma.marocsphere.entity.Role;
import ma.marocsphere.service.AdminDataService;
import ma.marocsphere.service.AdminService;
import ma.marocsphere.service.ArtisanService;
import ma.marocsphere.service.ClientService;
import ma.marocsphere.service.CooperativeService;
import ma.marocsphere.service.GuideService;
import ma.marocsphere.service.TokenBlacklistService;
import ma.marocsphere.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final ClientService clientService;
    private final AdminService adminService;
    private final AdminDataService adminDataService;
    private final GuideService guideService;
    private final ArtisanService artisanService;
    private final CooperativeService cooperativeService;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * Déconnexion — blackliste le token JWT
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklist(token);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /**
     * Connexion — retourne un token JWT + le role
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "message", "Your account has been suspended."
            ));
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtUtil.generateToken(userDetails);

        String role = userDetails.getAuthorities().iterator().next().getAuthority()
                .replace("ROLE_", "");

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", email,
                "role", role,
                "message", "Connexion réussie"
        ));
    }

    /**
     * Inscription — POST /api/auth/register
     * Body: { email, password, nom, prenom, telephone, nationalite, languePreferee,
     *         role: "CLIENT"|"GUIDE"|"ARTISAN",
     *         [CLIENT]  tierAbonnement,
     *         [ARTISAN] categorieArtisanat, eligibleExport, independant, cooperativeNom }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        Role roleEnum;
        try {
            roleEnum = Role.valueOf(dto.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Role invalide. Valeurs acceptées : CLIENT, GUIDE, ARTISAN, ADMIN, ADMIN_DATA"
            ));
        }

        switch (roleEnum) {
            case CLIENT -> {
                ClientCreationDTO clientDto = ClientCreationDTO.builder()
                        .email(dto.getEmail())
                        .password(dto.getPassword())
                        .nom(dto.getNom())
                        .prenom(dto.getPrenom())
                        .telephone(dto.getTelephone())
                        .nationalite(dto.getNationalite())
                        .languePreferee(dto.getLanguePreferee())
                        .tierAbonnement(dto.getTierAbonnement())
                        .build();
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(clientService.create(clientDto));
            }
            case GUIDE -> {
                GuideCreationDTO guideDto = GuideCreationDTO.builder()
                        .email(dto.getEmail())
                        .password(dto.getPassword())
                        .nom(dto.getNom())
                        .prenom(dto.getPrenom())
                        .telephone(dto.getTelephone())
                        .nationalite(dto.getNationalite())
                        .languePreferee(dto.getLanguePreferee())
                        .build();
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(guideService.create(guideDto));
            }
            case ARTISAN -> {
                // Resolve cooperative name → ID if the artisan is not independent
                Long cooperativeId = null;
                boolean independant = Boolean.TRUE.equals(dto.getIndependant());
                if (!independant && dto.getCooperativeNom() != null && !dto.getCooperativeNom().isBlank()) {
                    Optional<CooperativeResponseDTO> coop = cooperativeService.findByNom(dto.getCooperativeNom());
                    if (coop.isEmpty()) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Aucune coopérative trouvée avec le nom : \"" + dto.getCooperativeNom() + "\""
                        ));
                    }
                    cooperativeId = coop.get().getId();
                }

                ArtisanCreationDTO artisanDto = ArtisanCreationDTO.builder()
                        .email(dto.getEmail())
                        .password(dto.getPassword())
                        .nom(dto.getNom())
                        .prenom(dto.getPrenom())
                        .telephone(dto.getTelephone())
                        .nationalite(dto.getNationalite())
                        .languePreferee(dto.getLanguePreferee())
                        .categorieArtisanat(dto.getCategorieArtisanat())
                        .eligibleExport(dto.getEligibleExport())
                        .independant(independant)
                        .cooperativeId(cooperativeId)
                        .build();
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(artisanService.create(artisanDto));
            }
            case ADMIN -> {
                AdminCreationDTO adminDto = AdminCreationDTO.builder()
                        .email(dto.getEmail())
                        .password(dto.getPassword())
                        .nom(dto.getNom())
                        .prenom(dto.getPrenom())
                        .telephone(dto.getTelephone())
                        .nationalite(dto.getNationalite())
                        .languePreferee(dto.getLanguePreferee())
                        .role(dto.getRole().toUpperCase())
                        .build();
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(adminService.create(adminDto));
            }
            case ADMIN_DATA -> {
                AdminCreationDTO adminDataDto = AdminCreationDTO.builder()
                        .email(dto.getEmail())
                        .password(dto.getPassword())
                        .nom(dto.getNom())
                        .prenom(dto.getPrenom())
                        .telephone(dto.getTelephone())
                        .nationalite(dto.getNationalite())
                        .languePreferee(dto.getLanguePreferee())
                        .role(dto.getRole().toUpperCase())
                        .build();
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(adminDataService.create(adminDataDto));
            }
            default -> {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Ce rôle ne peut pas être créé via l'inscription"
                ));
            }
        }
    }
}
