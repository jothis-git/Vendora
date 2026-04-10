package com.vendora.services;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vendora.entities.Role;
import com.vendora.entities.User;
import com.vendora.repositories.JWTTokenRespository;
import com.vendora.repositories.UserRepository;

@Service
public class AdminUserService {
    private final UserRepository userRepository;
    private final JWTTokenRespository jwtTokenRepository;

    public AdminUserService(UserRepository userRepository, JWTTokenRespository jwtTokenRepository) {
        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
    }

    @Transactional
    public User modifyUser(Integer userId, String username, String email, String role) {
        // Check if the user exists
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User existingUser = userOptional.get();

        // Update user fields
        if (username != null && !username.isEmpty()) {
            existingUser.setUsername(username);
        }

        if (email != null && !email.isEmpty()) {
            existingUser.setEmail(email);
        }

        if (role != null && !role.isEmpty()) {
            try {
                existingUser.setRole(Role.valueOf(role));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role: " + role);
            }
        }

        // Delete associated JWT tokens
        jwtTokenRepository.deleteByUserId(userId);

        // Save updated user
        return userRepository.save(existingUser);
    }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}