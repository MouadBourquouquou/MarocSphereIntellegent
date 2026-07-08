package ma.marocsphere.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    /**
     * PasswordEncoder utilisé pour hasher les mots de passe avant de les stocker en base.
     * BCrypt est l'algorithme recommandé — il est lent par conception pour résister aux attaques.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
