package ma.marocsphere.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configuration temporaire : tous les endpoints sont accessibles sans token.
     * À remplacer plus tard par la vraie config JWT (tâche 3 de l'équipe).
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)           // désactiver CSRF (API REST stateless)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // pas de session HTTP
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/swagger-ui/**",        // Swagger UI
                    "/v3/api-docs/**",       // OpenAPI docs
                    "/api/**"                // tous les endpoints ouverts pour l'instant
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
