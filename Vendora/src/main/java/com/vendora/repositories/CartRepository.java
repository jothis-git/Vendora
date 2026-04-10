package com.vendora.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vendora.entities.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByUser_UseridAndProduct_ProductId(int userId, int productId);

    List<CartItem> findByUser_Userid(int userId);

    void deleteByUser_UseridAndProduct_ProductId(int userId, int productId);


    @Query("SELECT c FROM CartItem c WHERE c.user.userid = :userId")
    Optional<CartItem> deleteAllCartItemsByUser_Userid(int userId);

}