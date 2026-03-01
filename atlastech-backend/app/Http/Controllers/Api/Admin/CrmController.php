<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmLead;
use App\Models\CrmNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CrmController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrmLead::withCount('notes')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $leads = $query->get();

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'email'             => 'nullable|email|max:255',
            'phone'             => 'nullable|string|max:50',
            'company'           => 'nullable|string|max:255',
            'status'            => 'sometimes|in:new,contacted,qualified,won,lost',
            'source'            => 'sometimes|in:manual,contact_form',
            'service_interest'  => 'nullable|string|max:255',
            'estimated_value'   => 'nullable|numeric|min:0',
            'message'           => 'nullable|string',
        ]);

        $validated['source'] = $validated['source'] ?? 'manual';
        $lead = CrmLead::create($validated);

        Log::info('CRM lead created', ['lead_id' => $lead->id, 'name' => $lead->name]);

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully',
            'data' => $lead->loadCount('notes'),
        ], 201);
    }

    public function show(CrmLead $lead): JsonResponse
    {
        $lead->load(['notes', 'contactMessage']);

        // Fetch orders by email (covers both linked and historical orders)
        $orders = $lead->email
            ? \App\Models\Order::with('servicePack')->where('email', $lead->email)->orderBy('created_at', 'desc')->get()
            : collect();
        $lead->setRelation('orders', $orders);

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }

    public function update(Request $request, CrmLead $lead): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'email'            => 'sometimes|nullable|email|max:255',
            'phone'            => 'sometimes|nullable|string|max:50',
            'company'          => 'sometimes|nullable|string|max:255',
            'status'           => 'sometimes|in:new,contacted,qualified,won,lost',
            'service_interest' => 'sometimes|nullable|string|max:255',
            'estimated_value'  => 'sometimes|nullable|numeric|min:0',
            'message'          => 'sometimes|nullable|string',
        ]);

        $lead->update($validated);

        Log::info('CRM lead updated', ['lead_id' => $lead->id]);

        return response()->json([
            'success' => true,
            'message' => 'Lead updated',
            'data' => $lead->fresh()->load('notes')->loadCount('notes'),
        ]);
    }

    public function destroy(CrmLead $lead): JsonResponse
    {
        Log::info('CRM lead deleted', ['lead_id' => $lead->id, 'name' => $lead->name]);
        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted',
        ]);
    }

    public function pipeline(): JsonResponse
    {
        $statuses = ['new', 'contacted', 'qualified', 'won', 'lost'];

        $leads = CrmLead::withCount('notes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('status');

        $pipeline = [];
        foreach ($statuses as $status) {
            $pipeline[$status] = $leads->get($status, collect())->values();
        }

        return response()->json([
            'success' => true,
            'data' => $pipeline,
        ]);
    }

    public function addNote(Request $request, CrmLead $lead): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $note = $lead->notes()->create([
            'crm_lead_id' => $lead->id,
            'content'     => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note added',
            'data' => $note,
        ], 201);
    }

    public function deleteNote(CrmLead $lead, CrmNote $note): JsonResponse
    {
        if ($note->crm_lead_id !== $lead->id) {
            return response()->json(['success' => false, 'message' => 'Note does not belong to this lead'], 403);
        }

        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note deleted',
        ]);
    }

    public function stats(): JsonResponse
    {
        $total     = CrmLead::count();
        $byStatus  = CrmLead::selectRaw('status, COUNT(*) as count')->groupBy('status')->pluck('count', 'status');
        $bySource  = CrmLead::selectRaw('source, COUNT(*) as count')->groupBy('source')->pluck('count', 'source');
        $recentLeads = CrmLead::orderBy('created_at', 'desc')->limit(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total'        => $total,
                'by_status'    => $byStatus,
                'by_source'    => $bySource,
                'recent_leads' => $recentLeads,
            ],
        ]);
    }
}
