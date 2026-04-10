package com.vendora.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vendora.dto.LoginRequest;
import com.vendora.entities.JWTToken;
import com.vendora.entities.User;
import com.vendora.repositories.JWTTokenRespository;
import com.vendora.services.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;
	private final JWTTokenRespository jwtTokenRepository;

	@Autowired
	public AuthController(AuthService authService, JWTTokenRespository jwtTokenRepository) {
		this.authService = authService;
		this.jwtTokenRepository = jwtTokenRepository;
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request,
	                               HttpServletResponse response) {

	    User user = authService.authenticate(request.getUsername(), request.getPassword());

	    String token = authService.generateNewToken(user);

	    // 🔥 SAVE TOKEN IN DB (THIS IS YOUR MISSING PART)
	    JWTToken jwtToken = new JWTToken();
	    jwtToken.setToken(token);
	    jwtToken.setUser(user);
	    jwtToken.setExpiresAt(LocalDateTime.now().plusHours(1));

	    jwtTokenRepository.save(jwtToken);

	    // 🔥 SET COOKIE
	    response.addHeader("Set-Cookie",
	        "authToken=" + token +
	        "; Path=/" +
	        "; HttpOnly" +
	        "; Max-Age=3600" +
	        "; SameSite=Lax");

	    return ResponseEntity.ok("Login successful");
	}
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
	    // 1. Create a cookie with the SAME NAME but NULL value
	    Cookie cookie = new Cookie("authToken", null);
	    cookie.setPath("/"); // Very important: must match your login path
	    cookie.setHttpOnly(true);
	    cookie.setMaxAge(0); // Sets expiry to the past (deletes it)
	    response.addCookie(cookie);

	    return ResponseEntity.ok(Map.of("message", "Success"));
	}

	
	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
	    User user = (User) request.getAttribute("authenticatedUser");
	    if (user != null) {
	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("userid", user.getUserid()); 
	        responseBody.put("username", user.getUsername());
	        responseBody.put("role", user.getRole());
	        responseBody.put("email", user.getEmail());
	        responseBody.put("CreatedAt", user.getCreatedAt());
	      
	        return ResponseEntity.ok(responseBody);
	    }
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}


}
