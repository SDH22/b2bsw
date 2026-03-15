import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Steel Wood Industries <orders@steelwood.ae>'

export async function sendOrderConfirmationEmail(params: {
  to: string
  name: string
  orderRef: string
  grade: string
  thickness: number
  quantity: number
  totalAmount: number
  zoneName: string
  dispatchDate: string
  invoiceUrl?: string
}): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Order Confirmed — ${params.orderRef} | Steel Wood Industries`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0f2318;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">Steel Wood Industries FZCO</h1>
            <p style="color:#8fcfaf;margin:4px 0 0">JAFZA · National Industries Park, Dubai UAE</p>
          </div>
          <div style="background:#fff;padding:24px;border:1px solid #e5e7eb">
            <div style="background:#f0faf4;border-left:4px solid #2d6a4f;padding:16px;border-radius:4px;margin-bottom:24px">
              <h2 style="color:#0f2318;margin:0 0 4px">✓ Order Confirmed</h2>
              <p style="color:#374151;margin:0;font-size:18px;font-weight:700">${params.orderRef}</p>
            </div>
            <p>Dear ${params.name},</p>
            <p>Your order has been confirmed. Here are the details:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr style="background:#f9fafb">
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Product</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb">${params.grade} Chipboard ${params.thickness}mm</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Quantity</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb">${params.quantity} sheets</td>
              </tr>
              <tr style="background:#f9fafb">
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Delivery Zone</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb">${params.zoneName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Dispatch Date</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb">${params.dispatchDate}</td>
              </tr>
              <tr style="background:#f0faf4">
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:700">Total Amount</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:700;color:#2d6a4f">AED ${params.totalAmount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}</td>
              </tr>
            </table>
            ${params.invoiceUrl ? `<p><a href="${params.invoiceUrl}" style="background:#2d6a4f;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Download Invoice</a></p>` : ''}
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
            <p style="color:#6b7280;font-size:14px">For queries: <a href="mailto:orders@steelwood.ae">orders@steelwood.ae</a> | +971 4 XXX XXXX</p>
          </div>
          <div style="background:#0f2318;padding:12px 24px;border-radius:0 0 8px 8px;text-align:center">
            <p style="color:#8fcfaf;font-size:12px;margin:0">© 2026 Steel Wood Industries FZCO · JAFZA · NIP, Dubai UAE · TRN 100XXXXXXX</p>
          </div>
        </div>
      `,
    })
    return true
  } catch {
    return false
  }
}

export async function sendTDSEmail(params: {
  to: string
  name: string
  productName: string
  tdsUrl: string
}): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `TDS Document — ${params.productName} | Steel Wood Industries`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0f2318;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">Technical Data Sheet</h1>
            <p style="color:#8fcfaf;margin:4px 0 0">Steel Wood Industries FZCO</p>
          </div>
          <div style="background:#fff;padding:24px;border:1px solid #e5e7eb">
            <p>Dear ${params.name},</p>
            <p>Please find attached the Technical Data Sheet for <strong>${params.productName}</strong>.</p>
            <p><a href="${params.tdsUrl}" style="background:#2d6a4f;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Download TDS PDF</a></p>
          </div>
        </div>
      `,
    })
    return true
  } catch {
    return false
  }
}
