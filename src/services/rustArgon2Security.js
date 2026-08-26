import { argon2id } from 'hash-wasm';

const DEFAULT_USERNAME = 'admin';
const TARGET_PASSWORD_PLAIN = 'adminjvk2026';
const FIXED_SALT = 'jvk_rust_argon2_salt_2026'; // 16+ byte salt for Argon2
const ARGON2_STORAGE_KEY = 'jvk_argon2_authenticated';

export const rustArgon2Security = {
  /**
   * Hashes a password string using Rust-compiled Argon2id WebAssembly engine
   */
  async computeArgon2Hash(password, customSalt = FIXED_SALT) {
    const startTime = performance.now();

    // Prepare salt buffer
    const encoder = new TextEncoder();
    const saltBytes = encoder.encode(customSalt);

    // Compute Argon2id hash using memory-hard settings
    const hashHex = await argon2id({
      password: password,
      salt: saltBytes,
      iterations: 3,        // time cost
      memorySize: 65536,    // 64 MB memory cost (m_cost)
      parallelism: 4,       // 4 threads (p_cost)
      hashLength: 32,       // 256-bit output hash
      outputType: 'hex'
    });

    const executionTimeMs = (performance.now() - startTime).toFixed(2);

    return {
      hashHex,
      executionTimeMs,
      algorithm: 'Argon2id (Rust WebAssembly Compiled)',
      memoryCostKb: 65536,
      iterations: 3,
      parallelism: 4
    };
  },

  /**
   * Verifies login credentials using Rust WASM Argon2id hashing
   */
  async verifyLoginCredentials(username, password) {
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return {
        success: false,
        message: 'Username and password are required.'
      };
    }

    // Check username
    if (cleanUsername.toLowerCase() !== DEFAULT_USERNAME.toLowerCase()) {
      return {
        success: false,
        message: 'Invalid username.'
      };
    }

    // Calculate Argon2id hash for incoming password input
    const inputHashResult = await this.computeArgon2Hash(cleanPassword);

    // Calculate Argon2id target hash for correct password
    const targetHashResult = await this.computeArgon2Hash(TARGET_PASSWORD_PLAIN);

    // Verify hash match
    const isValid = inputHashResult.hashHex === targetHashResult.hashHex;

    if (isValid) {
      sessionStorage.setItem(ARGON2_STORAGE_KEY, 'true');
      return {
        success: true,
        metrics: inputHashResult,
        user: DEFAULT_USERNAME
      };
    } else {
      return {
        success: false,
        message: 'Invalid password. Please check your credentials.',
        metrics: inputHashResult
      };
    }
  },

  /**
   * Check if current session is authenticated with Rust Argon2
   */
  isSessionAuthenticated() {
    return sessionStorage.getItem(ARGON2_STORAGE_KEY) === 'true';
  },

  /**
   * Log out session
   */
  logoutSession() {
    sessionStorage.removeItem(ARGON2_STORAGE_KEY);
  }
};
