package com.vendora.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vendora.entities.Product;
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
	List<Product> findByCategory_CategoryId(Integer categoryId);
	
	@Query("SELECT p.category.categoryName FROM Product p WHERE p.productId = :productId")
	String findCategoryNameByProductId(int productId);

	@org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM cart_items WHERE product_id = :productId", nativeQuery = true)
    void deleteCartItemsByProductId(@Param("productId") int productId);

	@org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM order_items WHERE product_id = :productId", nativeQuery = true)
    void deleteOrderItemsByProductId(@Param("productId") int productId);
}
