<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration with valid data
     */
    public function test_user_can_register_with_valid_data()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'recaptcha_token' => 'fake-token' // Mock token
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'message', 'data']);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    /**
     * Test registration fails with invalid email
     */
    public function test_registration_fails_with_invalid_email()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'recaptcha_token' => 'fake-token'
        ]);

        $response->assertStatus(422); // Validation error
    }

    /**
     * Test registration fails with existing email
     */
    public function test_registration_fails_with_existing_email()
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'recaptcha_token' => 'fake-token'
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test registration requires reCAPTCHA token
     */
    public function test_registration_requires_recaptcha_token()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!'
            // Missing recaptcha_token
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'reCAPTCHA token is required');
    }

    /**
     * Test user can login with valid credentials
     */
    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('Password123!')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'Password123!',
            'recaptcha_token' => 'fake-token'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'message', 'data' => ['token']]);
    }

    /**
     * Test login fails with wrong password
     */
    public function test_login_fails_with_wrong_password()
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('Password123!')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'WrongPassword',
            'recaptcha_token' => 'fake-token'
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test login fails with non-existent email
     */
    public function test_login_fails_with_non_existent_email()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'Password123!',
            'recaptcha_token' => 'fake-token'
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test login requires reCAPTCHA token
     */
    public function test_login_requires_recaptcha_token()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'Password123!'
            // Missing recaptcha_token
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'reCAPTCHA token is missing');
    }

    /**
     * Test authenticated user can get their profile
     */
    public function test_authenticated_user_can_get_profile()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/auth/me');

        $response->assertStatus(200);
        $response->assertJsonPath('data.email', $user->email);
    }

    /**
     * Test unauthenticated user cannot access protected endpoint
     */
    public function test_unauthenticated_user_cannot_access_protected_endpoint()
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }

    /**
     * Test user can logout
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200);
    }

    /**
     * Test failed login attempts are logged
     */
    public function test_failed_login_attempts_are_logged()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'WrongPassword',
            'recaptcha_token' => 'fake-token'
        ]);

        $response->assertStatus(401);
        // Verify failed attempt was logged
        $this->assertDatabaseHas('failed_authentications', [
            'identifier' => 'user@example.com'
        ]);
    }
}
