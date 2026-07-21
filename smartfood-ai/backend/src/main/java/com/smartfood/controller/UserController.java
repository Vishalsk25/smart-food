package com.smartfood.controller;

import com.smartfood.dto.UserDTO;
import com.smartfood.dto.UserUpdateDTO;
import com.smartfood.entity.User;
import com.smartfood.exception.ResourceNotFoundException;
import com.smartfood.repository.UserRepository;
import com.smartfood.service.AuthService;
import com.smartfood.util.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/users")
public class UserController {
    private final UserRepository userRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping
    public ApiResponse<List<UserDTO>> listUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
            .filter(u -> !u.isDeleted())
            .map(authService::mapToUserDTO)
            .collect(Collectors.toList());
        return ApiResponse.success(users);
    }

    @PutMapping("/{id}")
    public ApiResponse<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO dto) {
        User user = userRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getLatitude() != null) user.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) user.setLongitude(dto.getLongitude());
        return ApiResponse.success(authService.mapToUserDTO(userRepository.save(user)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setDeleted(true);
        userRepository.save(user);
        return ApiResponse.success("User deleted");
    }
}
