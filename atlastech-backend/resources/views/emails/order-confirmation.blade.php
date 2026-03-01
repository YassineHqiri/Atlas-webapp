<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 24px; }
        .card { background: #f9fafb; border-radius: 12px; padding: 24px; margin: 16px 0; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; }
        .footer { margin-top: 32px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 24px;">AtlasTech Solutions</h1>
        <p style="margin: 8px 0 0; color: #6b7280;">Order Confirmation</p>
    </div>

    <p>Hi {{ $order->customer_name }},</p>
    <p>Thank you for your order! We've received your request and will contact you shortly.</p>

    <div class="card">
        <p style="margin: 0 0 8px;"><strong>Order #{{ $order->id }}</strong></p>
        <span class="status">{{ ucfirst($order->status) }}</span>
        <p style="margin: 16px 0 0;">
            <strong>Service Pack:</strong> {{ $order->servicePack?->name ?? 'N/A' }}<br>
            <strong>Price:</strong> {{ number_format($order->servicePack?->price ?? 0, 2) }} DH
        </p>
        @if($order->notes)
        <p style="margin: 12px 0 0;"><strong>Notes:</strong> {{ $order->notes }}</p>
        @endif
    </div>

    <p>Our team will reach out within 24 hours to discuss your project.</p>

    <div class="footer">
        <p>AtlasTech Solutions – Web Development for SMEs</p>
    </div>
</body>
</html>
