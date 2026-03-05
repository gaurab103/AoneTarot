declare module '@paypal/checkout-server-sdk' {
  const paypal: {
    core: {
      SandboxEnvironment: new (clientId: string, clientSecret: string) => unknown;
      LiveEnvironment: new (clientId: string, clientSecret: string) => unknown;
      PayPalHttpClient: new (env: unknown) => {
        execute: (req: unknown) => Promise<{ result: unknown }>;
      };
    };
    orders: {
      OrdersCreateRequest: new () => {
        prefer: (val: string) => void;
        requestBody: (body: unknown) => void;
      };
      OrdersCaptureRequest: new (orderId: string) => {
        requestBody: (body: unknown) => void;
      };
    };
  };
  export default paypal;
}
