<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Resources\OrderResource;
use App\Mail\OrderStatusUpdatedMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with('servicePack')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        $oldStatus = $order->status;
        $order->update(['status' => $validated['status']]);
        $order->load('servicePack');

        try {
            Mail::to($order->email)->send(new OrderStatusUpdatedMail($order, $oldStatus));
        } catch (\Exception $e) {
            Log::warning('Order status email failed: ' . $e->getMessage());
        }

        Log::info('Order status updated', [
            'order_id' => $order->id,
            'new_status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'data' => new OrderResource($order->fresh('servicePack')),
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new OrderResource($order->load('servicePack')),
        ]);
    }

    public function destroy(Order $order): JsonResponse
    {
        Log::info('Order deleted', ['order_id' => $order->id]);
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted',
        ]);
    }
}
