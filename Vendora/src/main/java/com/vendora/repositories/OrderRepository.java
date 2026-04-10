package com.vendora.repositories;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vendora.entities.Order;
import com.vendora.entities.OrderStatus;
@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    @Query("SELECT o FROM Order o WHERE DATE(o.createdAt) = :date AND o.status = :status")
    List<Order> findSuccessfulOrdersByCreatedAt(@Param("date")LocalDate date, @Param("status") OrderStatus status);
	
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND o.status = :status")
	List<Order> findSuccessfulOrdersByYear(@Param("year") int year, @Param("status") OrderStatus status);
	
	@Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = :status")
	BigDecimal calculateOverallBussiness(@Param("status") OrderStatus status);
	
	@Query("SELECT o FROM Order o WHERE o.status = :status")
	List<Order> findAllByStatus(@Param("status") OrderStatus status);

	
	 @Query(value = "SELECT * FROM orders WHERE user_id = :userId", nativeQuery = true)
	    List<Order> findByUserId(@Param("userId") Integer userId);

	 @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND o.status = :status")
	 List<Order> findSuccessfulOrdersByMonthAndYear(@Param("month") int month, @Param("year") int year, @Param("status") OrderStatus status);
	

}
