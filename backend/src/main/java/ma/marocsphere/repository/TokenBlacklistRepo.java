package ma.marocsphere.repository;

import ma.marocsphere.entity.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenBlacklistRepo extends JpaRepository<TokenBlacklist, Long> {
    boolean existsByToken(String token);
}
