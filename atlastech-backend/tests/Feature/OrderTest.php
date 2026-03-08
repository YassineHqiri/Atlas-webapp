<?php

namespace Tests\Feature\Orders;

use App\Models\User;
use App\Models\Order;
use App\Models\ServicePack;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $adminUser;
    protected $servicePack;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create(['role' => 'customer']);
        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->servicePack = ServicePack::factory()->create();
    }

    /**
     * Test user can view their own orders
     */
    public function test_user_can_view_their_own_orders()
    {
        $order = Order::factory()->create(['user_id' => $this->user->id]);
        
        $token = $this->user->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/orders');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data' => ['*' => ['id', 'total', 'status']]]);
    }

    /**
     * Test user cannot view other user's orders
     */
    public function test_user_cannot_view_other_user_orders()
    {
        $otherUser = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $otherUser->id]);
        
        $token = $this->user->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson("/api/orders/{$order->id}");

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test user can create new order
     */
    public function test_user_can_create_order()
    {
        $token = $this->user->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/orders', [
            'service_pack_id' => $this->servicePack->id,
            'quantity' => 1,
            'total' => $this->servicePack->price
        ]);

        $response->assertStatus(201); // Created
        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'status' => 'pending'
        ]);
    }

    /**
     * Test unauthenticated user cannot create order
     */
    public function test_unauthenticated_user_cannot_create_order()
    {
        $response = $this->postJson('/api/orders', [
            'service_pack_id' => $this->servicePack->id,
            'quantity' => 1,
            'total' => $this->servicePack->price
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test order total is calculated correctly
     */
    public function test_order_total_is_calculated_correctly()
    {
        $token = $this->user->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/orders', [
            'service_pack_id' => $this->servicePack->id,
            'quantity' => 2,
            'total' => $this->servicePack->price * 2
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('orders', [
            'total' => $this->servicePack->price * 2
        ]);
    }

    /**
     * Test admin can view all orders
     */
    public function test_admin_can_view_all_orders()
    {
        Order::factory()->count(5)->create();
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/orders');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data' => ['*' => ['id', 'user_id', 'total', 'status']]]);
    }

    /**
     * Test admin can update order status
     */
    public function test_admin_can_update_order_status()
    {
        $order = Order::factory()->create(['status' => 'pending']);
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->patchJson("/api/admin/orders/{$order->id}", [
            'status' => 'completed'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'completed'
        ]);
    }

    /**
     * Test non-admin cannot update order status
     */
    public function test_non_admin_cannot_update_order_status()
    {
        $order = Order::factory()->create(['status' => 'pending']);
        
        $token = $this->user->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->patchJson("/api/admin/orders/{$order->id}", [
            'status' => 'completed'
        ]);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test order status transitions are valid
     */
    public function test_order_status_must_be_valid()
    {
        $order = Order::factory()->create();
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->patchJson("/api/admin/orders/{$order->id}", [
            'status' => 'invalid_status'
        ]);

        $response->assertStatus(422); // Validation error
    }

    /**
     * Test order can be deleted by admin
     */
    public function test_admin_can_delete_order()
    {
        $order = Order::factory()->create();
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/orders/{$order->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }
}
