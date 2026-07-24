package ma.marocsphere.repository;

import ma.marocsphere.entity.GuideConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideConversationRepo extends JpaRepository<GuideConversation, Long> {
    List<GuideConversation> findByGuideIdOrderByDateDernierMessageDesc(Long guideId);
    Optional<GuideConversation> findByGuideIdAndClientId(Long guideId, Long clientId);
    boolean existsByGuideIdAndClientId(Long guideId, Long clientId);
}
