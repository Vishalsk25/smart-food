package com.smartfood.dto;

import com.smartfood.entity.UserRole;
import com.smartfood.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private Long organizationId;
    private Double latitude;
    private Double longitude;
    private String address;
    private Integer rewardPoints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class UserRegisterDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private Long organizationId;
    private Double latitude;
    private Double longitude;
    private String address;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class UserLoginDTO {
    private String email;
    private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class UserUpdateDTO {
    private String firstName;
    private String lastName;
    private String phone;
    private Double latitude;
    private Double longitude;
    private String address;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class AuthResponseDTO {
    private String token;
    private String refreshToken;
    private UserDTO user;
    private LocalDateTime expiresAt;
}
