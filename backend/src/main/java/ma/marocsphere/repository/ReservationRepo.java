package ma.marocsphere.repository;

import ma.marocsphere.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Long> {
    List<Reservation> findByClientId(Long clientId);

    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.client LEFT JOIN FETCH r.guide WHERE r.guide.id = :guideId")
    List<Reservation> findByGuideIdWithClient(@Param("guideId") Long guideId);

    List<Reservation> findByGuideId(Long guideId);
    List<Reservation> findByStatut(String statut);
    long countByStatut(String statut);

    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.client LEFT JOIN FETCH r.guide")
    List<Reservation> findAllWithClientAndGuide();
}
