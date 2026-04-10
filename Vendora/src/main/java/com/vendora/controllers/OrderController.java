package com.vendora.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vendora.entities.Order;
import com.vendora.entities.User;
import com.vendora.services.OrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService; // You should have an OrderRepository & OrderService

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(HttpServletRequest request) {
        User user = (User) request.getAttribute("authenticatedUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Fetch orders where the userId matches the logged-in user
        List<Order> orders = orderService.getOrdersByUserId(user.getUserid());
        return ResponseEntity.ok(orders);
    }
}

