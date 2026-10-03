package com.jvk.school.service;

import com.jvk.school.config.JwtTokenProvider;
import com.jvk.school.dto.*;
import com.jvk.school.exception.ResourceNotFoundException;
import com.jvk.school.exception.TokenRefreshException;
import com.jvk.school.model.RefreshToken;
import com.jvk.school.model.User;
import com.jvk.school.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String accessToken = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUsername()));

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getJwtExpirationMs(),
                user.getUsername(),
                user.getRole()
        );
    }

    @Transactional
    public TokenRefreshResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = tokenProvider.generateTokenFromUsername(user.getUsername());
                    return new TokenRefreshResponse(
                            accessToken,
                            requestRefreshToken,
                            tokenProvider.getJwtExpirationMs()
                    );
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
    }

    @Bean
    public CommandLineRunner initDefaultUsers() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User("admin", passwordEncoder.encode("admin123"), "ROLE_ADMIN");
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("teacher").isEmpty()) {
                User teacher = new User("teacher", passwordEncoder.encode("teacher123"), "ROLE_TEACHER");
                userRepository.save(teacher);
            }
        };
    }
}
