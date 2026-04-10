package com.vendora.services;


import com.vendora.entities.Order;
import com.vendora.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getOrdersByUserId(Integer userId) {
    	return orderRepository.findByUserId(userId);
    }

	
}

