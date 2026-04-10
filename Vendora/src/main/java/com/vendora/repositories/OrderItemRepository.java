package com.vendora.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import com.vendora.entities.OrderItem;
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
	@Query("select oi from OrderItem oi where order.orderId = :orderId")
	List<OrderItem> findByOrderId(String orderId);
	
	@Query("select oi from OrderItem oi where order.userId = :userId AND order.status = 'SUCCESS'")
	List<OrderItem> findSuccessfulOrderItemsByUserid(int userId);
}
