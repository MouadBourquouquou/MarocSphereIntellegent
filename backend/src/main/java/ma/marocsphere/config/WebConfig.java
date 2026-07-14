package ma.marocsphere.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:4200,http://127.0.0.1:4200}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public OpenAPI marcoSphereOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MarocSphere API")
                        .description("Documentation interactive de l'API REST de la plateforme touristique et artisanale MarocSphere. " +
                                "Permet de tester tous les endpoints (Guides, Clients, Reservations, Avis, Itineraires, Hotels, Artisans, Cooperatives, EvenementsTrace, DMC, Admins).")
                        .version("v1.0.0 - Phase de developpement")
                        .contact(new Contact()
                                .name("Equipe MarocSphere")
                                .email("dev@marocsphere.ma")));
    }
}
