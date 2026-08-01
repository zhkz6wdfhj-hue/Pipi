/**
 * HTML-sjablonen voor de e-mail. Bewust opgebouwd met tabellen en inline
 * stijlen: dat is de enige manier waarop een mail er in Outlook, Gmail en Apple
 * Mail hetzelfde uitziet. De kleuren komen overeen met de site; Cormorant
 * Garamond bestaat niet in e-mail, dus daar valt hij terug op Georgia.
 */

import { formatDateShort, formatPrice } from '../format';
import type { Order } from '../orders';
import { paymentMethodLabel } from '../mollie';
import { COLORS } from '@/data/products';
import { site } from '@/data/site';

const BG = '#FAF8F4';
const SURFACE = '#FFFFFF';
const INK = '#1F1B18';
const INK_SOFT = '#5B534B';
const LINE = '#E3DDD3';
const ACCENT_INK = '#6B5B47';

const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addressBlock(order: Order): string {
  const { customer } = order;
  const houseNumber = [customer.houseNumber, customer.addition].filter(Boolean).join(' ');
  const country = customer.country === 'BE' ? 'België' : 'Nederland';
  return [
    `${customer.firstName} ${customer.lastName}`,
    `${customer.street} ${houseNumber}`,
    `${customer.postalCode} ${customer.city}`,
    country,
  ]
    .map(escapeHtml)
    .join('<br />');
}

