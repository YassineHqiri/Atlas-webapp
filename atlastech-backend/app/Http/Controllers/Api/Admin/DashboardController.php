<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ServicePack;
use App\Models\ContactMessage;
use App\Models\CrmLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();
        
        $totalServicePacks = ServicePack::count();
        $unreadMessages = ContactMessage::where('is_read', false)->count();
        
        $recentOrders = Order::with('servicePack')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        $monthlyOrders = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->get();

        // CRM stats
        $totalLeads = CrmLead::count();
        $newLeadsThisWeek = CrmLead::where('created_at', '>=', now()->subWeek())->count();
        $wonLeads = CrmLead::where('status', 'won')->count();
        $wonValue = CrmLead::where('status', 'won')->sum('estimated_value');

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => [
                    'total_orders' => $totalOrders,
                    'pending_orders' => $pendingOrders,
                    'completed_orders' => $completedOrders,
                    'cancelled_orders' => $cancelledOrders,
                    'total_service_packs' => $totalServicePacks,
                    'unread_messages' => $unreadMessages,
                ],
                'crm' => [
                    'total_leads' => $totalLeads,
                    'new_leads_this_week' => $newLeadsThisWeek,
                    'won_leads' => $wonLeads,
                    'won_value' => (float) $wonValue,
                ],
                'recent_orders' => $recentOrders,
                'monthly_orders' => $monthlyOrders,
            ],
        ]);
    }
}
