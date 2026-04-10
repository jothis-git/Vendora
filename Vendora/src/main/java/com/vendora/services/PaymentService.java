package com.vendora.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.vendora.entities.CartItem;
import com.vendora.entities.Order;
import com.vendora.entities.OrderItem;
import com.vendora.entities.OrderStatus;
import com.vendora.repositories.CartRepository;
import com.vendora.repositories.OrderItemRepository;
import com.vendora.repositories.OrderRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

    @Value("${razorpay_key_id}")
    private String razorpayKeyId;

    @Value("${razorpay_key_secret}")
    private String razorpayKeySecret;
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    
    @Autowired
    public PaymentService(OrderRepository orderRepository,
                          OrderItemRepository orderItemRepository,
                          CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public String createOrder(int userId, BigDecimal totalAmount, List<OrderItem> cartItems)
            throws RazorpayException {

        // Create Razorpay client
        RazorpayClient razorpayClient =
                new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Prepare Razorpay order request
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount",
                totalAmount.multiply(BigDecimal.valueOf(100)).intValue()); // in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        // Create order
        com.razorpay.Order razorpayOrder =
                razorpayClient.orders.create(orderRequest);

        // Save order in DB
        Order order = new Order();
        order.setOrderId(razorpayOrder.get("id"));
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        orderRepository.save(order);

        return razorpayOrder.get("id");
    }

    @Transactional
    public boolean verifyPayment(String razorpayOrderId,
                                 String razorpayPaymentId,
                                 String razorpaySignature,
                                 int userId) {

        try {
            // Prepare signature validation
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            // Verify signature
            boolean isValidSignature =
                    com.razorpay.Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (isValidSignature) {

                // Update order status
                Order order = orderRepository.findById(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                order.setStatus(OrderStatus.SUCCESS);
                order.setUpdatedAt(LocalDateTime.now());

                orderRepository.save(order);

                // Fetch cart items
                List<CartItem> cartItems =
                        cartRepository.findByUser_Userid(userId);

                // Save order items
                for (CartItem cartItem : cartItems) {

                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProductId(cartItem.getProduct().getProductId());
                    orderItem.setQuantity(cartItem.getQuantity());

                    orderItem.setPricePerUnit(cartItem.getProduct().getPrice());

                    orderItem.setTotalPrice(
                            cartItem.getProduct().getPrice()
                                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                    );

                    orderItemRepository.save(orderItem);
                }

                // Clear cart
                cartRepository.deleteAllCartItemsByUser_Userid(userId);

                return true;

            } else {
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public void saveOrderItems(String orderId, List<OrderItem> items) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        for (OrderItem item : items) {
            item.setOrder(order);
            orderItemRepository.save(item);
        }
    }
}
