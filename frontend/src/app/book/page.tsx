'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Script from 'next/script';

interface ServiceOption {
  id: string;
  slug: string;
  label: string;
  questionCount: number;
  price: string;
}

interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string | null;
  options: ServiceOption[];
}

declare global {
  interface Window {
    paypal?: any;
  }
}

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  const preselected = searchParams?.get('service');

  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=/book');
      return;
    }
    fetch(getApiUrl('/api/services'))
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        const pre = data.find((s: Service) => s.slug === preselected);
        if (pre) setSelectedService(pre);
      })
      .finally(() => setLoading(false));
  }, [token, preselected, router]);

  const getPrice = () => {
    if (selectedOption) return Number(selectedOption.price);
    if (selectedService?.options?.length === 0 && selectedService?.price)
      return Number(selectedService.price);
    return 0;
  };

  const canProceed = () => {
    if (!selectedService) return false;
    if (selectedService.options?.length > 0) return !!selectedOption;
    return true;
  };

  const createBooking = async () => {
    if (!selectedService || !token) return;
    if (!canProceed()) return;
    setProcessing(true);
    try {
      const body: { serviceId: string; serviceOptionId?: string } = {
        serviceId: selectedService.id,
      };
      if (selectedOption) body.serviceOptionId = selectedOption.id;

      const res = await fetch(getApiUrl('/api/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookingId(data.id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to create booking');
    } finally {
      setProcessing(false);
    }
  };

  const createPayPalOrder = async () => {
    if (!bookingId || !token) return null;
    setProcessing(true);
    try {
      const res = await fetch(getApiUrl('/api/payments/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.orderId;
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to create order');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const capturePayment = async (orderId: string) => {
    if (!token) return;
    setProcessing(true);
    try {
      const res = await fetch(getApiUrl('/api/payments/capture'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/dashboard?success=1');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Payment capture failed');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!paypalReady || !bookingId || getPrice() <= 0) return;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return;

    const buttons = window.paypal?.Buttons({
      createOrder: createPayPalOrder,
      onApprove: (data: { orderID: string }) => capturePayment(data.orderID),
      style: { color: 'gold', shape: 'rect', label: 'paypal' },
    });
    buttons?.render('#paypal-button-container');
    return () => {
      const container = document.getElementById('paypal-button-container');
      if (container) container.innerHTML = '';
    };
  }, [paypalReady, bookingId, selectedOption, selectedService]);

  if (!user) return null;
  if (loading) {
    return (
      <div className="py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="h-96 rounded-2xl bg-primary-50/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">Book Your Reading</h1>
            <p className="text-white/70">Select a service, choose your option, and proceed to payment</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-gold font-medium mb-3">1. Choose Service</h2>
              <div className="grid gap-3">
                {services.map((s) => (
                  <Card
                    key={s.id}
                    className={`cursor-pointer transition-all ${
                      selectedService?.id === s.id ? 'border-gold shadow-glow' : 'hover:border-gold/40'
                    }`}
                    onClick={() => {
                      setSelectedService(s);
                      setSelectedOption(null);
                      setBookingId(null);
                    }}
                  >
                    <CardHeader className="py-4">
                      <CardTitle className="text-gold text-lg">{s.name}</CardTitle>
                      <CardDescription>{s.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {selectedService && selectedService.options?.length > 0 && (
              <div>
                <h2 className="text-gold font-medium mb-3">2. Choose Package</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedService.options.map((opt) => (
                    <Card
                      key={opt.id}
                      className={`cursor-pointer transition-all ${
                        selectedOption?.id === opt.id ? 'border-gold shadow-glow' : 'hover:border-gold/40'
                      }`}
                      onClick={() => {
                        setSelectedOption(opt);
                        setBookingId(null);
                      }}
                    >
                      <CardContent className="py-4">
                        <p className="font-medium text-white">{opt.label}</p>
                        <p className="text-xl font-bold text-gold mt-1">${Number(opt.price).toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedService && selectedService.options?.length === 0 && selectedService.price && (
              <div className="rounded-xl border border-gold/30 bg-primary-50/20 p-4">
                <p className="text-gold font-medium">{selectedService.name}</p>
                <p className="text-2xl font-bold text-gold">${Number(selectedService.price).toFixed(2)}</p>
              </div>
            )}
          </div>

          {canProceed() && !bookingId && (
            <div className="flex justify-between items-center">
              <p className="text-white/80">
                Total: <span className="text-gold font-bold text-xl">${getPrice().toFixed(2)}</span>
              </p>
              <Button
                onClick={createBooking}
                disabled={processing}
                className="shadow-glow"
              >
                {processing ? 'Creating...' : 'Proceed to Payment'}
              </Button>
            </div>
          )}

          {bookingId && getPrice() > 0 && (
            <Card className="border-gold/30">
              <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>
                  Pay ${getPrice().toFixed(2)} via PayPal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Script
                  src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
                  onLoad={() => setPaypalReady(true)}
                />
                <div id="paypal-button-container" className="min-h-[150px]" />
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-24 px-4"><div className="container mx-auto max-w-2xl h-96 rounded-2xl bg-primary-50/20 animate-pulse" /></div>}>
      <BookContent />
    </Suspense>
  );
}
