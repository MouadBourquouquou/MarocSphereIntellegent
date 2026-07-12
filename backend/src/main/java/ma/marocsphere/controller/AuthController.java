package ma.marocsphere.controller;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.service.ClientService;
import ma.marocsphere.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final ClientService clientService;

    /**
     * Connexion — retourne un token JWT
     * POST /api/auth/login
     * Body: { "email": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Vérifier les identifiants — lance BadCredentialsException si incorrect
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // Charger l'utilisateur et générer le token
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", email,
                "message", "Connexion réussie"
        ));
    }

    /**
     * Inscription d'un nouveau client
     * POST /api/auth/register
     * Body: { "email": "...", "password": "...", "nom": "...", ... }
     */
    @PostMapping("/register")
    public ResponseEntity<ClientResponseDTO> register(@RequestBody ClientCreationDTO dto) {
        ClientResponseDTO newClient = clientService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newClient);
    }
}
