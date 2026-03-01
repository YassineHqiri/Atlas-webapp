<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServicePack;
use App\Models\Order;
use App\Models\ContactMessage;
use App\Models\CrmLead;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\StoreContactRequest;
use App\Http\Resources\ServicePackResource;
use App\Http\Resources\OrderResource;
use App\Mail\OrderConfirmationMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PublicController extends Controller
{
    public function servicePacks(): JsonResponse
    {
        $servicePacks = ServicePack::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'data' => ServicePackResource::collection($servicePacks),
        ]);
    }

    public function order(StoreOrderRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            // If customer is logged in, link order to user and use their data
            if ($request->user() && $request->user()->isCustomer()) {
                $data['user_id'] = $request->user()->id;
                $data['customer_name'] = $request->user()->name;
                $data['email'] = $request->user()->email;
            }

            // Find or create CRM lead and link order
            $lead = CrmLead::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'   => $data['customer_name'],
                    'phone'  => $data['phone'] ?? null,
                    'status' => 'new',
                    'source' => 'manual',
                ]
            );
            $data['crm_lead_id'] = $lead->id;

            $order = Order::create($data);
            $order->load('servicePack');

            try {
                Mail::to($order->email)->send(new OrderConfirmationMail($order));
            } catch (\Exception $e) {
                Log::warning('Order confirmation email failed: ' . $e->getMessage());
            }

            Log::info('New order created', [
                'order_id' => $order->id,
                'email' => $order->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'data' => new OrderResource($order),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order. Please try again.',
            ], 500);
        }
    }

    public function contact(StoreContactRequest $request): JsonResponse
    {
        try {
            $contact = ContactMessage::create($request->validated());

            Log::info('New contact message received', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
            ]);

            // Auto-create CRM lead from contact form submission
            CrmLead::create([
                'name'                => $contact->name,
                'email'               => $contact->email,
                'status'              => 'new',
                'source'              => 'contact_form',
                'contact_message_id'  => $contact->id,
                'message'             => $contact->message ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully!',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Contact form submission failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again.',
            ], 500);
        }
    }
}
