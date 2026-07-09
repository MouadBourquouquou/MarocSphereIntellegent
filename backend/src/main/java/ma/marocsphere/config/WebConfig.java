package ma.marocsphere.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configuration CORS :
     * Autorise le frontend Angular (http://localhost:4200) à envoyer des requêtes
     * vers notre API Spring Boot (http://localhost:8080) sans être bloqué par le navigateur.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")           // Applique CORS sur tous nos endpoints /api/...
                .allowedOrigins("http://localhost:4200") // Autorise uniquement le frontend Angular
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")             // Autorise tous les en-têtes HTTP
                .allowCredentials(true)          // Autorise l'envoi de cookies et tokens
                .maxAge(3600);                   // Cache la réponse CORS pendant 1 heure
    }

    /**
     * Configuration Swagger / OpenAPI :
     * Génère automatiquement une page de documentation interactive accessible à :
     * http://localhost:8080/swagger-ui/index.html
     */
    @Bean
    public OpenAPI marcoSphereOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MarocSphere API")
                        .description("Documentation interactive de l'API REST de la plateforme touristique et artisanale MarocSphere. " +
                                "Permet de tester tous les endpoints (Guides, Clients, Reservations, Avis, Itineraires, Hotels, Artisans, Cooperatives, EvenementsTrace, DMC, Admins).")
                        .version("v1.0.0 - Phase de développement")
                        .contact(new Contact()
                                .name("Équipe MarocSphere")
                                .email("dev@marocsphere.ma")));
    }
}
