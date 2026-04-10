package com.vendora.filters;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.vendora.entities.Role;
import com.vendora.entities.User;
import com.vendora.repositories.UserRepository;
import com.vendora.services.AuthService;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@WebFilter(urlPatterns = {"/api/*", "/admin/*"})
public class AuthenticationFilter implements Filter {

    private final AuthService authService;
    private final UserRepository userRepository;

    private static final String ALLOWED_ORIGIN = "http://localhost:5173";


	
	
	public AuthenticationFilter(AuthService authService, UserRepository userRepository) {
	    this.authService = authService;
	    this.userRepository = userRepository;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
	        throws IOException, ServletException {
	    try {
	        executeFilterLogic(request, response, chain);
	    } catch (Exception e) {
	        sendErrorResponse((HttpServletResponse) response,
	                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
	                "Internal server error");
	    }
	}

	private void executeFilterLogic(ServletRequest request, ServletResponse response, FilterChain chain)
	        throws IOException, ServletException {

	    HttpServletRequest httpRequest = (HttpServletRequest) request;
	    HttpServletResponse httpResponse = (HttpServletResponse) response;
	    
	    // Always set CORS headers first so they are present on ALL responses (Login, Register, Error, etc.)
	    setCORSHeaders(httpResponse);

	    // Handle preflight  requests
	    if (httpRequest.getMethod().equalsIgnoreCase("OPTIONS")) {
	        httpResponse.setStatus(HttpServletResponse.SC_OK);
	        return;
	    }

	    String requestURI = httpRequest.getRequestURI();

	    // Basic bypass for login and register
	    if (requestURI.startsWith("/api/users/register") || requestURI.startsWith("/api/auth/login")) {
	        chain.doFilter(request, response);
	        return;
	    }

	    // Extract and validate the token
	    String token = getAuthTokenFromCookies(httpRequest);
	    if (token == null || !authService.validateToken(token)) {
	        sendErrorResponse(httpResponse,
	                HttpServletResponse.SC_UNAUTHORIZED,
	                "Unauthorized: Invalid or missing token");
	        return;
	    }

	    // Extract username and verify user
	    String username = authService.extractUsername(token);
	    Optional<User> userOptional = userRepository.findByUsername(username);

	    if (userOptional.isEmpty()) {
	        sendErrorResponse(httpResponse,
	                HttpServletResponse.SC_UNAUTHORIZED,
	                "Unauthorized: User not found");
	        return;
	    }

	    User authenticatedUser = userOptional.get();
	    Role role = authenticatedUser.getRole();

	    // Role-based access control
	    if (requestURI.startsWith("/admin") && role != Role.ADMIN) {
	        sendErrorResponse(httpResponse,
	                HttpServletResponse.SC_FORBIDDEN,
	                "Forbidden: Admin access required");
	        return;
	    }

	    if (requestURI.startsWith("/api") && !requestURI.startsWith("/api/auth") && role != Role.CUSTOMER) {
	        sendErrorResponse(httpResponse,
	                HttpServletResponse.SC_FORBIDDEN,
	                "Forbidden: Customer access required");
	        return;
	    }

	    httpRequest.setAttribute("authenticatedUser", authenticatedUser);
	    chain.doFilter(request, response);
}

	        private void setCORSHeaders(HttpServletResponse response) {
	            response.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
	            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	            response.setHeader("Access-Control-Allow-Credentials", "true");
	            
	        }

	        private void sendErrorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
	            response.setStatus(statusCode);
	            response.getWriter().write(message);
	        }

	        private String getAuthTokenFromCookies(HttpServletRequest request) {
	            Cookie[] cookies = request.getCookies();
	            if (cookies != null) {
	                return Arrays.stream(cookies)
	                        .filter(cookie -> "authToken".equals(cookie.getName()))
	                        .map(Cookie::getValue)
	                        .findFirst()
	                        .orElse(null);
	            }
	            return null;
	        }
	}
