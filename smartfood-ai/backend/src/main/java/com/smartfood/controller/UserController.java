package com.smartfood.controller;

import com.smartfood.dto.ApiResponse;
import com.smartfood.dto.UserDTO;
import com.smartfood.dto.UserUpdateDTO;
import com.smartfood.entity.User;
import com.smartfood.exception.ResourceNotFoundException;
import com.smartfood.repository.UserRepository;
import com.smartfood.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final AuthService authService;

    @GetMapping
    public com.smartfood.util.ApiResponse<List<UserDTO>> listUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
            .filter(u -> !u.isDeleted())
            .map(authService::mapToUserDTO)
            .collect(Collectors.toList());
        return com.smartfood.util.ApiResponse.success(users);
    }

    @PutMapping("/{id}")
    public com.smartfood.util.ApiResponse<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO dto) {
        User user = userRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getLatitude() != null) user.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) user.setLongitude(dto.getLongitude());

        User saved = userRepository.save(user);
        return com.smartfood.util.ApiResponse.success(authService.mapToUserDTO(saved));
    }

    @DeleteMapping("/{id}")
    public com.smartfood.util.ApiResponse<String> deleteUser(@PathVariable Long id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setDeleted(true);
        userRepository.save(user);
        return com.smartfood.util.ApiResponse.success("User deleted", "User deleted");
    }
}
