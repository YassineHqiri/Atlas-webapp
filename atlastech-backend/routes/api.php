<?php

use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\ServicePackController;
use App\Http\Controllers\Api\Admin\CrmController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register'])->middleware(['protect.auth', 'throttle:3,60']); // 3 per hour (SECURITY FIX)
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login'])->middleware(['protect.auth', 'throttle:5,1']); // 5 per minute (SECURITY FIX)
    Route::post('/forgot-password', [\App\Http\Controllers\Api\AuthController::class, 'forgotPassword'])->middleware('throttle:3,60'); // 3 per hour (SECURITY FIX)
    Route::post('/reset-password', [\App\Http\Controllers\Api\AuthController::class, 'resetPassword'])->middleware('throttle:5,60'); // 5 per hour (SECURITY FIX)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [\App\Http\Controllers\Api\AuthController::class, 'me']);
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    });
});

Route::prefix('customer')->middleware(['auth:sanctum', 'customer'])->group(function () {
    Route::get('/orders', [\App\Http\Controllers\Api\CustomerController::class, 'orders']);
    Route::get('/profile', [\App\Http\Controllers\Api\CustomerController::class, 'profile']);
    Route::put('/profile', [\App\Http\Controllers\Api\CustomerController::class, 'updateProfile']);
    Route::put('/password', [\App\Http\Controllers\Api\CustomerController::class, 'changePassword']);
});

Route::prefix('public')->group(function () {
    Route::get('/service-packs', [PublicController::class, 'servicePacks']);
    Route::post('/orders', [PublicController::class, 'order'])->middleware(['optionalAuth', 'throttle:10,60']); // 10 per hour (SECURITY FIX)
    Route::post('/contact', [PublicController::class, 'contact'])->middleware('throttle:5,60'); // 5 per hour (SECURITY FIX)
});

Route::prefix('chatbot')->group(function () {
    Route::post('/reply', [ChatbotController::class, 'reply'])->middleware('throttle:10,1'); // 10 per minute (SECURITY FIX)
});

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:3,5'); // 3 per 5 minutes (SECURITY FIX)
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/orders/{order}', [OrderController::class, 'updateStatus']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
        
        Route::get('/service-packs', [ServicePackController::class, 'index']);
        Route::post('/service-packs', [ServicePackController::class, 'store']);
        Route::get('/service-packs/{servicePack}', [ServicePackController::class, 'show']);
        Route::put('/service-packs/{servicePack}', [ServicePackController::class, 'update']);
        Route::delete('/service-packs/{servicePack}', [ServicePackController::class, 'destroy']);

        // CRM
        Route::prefix('crm')->group(function () {
            Route::get('/stats',                              [CrmController::class, 'stats']);
            Route::get('/pipeline',                          [CrmController::class, 'pipeline']);
            Route::get('/leads',                             [CrmController::class, 'index']);
            Route::post('/leads',                            [CrmController::class, 'store']);
            Route::get('/leads/{lead}',                      [CrmController::class, 'show']);
            Route::put('/leads/{lead}',                      [CrmController::class, 'update']);
            Route::delete('/leads/{lead}',                   [CrmController::class, 'destroy']);
            Route::post('/leads/{lead}/notes',               [CrmController::class, 'addNote']);
            Route::delete('/leads/{lead}/notes/{note}',      [CrmController::class, 'deleteNote']);
        });
    });
});
