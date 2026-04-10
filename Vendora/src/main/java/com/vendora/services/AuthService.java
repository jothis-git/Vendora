package com.vendora.services;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.vendora.entities.JWTToken;
import com.vendora.entities.User;
import com.vendora.repositories.JWTTokenRespository;
import com.vendora.repositories.UserRepository;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {

	private final Key SIGNING_KEY;
	
	private final UserRepository userRepository;
	private final JWTTokenRespository jwtTokenRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	@Autowired
	public AuthService(UserRepository userRepository, JWTTokenRespository jwtTokenRepository,
			@Value("${jwt.secret}") String jwtSecret) {
		this.userRepository = userRepository;
		this.jwtTokenRepository = jwtTokenRepository;
		this.passwordEncoder = new BCryptPasswordEncoder();
		
		if(jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
			throw new IllegalArgumentException("JWT_SECRET in application.properties must be at least 64 bytes long for HS512.");
		}
		this.SIGNING_KEY = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
		
	}
	
	public User authenticate(String username, String password) {
		System.out.println("USERNAME RECEIVED: " + username);
		System.out.println("PASSWORD RECEIVED: " + password);
		
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("Invalid username or password"));
		
		boolean matches = passwordEncoder.matches(password, user.getPassword());
		System.out.println("AUTH DEBUG: User Found, Password Matches: " + matches);
		
		if(!matches) {
			throw new RuntimeException("Invalid username or password");
		}
		return user;
	}
	
	public String generateToken(User user) {
		System.out.println("AUTH DEBUG: generateToken started for user: " + user.getUsername());
		String token;
		LocalDateTime now = LocalDateTime.now();
		JWTToken existingToken = jwtTokenRepository.findByUserId(user.getUserid());
		
		if(existingToken != null && now.isBefore(existingToken.getExpiresAt())) {
			System.out.println("AUTH DEBUG: Using existing valid token.");
			System.err.println("Token start time: " + (existingToken.getExpiresAt().minusHours(1)));
			System.err.println("Token expiry time: " + existingToken.getExpiresAt());
			token = existingToken.getToken();
		}
		else {
			token  = generateNewToken(user);
			if (existingToken != null) {
				jwtTokenRepository.delete(existingToken);
			}
			saveToken(user, token);
			System.err.println("New token generated at: " + LocalDateTime.now());
			System.err.println("New token expiry time: " + LocalDateTime.now().plusHours(1));
		}
		return token;
	}
	
	private void saveToken(User user, String token) {
		JWTToken jwtToken = new JWTToken(user, token, LocalDateTime.now().plusHours(1));
		jwtTokenRepository.save(jwtToken);
		
	}

	public  String generateNewToken(User user) {
		return Jwts.builder()
				.setSubject(user.getUsername())
				.claim("role", user.getRole().name())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
				.signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
				.compact();

	}

	public boolean validateToken(String token) {
	    try {
	        // 🔥 Step 1: Validate JWT (with clock skew fix)
	        Jwts.parserBuilder()
	            .setSigningKey(SIGNING_KEY)
	            .setAllowedClockSkewSeconds(300) // ✅ FIX: allow 5 min difference
	            .build()
	            .parseClaimsJws(token);

	        // 🔥 Step 2: Check token in DB
	        Optional<JWTToken> jwtToken = jwtTokenRepository.findByToken(token);

	        if (jwtToken.isPresent()) {

	            LocalDateTime expiry = jwtToken.get().getExpiresAt();
	            LocalDateTime now = LocalDateTime.now();

	            // ✅ Null-safe + correct comparison
	            boolean isValid = expiry != null && expiry.isAfter(now);

	            if (isValid) {
	                System.out.println("Token validation success. Expiry: " + expiry);
	            } else {
	                System.out.println("Token expired. Expiry: " + expiry + ", Current: " + now);
	            }

	            return isValid;
	        }

	        System.out.println("Token not found in database");
	        return false;

	    } catch (Exception e) {
	        System.out.println("Token validation failed: " + e.getMessage());
	        return false;
	    }
	}

	public String extractUsername(String token) {
	    return Jwts.parserBuilder()
	        .setSigningKey(SIGNING_KEY)
	        .build()
	        .parseClaimsJws(token)
	        .getBody()
	        .getSubject();
	}

	public void logout(User user) {
		// TODO Auto-generated method stub
		int userId = user.getUserid();
		
		JWTToken token = jwtTokenRepository.findByUserId(userId);
		
		if(token != null) {
			jwtTokenRepository.deleteByUserId(userId);
		}
	}
}
