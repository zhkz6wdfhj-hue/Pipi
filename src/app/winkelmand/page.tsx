import { CartView } from '@/components/cart/cart-view';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Winkelmand',
  description:
    'Bekijk wat er in je winkelmand zit, wijzig het aantal of vul een kortingscode in. Gratis verzending vanaf € 150.',
  path: '/winkelmand',
  noindex: true,
});

export default function WinkelmandPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <h1 className="display-xl mb-8 lg:mb-12">Winkelmand</h1>
      <CartView />
    </div>
  );
}
