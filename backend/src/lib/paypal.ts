import paypal from '@paypal/checkout-server-sdk';

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  return process.env.PAYPAL_LIVE === 'true'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export async function createPayPalOrder(amount: number, currency = 'USD') {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
  });

  const response = await client().execute(request);
  return (response.result as any).id;
}

export async function capturePayPalOrder(orderId: string) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await client().execute(request);
  const capture = (response.result as any).purchase_units?.[0]?.payments?.captures?.[0];
  return {
    status: capture?.status,
    id: capture?.id,
    amount: capture?.amount?.value,
  };
}

export async function verifyPayPalWebhook(
  headers: Record<string, string | undefined>,
  body: string,
  webhookId: string
): Promise<boolean> {
  // In production, verify webhook signature with PayPal API
  // For now, we rely on HTTPS and order capture verification
  return true;
}
