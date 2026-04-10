package com.vendora.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.vendora.entities.CartItem;
import com.vendora.entities.User;
import com.vendora.services.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    
    @PostMapping("/add")
    public String addToCart(@RequestBody Map<String, Object> request,
                            HttpServletRequest httpRequest) {

        User user = (User) httpRequest.getAttribute("authenticatedUser");

        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        int productId = (int) request.get("productId");

        int quantity = request.containsKey("quantity")
                ? (int) request.get("quantity")
                : 1;

        cartService.addToCart(user.getUserid(), productId, quantity);

        return "Product added to cart";
    }
    
    @GetMapping
    public ResponseEntity<?> getCart(HttpServletRequest request) {

        User user = (User) request.getAttribute("authenticatedUser");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        List<CartItem> cartItems = cartService.getCart(user.getUserid());

        return ResponseEntity.ok(cartItems);
    }
    
    @DeleteMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable int productId,
                                 HttpServletRequest request) {

        User user = (User) request.getAttribute("authenticatedUser");

        cartService.removeFromCart(user.getUserid(), productId);

        return "Item removed from cart";
    }
    
    @PutMapping("/update")
    public String updateQuantity(@RequestBody Map<String, Integer> request,
                                 HttpServletRequest httpRequest) {

        User user = (User) httpRequest.getAttribute("authenticatedUser");

        int productId = request.get("productId");
        int quantity = request.get("quantity");

        cartService.updateQuantity(user.getUserid(), productId, quantity);

        return "Quantity updated";
    }
    
    @DeleteMapping
    public String clearCart(HttpServletRequest httRequest) {
	    	User user = (User)httRequest.getAttribute("authenticatedUser");
	    	cartService.clearCart(user.getUserid());
	    	return "cart cleared";
	    }
    
}
