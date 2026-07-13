package ma.marocsphere.repository;

import ma.marocsphere.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepo extends JpaRepository<Chat, Long> {
    List<Chat> findByExpediteurIdAndDestinataireId(Long expediteurId, Long destinataireId);
    List<Chat> findByDestinataireIdAndLuFalse(Long destinataireId);
}
