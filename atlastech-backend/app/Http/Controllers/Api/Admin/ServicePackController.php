<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServicePack;
use App\Http\Requests\StoreServicePackRequest;
use App\Http\Resources\ServicePackResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServicePackController extends Controller
{
    public function index(): JsonResponse
    {
        $servicePacks = ServicePack::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => ServicePackResource::collection($servicePacks),
        ]);
    }

    public function store(StoreServicePackRequest $request): JsonResponse
    {
        $servicePack = ServicePack::create($request->validated());

        Log::info('Service pack created', ['pack_id' => $servicePack->id, 'name' => $servicePack->name]);

        return response()->json([
            'success' => true,
            'message' => 'Service pack created',
            'data' => new ServicePackResource($servicePack),
        ], 201);
    }

    public function show(ServicePack $servicePack): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new ServicePackResource($servicePack),
        ]);
    }

    public function update(Request $request, ServicePack $servicePack): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'features' => 'sometimes|array',
            'is_active' => 'sometimes|boolean',
        ]);

        $servicePack->update($validated);

        Log::info('Service pack updated', ['pack_id' => $servicePack->id]);

        return response()->json([
            'success' => true,
            'message' => 'Service pack updated',
            'data' => new ServicePackResource($servicePack->fresh()),
        ]);
    }

    public function destroy(ServicePack $servicePack): JsonResponse
    {
        Log::info('Service pack deleted', ['pack_id' => $servicePack->id, 'name' => $servicePack->name]);
        $servicePack->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service pack deleted',
        ]);
    }
}
