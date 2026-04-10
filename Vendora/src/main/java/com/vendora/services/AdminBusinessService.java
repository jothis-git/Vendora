package com.vendora.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.vendora.entities.Order;
import com.vendora.entities.OrderItem;
import com.vendora.entities.OrderStatus;
import com.vendora.repositories.OrderItemRepository;
import com.vendora.repositories.OrderRepository;
import com.vendora.repositories.ProductRepository;

@Service
public class AdminBusinessService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public AdminBusinessService(OrderRepository orderRepository,
                                OrderItemRepository orderItemRepository,
                                ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    public Map<String, Object> calculateMonthlyBusiness(int month, int year) {
        List<Order> successfulOrders =
                orderRepository.findSuccessfulOrdersByMonthAndYear(month, year, OrderStatus.SUCCESS);
        return calculateBusinessMetrics(successfulOrders);
    }

    public Map<String, Object> calculateDailyBusiness(LocalDate date) {
        List<Order> successfulOrders =
                orderRepository.findSuccessfulOrdersByCreatedAt(date, OrderStatus.SUCCESS);
        return calculateBusinessMetrics(successfulOrders);
    }

    public Map<String, Object> calculateYearlyBusiness(int year) {
        List<Order> successfulOrders =
                orderRepository.findSuccessfulOrdersByYear(year, OrderStatus.SUCCESS);
        return calculateBusinessMetrics(successfulOrders);
    }

    public Map<String, Object> calculateOverallBusiness() {
        List<Order> successfulOrders =
                orderRepository.findAllByStatus(OrderStatus.SUCCESS);

        BigDecimal totalBusiness = orderRepository.calculateOverallBussiness(OrderStatus.SUCCESS);

        Map<String, Object> response = calculateBusinessMetrics(successfulOrders);
        response.put("totalBusiness", totalBusiness != null ? totalBusiness.doubleValue() : 0.0);

        return response;
    }

    private Map<String, Object> calculateBusinessMetrics(List<Order> orders) {
        double totalRevenue = 0.0;
        Map<String, Integer> categorySales = new HashMap<>();

        for (Order order : orders) {
            totalRevenue += order.getTotalAmount().doubleValue();

            List<OrderItem> items =
                    orderItemRepository.findByOrderId(order.getOrderId());

            for (OrderItem item : items) {
                String categoryName =
                        productRepository.findCategoryNameByProductId(item.getProductId());

                categorySales.put(
                        categoryName,
                        categorySales.getOrDefault(categoryName, 0) + item.getQuantity()
                );
            }
        }

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRevenue", totalRevenue);
        metrics.put("categorySales", categorySales);

        return metrics;
    }
}