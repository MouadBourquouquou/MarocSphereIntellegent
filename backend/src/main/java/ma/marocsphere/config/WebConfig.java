package ma.marocsphere.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

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
