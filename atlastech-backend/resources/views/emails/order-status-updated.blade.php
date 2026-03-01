<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 24px; }
        .card { background: #f9fafb; border-radius: 12px; padding: 24px; margin: 16px 0; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .footer { margin-top: 32px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 24px;">AtlasTech Solutions</h1>
        <p style="margin: 8px 0 0; color: #6b7280;">Order Status Update</p>
    </div>

    <p>Hi {{ $order->customer_name }},</p>
    <p>Your order status has been updated.</p>

    <div class="card">
        <p style="margin: 0 0 8px;"><strong>Order #{{ $order->id }}</strong></p>
        <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">{{ ucfirst($oldStatus) }} → <strong>{{ ucfirst($order->status) }}</strong></p>
        <span class="status status-{{ $order->status }}">{{ ucfirst($order->status) }}</span>
        <p style="margin: 16px 0 0;">
            <strong>Service Pack:</strong> {{ $order->servicePack?->name ?? 'N/A' }}
        </p>
    </div>

    @if($order->status === 'completed')
    <p>Your project has been completed. Thank you for choosing AtlasTech!</p>
    @elseif($order->status === 'cancelled')
    <p>If you have any questions, please contact us.</p>
    @else
    <p>We'll keep you updated on the progress.</p>
    @endif

    <div class="footer">
        <p>AtlasTech Solutions – Web Development for SMEs</p>
    </div>
</body>
</html>
