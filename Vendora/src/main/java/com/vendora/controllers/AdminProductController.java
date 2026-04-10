package com.vendora.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vendora.entities.Product;
import com.vendora.services.AdminProductService;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> productRequest) {
        try {
            String name = (String) productRequest.get("name");
            String description = (String) productRequest.get("description");
            Double price = Double.valueOf(String.valueOf(productRequest.get("price")));
            Integer stock = Integer.valueOf(String.valueOf(productRequest.get("stock")));
            Integer categoryId = Integer.valueOf(String.valueOf(productRequest.get("categoryId")));
            String imageUrl = (String) productRequest.get("imageUrl");

            Product addedProduct = adminProductService.addProductWithImage(
                    name, description, price, stock, categoryId, imageUrl
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(addedProduct);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProduct(@RequestBody Map<String, Object> requestBody) {
        try {
            Integer productId = Integer.valueOf(String.valueOf(requestBody.get("productId")));

            adminProductService.deleteProduct(productId);

            return ResponseEntity.status(HttpStatus.OK)
                    .body("Product deleted successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}
