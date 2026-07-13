package ma.marocsphere.repository;

import ma.marocsphere.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepo extends JpaRepository<Subscription, Long> {
    List<Subscription> findByClientId(Long clientId);
    List<Subscription> findByStatut(String statut);
}
