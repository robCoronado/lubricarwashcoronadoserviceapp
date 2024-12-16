import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { Transaction } from '../../types';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useServiceStore } from '../../store/useServiceStore';
import { useCustomerStore } from '../../store/useCustomerStore';
import { formatReceiptNumber } from './receiptNumber';

export async function generateReceiptPDF(transaction: Transaction): Promise<ArrayBuffer> {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' });
  const { products } = useInventoryStore.getState();
  const { services } = useServiceStore.getState();
  const { customers } = useCustomerStore.getState();
  const customer = transaction.customerId ? customers.find(c => c.id === transaction.customerId) : null;
  let y = 10;

  // Header
  doc.setFontSize(14);
  doc.text('Lubricar & Wash Coronado', 74, y, { align: 'center' });
  
  y += 8;
  doc.setFontSize(10);
  doc.text(formatReceiptNumber(transaction.receiptNumber), 10, y);
  doc.text(format(new Date(transaction.date), 'dd/MM/yyyy HH:mm'), 138, y, { align: 'right' });

  // Customer info
  if (customer) {
    y += 6;
    doc.setFontSize(9);
    doc.text(`${customer.firstName} ${customer.lastName} | ${customer.phone}`, 10, y);
  }

  // Divider
  y += 4;
  doc.line(10, y, 138, y);
  y += 4;

  // Column headers
  doc.setFontSize(9);
  doc.text('Item', 10, y);
  doc.text('Qty', 90, y);
  doc.text('Price', 105, y);
  doc.text('Total', 125, y);
  y += 4;
  doc.line(10, y, 138, y);
  y += 4;

  // Items
  doc.setFontSize(8);
  transaction.items.forEach(item => {
    if (y > 180) {
      doc.addPage();
      y = 10;
    }

    let itemName = '';
    let description = '';

    if (item.isService) {
      const service = services.find(s => s.id === item.productId);
      if (service) {
        itemName = service.title;
        description = service.description;
      }
    } else {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        itemName = product.name;
        description = product.description;
      }
    }

    // Main item line
    doc.text(itemName, 10, y, { maxWidth: 78 });
    doc.text(item.quantity.toString(), 90, y);
    doc.text(`$${item.price.toFixed(2)}`, 105, y);
    doc.text(`$${item.subtotal.toFixed(2)}`, 125, y);
    y += 4;

    // Description (if available)
    if (description) {
      doc.setTextColor(70, 70, 70);
      const lines = doc.splitTextToSize(description, 70);
      lines.forEach(line => {
        if (y > 180) {
          doc.addPage();
          y = 10;
        }
        doc.text(`  ${line}`, 10, y);
        y += 3;
      });
      doc.setTextColor(0, 0, 0);
    }

    // Service info
    if (item.isService) {
      y += 2;
      doc.setTextColor(70, 70, 70);
      if (item.serviceLiters) {
        doc.text(`  ↳ Service (${item.serviceLiters}L)`, 15, y);
      } else {
        doc.text('  ↳ Service', 15, y);
      }
      doc.setTextColor(0, 0, 0);
      y += 4;
    }
  });

  // Totals section
  y += 2;
  doc.line(90, y, 138, y);
  y += 4;
  doc.setFontSize(9);
  
  // Subtotal
  doc.text('Subtotal:', 90, y);
  doc.text(`$${transaction.total.toFixed(2)}`, 138, y, { align: 'right' });
  
  // Discount
  if (transaction.discount > 0) {
    y += 4;
    doc.text('Discount:', 90, y);
    doc.text(`-$${transaction.discount.toFixed(2)}`, 138, y, { align: 'right' });
  }
  
  // Final total
  y += 4;
  doc.setFontSize(10);
  doc.text('TOTAL:', 90, y);
  doc.text(`$${transaction.finalTotal.toFixed(2)}`, 138, y, { align: 'right' });

  // Payment info
  y += 6;
  doc.setFontSize(9);
  const paymentInfo = `Paid via ${transaction.payment.method.toUpperCase()}`;
  doc.text(paymentInfo + (transaction.payment.cardVoucher ? ` #${transaction.payment.cardVoucher}` : ''), 10, y);

  // Footer
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 74, 190, { align: 'center' });

  return doc.output('arraybuffer');
}