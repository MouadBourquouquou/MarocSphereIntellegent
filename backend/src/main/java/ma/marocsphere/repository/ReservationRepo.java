package ma.marocsphere.repository;

import ma.marocsphere.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Long> {
    List<Reservation> findByClientId(Long clientId);
    List<Reservation> findByGuideId(Long guideId);
    List<Reservation> findByStatut(String statut);
}
