package com.vendora.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.vendora.entities.JWTToken;

public interface JWTTokenRespository extends JpaRepository<JWTToken, Integer> {
	// Custom query to find token by user id
	@Query("SELECT t FROM JWTToken t WHERE t.user.userid = :userId")
	JWTToken findByUserId(@Param("userId")int userId);
	Optional<JWTToken> findByToken(String token);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM JWTToken t WHERE t.user.userid = :userId")
	void deleteByUserId(@Param("userId") int userId);
}
