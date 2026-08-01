import { CheckoutForm } from '@/components/checkout/checkout-form';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Afrekenen',
  description:
    'Rond je bestelling af in drie stappen: contact, bezorging en betaling. Betalen met iDEAL, Bancontact of creditcard.',
  path: '/afrekenen',
  noindex: true,
});

export default function AfrekenenPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <h1 className="display-xl mb-8 lg:mb-12">Afrekenen</h1>
      <CheckoutForm />
    </div>
  );
}
