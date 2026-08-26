use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};

fn main() {
    println!("=== JVK Rust Argon2 Security Verification Service ===");
    
    let default_user = "admin";
    let password_to_hash = b"adminjvk2026";

    // Generate random salt for Argon2id hashing
    let salt = SaltString::generate(&mut OsRng);

    // Initialize Argon2 instance with default parameters (Argon2id)
    let argon2 = Argon2::default();

    // Hash the password with Argon2
    let password_hash = argon2
        .hash_password(password_to_hash, &salt)
        .expect("Failed to hash password with Argon2");

    println!("Target User: {}", default_user);
    println!("Argon2 Hashed PHC String:\n{}", password_hash);

    // Verify correct password
    let parsed_hash = PasswordHash::new(&password_hash.to_string()).unwrap();
    let is_valid = argon2.verify_password(b"adminjvk2026", &parsed_hash).is_ok();

    println!("Verification test for 'adminjvk2026': {}", if is_valid { "PASSED (AUTHENTICATED)" } else { "FAILED" });
}
