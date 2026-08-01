'use client';

/**
 * Onzichtbaar gebied dat schermlezers voorleest zodra er iets in de winkelmand
 * verandert. Zonder dit hoort iemand die niet meekijkt niet dat een jas is
 * toegevoegd.
 */

import { useCart } from '@/context/cart-context';

export function CartAnnouncer() {
  const { announcement } = useCart();

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
