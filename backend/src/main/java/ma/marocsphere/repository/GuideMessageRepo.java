package ma.marocsphere.repository;

import ma.marocsphere.entity.GuideMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideMessageRepo extends JpaRepository<GuideMessage, Long> {
    List<GuideMessage> findByConversationIdOrderByDateEnvoiAsc(Long conversationId);
}
