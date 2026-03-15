const WA_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

const TEMPLATES = {
  ORDER_CONFIRMED: 'sw_order_confirmed',
  ORDER_DISPATCHED: 'sw_order_dispatched',
  ORDER_DELIVERED: 'sw_order_delivered',
  PRICE_LOCK_EXPIRY: 'sw_price_expiry',
  LOW_STOCK_ALERT: 'sw_low_stock',
  PDC_REMINDER: 'sw_pdc_reminder',
}

async function sendTemplate(
  to: string,
  templateName: string,
  components: Record<string, unknown>[]
): Promise<boolean> {
  if (!process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn('[WhatsApp] Access token not configured')
    return false
  }

  try {
    const res = await fetch(WA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/\D/g, ''),
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components,
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendOrderConfirmed(params: {
  phone: string
  orderRef: string
  grade: string
  qty: number
  dispatchDate: string
}): Promise<boolean> {
  return sendTemplate(params.phone, TEMPLATES.ORDER_CONFIRMED, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.orderRef },
        { type: 'text', text: params.grade },
        { type: 'text', text: String(params.qty) },
        { type: 'text', text: params.dispatchDate },
      ],
    },
  ])
}

export async function sendOrderDispatched(params: {
  phone: string
  orderRef: string
  driverName: string
  deliveryEta: string
}): Promise<boolean> {
  return sendTemplate(params.phone, TEMPLATES.ORDER_DISPATCHED, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.orderRef },
        { type: 'text', text: params.driverName },
        { type: 'text', text: params.deliveryEta },
      ],
    },
  ])
}

export async function sendOrderDelivered(params: {
  phone: string
  orderRef: string
  invoiceUrl: string
}): Promise<boolean> {
  return sendTemplate(params.phone, TEMPLATES.ORDER_DELIVERED, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.orderRef },
        { type: 'text', text: params.invoiceUrl },
      ],
    },
  ])
}

export async function sendLowStockAlert(params: {
  phone: string
  product: string
  sheetsLeft: number
}): Promise<boolean> {
  return sendTemplate(params.phone, TEMPLATES.LOW_STOCK_ALERT, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.product },
        { type: 'text', text: String(params.sheetsLeft) },
      ],
    },
  ])
}

export async function sendPDCReminder(params: {
  phone: string
  company: string
  amount: number
  dueDate: string
}): Promise<boolean> {
  return sendTemplate(params.phone, TEMPLATES.PDC_REMINDER, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: params.company },
        { type: 'text', text: `AED ${params.amount.toLocaleString()}` },
        { type: 'text', text: params.dueDate },
      ],
    },
  ])
}
