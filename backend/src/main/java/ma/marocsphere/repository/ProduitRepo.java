package ma.marocsphere.repository;

import ma.marocsphere.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepo extends JpaRepository<Produit, Long> {
    List<Produit> findByArtisanId(Long artisanId);
}
