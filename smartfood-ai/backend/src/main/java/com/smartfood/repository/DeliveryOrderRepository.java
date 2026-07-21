package com.smartfood.repository;

import com.smartfood.entity.DeliveryOrder;
import com.smartfood.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrder, Long> {
    Optional<DeliveryOrder> findByIdAndDeletedFalse(Long id);
    
    List<DeliveryOrder> findByStatusAndDeletedFalse(DeliveryStatus status);
    
    List<DeliveryOrder> findByVolunteerIdAndDeletedFalse(Long volunteerId);
    
    List<DeliveryOrder> findByRecipientIdAndDeletedFalse(Long recipientId);
    
    List<DeliveryOrder> findByDonationIdAndDeletedFalse(Long donationId);
}
