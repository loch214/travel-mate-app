package com.travelmate.repository;

import com.travelmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Tells Spring this is a Repository bean (a managed component)
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA will automatically create a method that finds a user by their email
    // This is like writing "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);

}