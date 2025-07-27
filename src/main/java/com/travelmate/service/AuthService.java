package com.travelmate.service;

import com.travelmate.dto.LoginRequest;
import com.travelmate.model.User;
import com.travelmate.model.UserRole;
import com.travelmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new passenger.
     */
    public void register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("Email already in use.");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(UserRole.PASSENGER);

        userRepository.save(newUser);
    }

    /**
     * Authenticates a user and establishes a session.
     * @param loginRequest The user's login credentials.
     */
    public void login(LoginRequest loginRequest) {
        // This uses Spring Security's manager to validate the username and password.
        // If credentials are bad, it will throw an exception.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // If authentication is successful, we store the user's session details
        // in the SecurityContextHolder. This is how Spring knows the user is logged in.
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}