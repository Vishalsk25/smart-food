package com.smartfood.repository;

import com.smartfood.entity.User;
import com.smartfood.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndDeletedFalse(String email);
    Optional<User> findByIdAndDeletedFalse(Long id);
    List<User> findByRoleAndDeletedFalse(UserRole role);
    List<User> findByOrganizationIdAndDeletedFalse(Long organizationId);
    
    @Query("SELECT u FROM User u WHERE u.latitude BETWEEN :minLat AND :maxLat " +
           "AND u.longitude BETWEEN :minLng AND :maxLng " +
           "AND u.role = :role AND u.deleted = false")
    List<User> findByLocationAndRole(Double minLat, Double maxLat, Double minLng, Double maxLng, UserRole role);
}