function itemRows(order: Order): string {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:${sans};font-size:14px;color:${INK};line-height:1.5;">
            <strong style="font-weight:600;">${escapeHtml(item.name)}</strong><br />
            <span style="color:${INK_SOFT};">${escapeHtml(COLORS[item.color].label)} &middot; maat ${escapeHtml(item.size)} &middot; ${item.quantity} stuks</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:${sans};font-size:14px;color:${INK};text-align:right;white-space:nowrap;vertical-align:top;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>`
    )
    .join('');
}

function totalRow(label: string, value: string, bold = false): string {
  return `
    <tr>
      <td style="padding:6px 0;font-family:${sans};font-size:${bold ? '15px' : '14px'};color:${bold ? INK : INK_SOFT};${bold ? 'font-weight:600;' : ''}">${label}</td>
      <td style="padding:6px 0;font-family:${sans};font-size:${bold ? '15px' : '14px'};color:${bold ? INK : INK_SOFT};text-align:right;white-space:nowrap;${bold ? 'font-weight:600;' : ''}">${value}</td>
    </tr>`;
}

function shell(title: string, content: string): string {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BG};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${SURFACE};border:1px solid ${LINE};">
            <tr>
              <td style="padding:32px 32px 24px 32px;border-bottom:1px solid ${LINE};text-align:center;">
                <span style="font-family:${serif};font-size:26px;color:${INK};letter-spacing:0.02em;">Melin</span><span style="font-family:${sans};font-size:12px;color:${ACCENT_INK};letter-spacing:0.12em;">clo</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;border-top:1px solid ${LINE};font-family:${sans};font-size:12px;line-height:1.6;color:${INK_SOFT};text-align:center;">
                ${escapeHtml(site.name)} &middot; ${escapeHtml(site.email)}<br />
                KvK ${escapeHtml(site.kvk)} &middot; btw ${escapeHtml(site.btw)}<br />
                <a href="${site.url}" style="color:${ACCENT_INK};text-decoration:underline;">${escapeHtml(site.url.replace(/^https?:\/\//, ''))}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Bevestigingsmail voor de klant. */
export function orderConfirmationEmail(order: Order): { subject: string; html: string; text: string } {
  const heading = `Bedankt voor je bestelling, ${escapeHtml(order.customer.firstName)}`;

  const content = `
    <h1 style="margin:0 0 16px 0;font-family:${serif};font-weight:400;font-size:26px;line-height:1.2;color:${INK};">${heading}</h1>
    <p style="margin:0 0 20px 0;font-family:${sans};font-size:15px;line-height:1.6;color:${INK_SOFT};">
      We hebben je betaling ontvangen en zijn je pakket aan het klaarmaken. Hieronder staat wat je hebt besteld.
      Bewaar deze mail; je ordernummer staat erin.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="font-family:${sans};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK_SOFT};padding-bottom:4px;">Ordernummer</td>
        <td style="font-family:${sans};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK_SOFT};padding-bottom:4px;text-align:right;">Besteldatum</td>
      </tr>
      <tr>
        <td style="font-family:${sans};font-size:15px;color:${INK};font-weight:600;">${escapeHtml(order.number)}</td>
        <td style="font-family:${sans};font-size:15px;color:${INK};text-align:right;">${formatDateShort(order.createdAt)}</td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};">
      ${itemRows(order)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 28px 0;">
      ${totalRow('Subtotaal', formatPrice(order.totals.subtotal))}
      ${order.totals.discount > 0 ? totalRow(`Korting (${escapeHtml(order.totals.discountCode ?? '')})`, `– ${formatPrice(order.totals.discount)}`) : ''}
      ${totalRow('Verzending', order.totals.shipping === 0 ? 'Gratis' : formatPrice(order.totals.shipping))}
      <tr><td colspan="2" style="border-top:1px solid ${LINE};padding-top:8px;"></td></tr>
      ${totalRow('Totaal', formatPrice(order.totals.total), true)}
      ${totalRow('Waarvan btw (21%)', formatPrice(Math.round(order.totals.total - order.totals.total / 1.21)))}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};border:1px solid ${LINE};margin-bottom:24px;">
      <tr>
        <td style="padding:20px;font-family:${sans};font-size:14px;line-height:1.6;color:${INK_SOFT};">
          <span style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK};margin-bottom:8px;">Bezorgadres</span>
          ${addressBlock(order)}
          <span style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK};margin:16px 0 8px 0;">Verwachte bezorging</span>
          ${formatDateShort(order.deliveryFrom)} – ${formatDateShort(order.deliveryTo)}
          <span style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK};margin:16px 0 8px 0;">Betaalwijze</span>
          ${escapeHtml(paymentMethodLabel(order.paymentMethod))}
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px 0;font-family:${sans};font-size:14px;line-height:1.6;color:${INK_SOFT};">
      Zodra je pakket bij de vervoerder ligt, sturen we je een bericht met het volgnummer.
      Past de jas niet? Je hebt ${site.returnDays} dagen bedenktijd; op
      <a href="${site.url}/service/retourneren" style="color:${ACCENT_INK};">${site.url.replace(/^https?:\/\//, '')}/service/retourneren</a>
      lees je hoe je hem terugstuurt.
    </p>
    <p style="margin:0;font-family:${sans};font-size:14px;line-height:1.6;color:${INK_SOFT};">
      Vragen mag altijd: <a href="mailto:${site.email}" style="color:${ACCENT_INK};">${escapeHtml(site.email)}</a>.
    </p>
  `;

  const text = [
    `Bedankt voor je bestelling, ${order.customer.firstName}.`,
    '',
    `Ordernummer: ${order.number}`,
    `Besteldatum: ${formatDateShort(order.createdAt)}`,
    '',
    ...order.items.map(
      (item) =>
        `${item.quantity}x ${item.name} — ${COLORS[item.color].label}, maat ${item.size} — ${formatPrice(item.price * item.quantity)}`
    ),
    '',
    `Subtotaal: ${formatPrice(order.totals.subtotal)}`,
    order.totals.discount > 0 ? `Korting: -${formatPrice(order.totals.discount)}` : '',
    `Verzending: ${order.totals.shipping === 0 ? 'Gratis' : formatPrice(order.totals.shipping)}`,
    `Totaal: ${formatPrice(order.totals.total)}`,
    '',
    `Verwachte bezorging: ${formatDateShort(order.deliveryFrom)} – ${formatDateShort(order.deliveryTo)}`,
    '',
    `Vragen? Mail ons op ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n');

  return { subject: `Je bestelling bij ${site.name} (${order.number})`, html: shell(`Bestelling ${order.number}`, content), text };
}

/** Intern besteloverzicht, zodat je meteen weet wat je moet inpakken. */
export function internalOrderEmail(order: Order): { subject: string; html: string; text: string } {
  const packingRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-family:${sans};font-size:14px;color:${INK};">
            ${item.quantity}&times; ${escapeHtml(item.name)} — ${escapeHtml(COLORS[item.color].label)}, maat ${escapeHtml(item.size)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-family:${sans};font-size:13px;color:${INK_SOFT};text-align:right;white-space:nowrap;">
            ${escapeHtml(item.sku)}
          </td>
        </tr>`
    )
    .join('');

  const content = `
    <h1 style="margin:0 0 8px 0;font-family:${serif};font-weight:400;font-size:24px;color:${INK};">Nieuwe bestelling ${escapeHtml(order.number)}</h1>
    <p style="margin:0 0 24px 0;font-family:${sans};font-size:14px;color:${INK_SOFT};">
      ${formatDateShort(order.createdAt)} &middot; ${formatPrice(order.totals.total)} &middot; ${escapeHtml(paymentMethodLabel(order.paymentMethod))} &middot; status: ${escapeHtml(order.status)}
    </p>

    <span style="display:block;font-family:${sans};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK};margin-bottom:8px;">Inpakken</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};margin-bottom:24px;">
      ${packingRows}
    </table>

    <span style="display:block;font-family:${sans};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK};margin-bottom:8px;">Verzenden naar</span>
    <p style="margin:0 0 24px 0;font-family:${sans};font-size:14px;line-height:1.6;color:${INK_SOFT};">
      ${addressBlock(order)}<br />
      ${escapeHtml(order.customer.email)}${order.customer.phone ? ` &middot; ${escapeHtml(order.customer.phone)}` : ''}
    </p>

    ${
      order.customer.notes
        ? `<span style="display:block;font-family:${sans};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${INK};margin-bottom:8px;">Opmerking van de klant</span>
           <p style="margin:0 0 24px 0;font-family:${sans};font-size:14px;line-height:1.6;color:${INK_SOFT};">${escapeHtml(order.customer.notes)}</p>`
        : ''
    }

    <p style="margin:0;font-family:${sans};font-size:13px;line-height:1.6;color:${INK_SOFT};">
      Nieuwsbrief: ${order.customer.newsletter ? 'ja, de klant wil de nieuwsbrief ontvangen (bevestiging nog nodig)' : 'nee'}.<br />
      Vergeet de voorraad in <code>src/data/products.ts</code> niet bij te werken.
    </p>
  `;

  const text = [
    `Nieuwe bestelling ${order.number} — ${formatPrice(order.totals.total)}`,
    '',
    ...order.items.map(
      (item) => `${item.quantity}x ${item.name} (${COLORS[item.color].label}, ${item.size}) — ${item.sku}`
    ),
    '',
    `${order.customer.firstName} ${order.customer.lastName}`,
    `${order.customer.street} ${order.customer.houseNumber} ${order.customer.addition}`.trim(),
    `${order.customer.postalCode} ${order.customer.city}, ${order.customer.country === 'BE' ? 'België' : 'Nederland'}`,
    order.customer.email,
  ].join('\n');

  return {
    subject: `Bestelling ${order.number} — ${formatPrice(order.totals.total)}`,
    html: shell(`Bestelling ${order.number}`, content),
    text,
  };
}
