package com.vendora.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.vendora.entities.Category;
import com.vendora.entities.Product;
import com.vendora.entities.ProductImage;
import com.vendora.repositories.CategoryRepository;
import com.vendora.repositories.ProductImageRepository;
import com.vendora.repositories.ProductRepository;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;

    public AdminProductService(ProductRepository productRepository,
                               ProductImageRepository productImageRepository,
                               CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.categoryRepository = categoryRepository;
    }

    @org.springframework.transaction.annotation.Transactional
    public Product addProductWithImage(String name,
                                       String description,
                                       Double price,
                                       Integer stock,
                                       Integer categoryId,
                                       String imageUrl) {

        // Validate category
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isEmpty()) {
            throw new IllegalArgumentException("Invalid category ID");
        }

        // Create and save product
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStock(stock);
        product.setCategory(category.get());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        // Save product image
        if (imageUrl != null && !imageUrl.isEmpty()) {
            ProductImage productImage = new ProductImage();
            productImage.setProduct(savedProduct);
            productImage.setImageUrl(imageUrl);

            productImageRepository.save(productImage);
        } else {
            throw new IllegalArgumentException("Product image URL cannot be empty");
        }

        return savedProduct;
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Integer productId) {

        // Check if product exists
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found");
        }

        // Delete associated cart items (Native Query)
        productRepository.deleteCartItemsByProductId(productId);

        // Delete associated order items (Native Query)
        productRepository.deleteOrderItemsByProductId(productId);

        // Delete product images
        productImageRepository.deleteByProductId(productId);

        // Delete product
        productRepository.deleteById(productId);
    }
}
