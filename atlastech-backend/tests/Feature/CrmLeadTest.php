<?php

namespace Tests\Feature\CRM;

use App\Models\User;
use App\Models\CrmLead;
use App\Models\CrmNote;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CrmLeadTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $lead;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->lead = CrmLead::factory()->create();
    }

    /**
     * Test admin can view all CRM leads
     */
    public function test_admin_can_view_all_leads()
    {
        CrmLead::factory()->count(5)->create();
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/crm/leads');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data' => ['*' => ['id', 'name', 'email', 'status']]]);
    }

    /**
     * Test non-admin cannot access CRM leads
     */
    public function test_non_admin_cannot_access_crm_leads()
    {
        $user = User::factory()->create(['role' => 'customer']);
        $token = $user->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/crm/leads');

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test admin can create new CRM lead
     */
    public function test_admin_can_create_lead()
    {
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/crm/leads', [
            'name' => 'John Prospect',
            'email' => 'john@prospect.com',
            'phone' => '+1234567890',
            'company' => 'Prospect Inc',
            'status' => 'new'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('crm_leads', [
            'email' => 'john@prospect.com'
        ]);
    }

    /**
     * Test CRM lead requires valid email
     */
    public function test_crm_lead_requires_valid_email()
    {
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/crm/leads', [
            'name' => 'John Prospect',
            'email' => 'invalid-email',
            'phone' => '+1234567890',
            'company' => 'Prospect Inc'
        ]);

        $response->assertStatus(422); // Validation error
    }

    /**
     * Test admin can update lead status
     */
    public function test_admin_can_update_lead_status()
    {
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/crm/leads/{$this->lead->id}", [
            'status' => 'contacted',
            'name' => $this->lead->name,
            'email' => $this->lead->email
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('crm_leads', [
            'id' => $this->lead->id,
            'status' => 'contacted'
        ]);
    }

    /**
     * Test admin can add note to lead
     */
    public function test_admin_can_add_note_to_lead()
    {
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson("/api/admin/crm/leads/{$this->lead->id}/notes", [
            'content' => 'Follow up next week'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('crm_notes', [
            'crm_lead_id' => $this->lead->id,
            'content' => 'Follow up next week'
        ]);
    }

    /**
     * Test admin can delete note from lead
     */
    public function test_admin_can_delete_note()
    {
        $note = CrmNote::factory()->create(['crm_lead_id' => $this->lead->id]);
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/crm/leads/{$this->lead->id}/notes/{$note->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('crm_notes', ['id' => $note->id]);
    }

    /**
     * Test admin can view CRM pipeline
     */
    public function test_admin_can_view_pipeline()
    {
        // Create leads with different statuses
        CrmLead::factory()->create(['status' => 'new']);
        CrmLead::factory()->create(['status' => 'contacted']);
        CrmLead::factory()->create(['status' => 'qualified']);
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/crm/pipeline');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data']);
    }

    /**
     * Test admin can view CRM statistics
     */
    public function test_admin_can_view_crm_stats()
    {
        CrmLead::factory()->count(10)->create();
        
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/crm/stats');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data' => ['total_leads', 'new_leads', 'converted_leads']]);
    }

    /**
     * Test admin can delete lead
     */
    public function test_admin_can_delete_lead()
    {
        $token = $this->adminUser->createToken('test')->plainTextToken;
        
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/crm/leads/{$this->lead->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('crm_leads', ['id' => $this->lead->id]);
    }
}
