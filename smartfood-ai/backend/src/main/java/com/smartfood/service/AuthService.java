package com.smartfood.service;

import com.smartfood.dto.*;
import com.smartfood.entity.User;
import com.smartfood.entity.UserRole;
import com.smartfood.entity.UserStatus;
import com.smartfood.exception.DuplicateResourceException;
import com.smartfood.exception.ResourceNotFoundException;
import com.smartfood.repository.UserRepository;
import com.smartfood.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO register(UserRegisterDTO dto) {
        // Check if user already exists
        if (userRepository.findByEmailAndDeletedFalse(dto.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User with this email already exists");
        }

        // Create new user
        User user = User.builder()
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword()))
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .phone(dto.getPhone())
            .role(dto.getRole())
            .status(UserStatus.ACTIVE)
            .latitude(dto.getLatitude())
            .longitude(dto.getLongitude())
            .address(dto.getAddress())
            .rewardPoints(0)
            .deleted(false)
            .build();

        User savedUser = userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(() -> savedUser.getEmail(), 
            List.of(() -> savedUser.getRole().toString()));

        return AuthResponseDTO.builder()
            .token(token)
            .user(mapToUserDTO(savedUser))
            .expiresAt(LocalDateTime.now().plusSeconds(jwtUtil.getExpirationTime() / 1000))
            .build();
    }

    public AuthResponseDTO login(UserLoginDTO dto) {
        User user = userRepository.findByEmailAndDeletedFalse(dto.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResourceNotFoundException("User account is not active");
        }

        // Generate token
        String token = jwtUtil.generateToken(() -> user.getEmail(), 
            List.of(() -> user.getRole().toString()));

        return AuthResponseDTO.builder()
            .token(token)
            .user(mapToUserDTO(user))
            .expiresAt(LocalDateTime.now().plusSeconds(jwtUtil.getExpirationTime() / 1000))
            .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmailAndDeletedFalse(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .phone(user.getPhone())
            .role(user.getRole())
            .status(user.getStatus())
            .latitude(user.getLatitude())
            .longitude(user.getLongitude())
            .address(user.getAddress())
            .rewardPoints(user.getRewardPoints())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
