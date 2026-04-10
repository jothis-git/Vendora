package com.vendora.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vendora.entities.CartItem;
import com.vendora.entities.Product;
import com.vendora.entities.User;
import com.vendora.repositories.CartRepository;
import com.vendora.repositories.ProductRepository;
import com.vendora.repositories.UserRepository;

@Service
public class CartService {

	UserRepository userRepository;
	
	ProductRepository productRepository;
	
	CartRepository cartRepository;
	
	@Autowired
	public CartService(UserRepository userRepository, ProductRepository productRepository,
			CartRepository cartRepository) {
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.cartRepository = cartRepository;
	}

	public void addToCart(int userId, int productId, int quantity) {

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Product product = productRepository.findById(productId)
	            .orElseThrow(() -> new RuntimeException("Product not found"));

	    Optional<CartItem> existing =
	        cartRepository.findByUser_UseridAndProduct_ProductId(userId, productId);

	    if (existing.isPresent()) {

	        CartItem item = existing.get();
	        item.setQuantity(item.getQuantity() + quantity);
	        cartRepository.save(item);

	    } else {

	        CartItem newItem = new CartItem(user, product, quantity);
	        cartRepository.save(newItem);
	    }
	}
	
	public void removeFromCart(int userId, int productId) {

	    Optional<CartItem> item =
	        cartRepository.findByUser_UseridAndProduct_ProductId(userId, productId);

	    if(item.isPresent()) {

	        cartRepository.delete(item.get());

	    } else {

	        throw new RuntimeException("Cart item not found");

	    }
	}
	
	public void updateQuantity(int userId, int productId, int quantity) {

	    CartItem item = cartRepository
	        .findByUser_UseridAndProduct_ProductId(userId, productId)
	        .orElseThrow(() -> new RuntimeException("Cart item not found"));

	    item.setQuantity(quantity);

	    cartRepository.save(item);
	}

	public List<CartItem> getCart(int userId) {
	    return cartRepository.findByUser_Userid(userId);
	}
	
	public void clearCart(int userId) {
		List<CartItem> items = cartRepository.findByUser_Userid(userId);
		cartRepository.deleteAll(items);
	}
}

