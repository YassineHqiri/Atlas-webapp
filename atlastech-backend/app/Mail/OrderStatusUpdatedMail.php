<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $oldStatus
    ) {}

    public function build()
    {
        return $this->subject('Order Status Update - AtlasTech Solutions')
            ->view('emails.order-status-updated');
    }
}
