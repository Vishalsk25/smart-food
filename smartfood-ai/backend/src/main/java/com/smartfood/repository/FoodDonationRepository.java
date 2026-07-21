package com.smartfood.repository;

import com.smartfood.entity.FoodDonation;
import com.smartfood.entity.DonationStatus;
import com.smartfood.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {
    Optional<FoodDonation> findByIdAndDeletedFalse(Long id);
    
    List<FoodDonation> findByStatusAndDeletedFalse(DonationStatus status);
    
    List<FoodDonation> findByCategoryAndStatusAndDeletedFalse(FoodCategory category, DonationStatus status);
    
    List<FoodDonation> findByDonorIdAndDeletedFalse(Long donorId);
    
    @Query("SELECT fd FROM FoodDonation fd WHERE fd.status = :status " +
           "AND fd.latitude BETWEEN :minLat AND :maxLat " +
           "AND fd.longitude BETWEEN :minLng AND :maxLng " +
           "AND fd.expiryTime > :now AND fd.deleted = false")
    List<FoodDonation> findAvailableNearby(
        @Param("status") DonationStatus status,
        @Param("minLat") Double minLat,
        @Param("maxLat") Double maxLat,
        @Param("minLng") Double minLng,
        @Param("maxLng") Double maxLng,
        @Param("now") LocalDateTime now
    );
}
