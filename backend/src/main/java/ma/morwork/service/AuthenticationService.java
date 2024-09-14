package ma.morwork.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import ma.morwork.dto.AuthenticationRequest;
import ma.morwork.dto.RegisterRequest;
import ma.morwork.dto.AuthenticationResponse;
import ma.morwork.auth.TokenType;
import ma.morwork.modele.Token;
import ma.morwork.modele.User;
import ma.morwork.repository.TokenRepository;
import ma.morwork.repository.UserRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request) {
    String username = request.getFirstname().toLowerCase() + "-" + request.getLastname().toLowerCase();
    String firstName = Character.toUpperCase(request.getFirstname().charAt(0)) + request.getFirstname().substring(1).toLowerCase();
    String lastName = Character.toUpperCase(request.getLastname().charAt(0)) + request.getLastname().substring(1).toLowerCase();
    String profilePicture = "avatar.jpg";
    String coverPicture = "cover.jpg";

    var user = User.builder()
            .firstName(firstName)
            .lastName(lastName)
            .email(request.getEmail())
            .username(username)
            .password(passwordEncoder.encode(request.getPassword()))
            .profilePicture(profilePicture)
            .coverPicture(coverPicture)
            .build();

    User savedUser;
    try {
      savedUser = repository.save(user);
    } catch (DataIntegrityViolationException e) {
      username = request.getFirstname().toLowerCase() + request.getLastname().toLowerCase();
      user = User.builder()
              .firstName(firstName)
              .lastName(lastName)
              .email(request.getEmail())
              .username(username)
              .password(passwordEncoder.encode(request.getPassword()))
              .profilePicture(profilePicture)
              .coverPicture(coverPicture)
              .build();
      savedUser = repository.save(user);
    }

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .userId(user.getId())
        .build();
  }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception {
      var user = repository.findByEmail(request.getEmail())
              .orElseThrow(() -> new UsernameNotFoundException("User does not exist!"));
      try {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );



        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .build();
      } catch (AuthenticationException e) {
        throw new BadCredentialsException("Incorrect password!", e);
      }



    }

  private void saveUserToken(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
  }

  private void revokeAllUserTokens(User user) {
    List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }
}
