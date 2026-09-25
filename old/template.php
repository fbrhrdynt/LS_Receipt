<?php
// template.php — output JS (bilingual & extended totals)
// Menampilkan label dua bahasa (Indonesia / English) dan
// memakai field totals dari expense: subtotal, discountAmount, vatAmount, grandTotal, bayar, kembali, method.
header('Content-Type: application/javascript; charset=UTF-8');
?>
// templates renderer (ID / EN)
(function(){
  // ctx fields expected:
  // storeName, storeAddress, custName, dateStr, items[{name,qty,price,subtotal}],
  // subtotal, discountAmount, discType, discValue, vatRate, vatAmount, grandTotal,
  // bayar, kembali, method, orderId, cashierName, footerNote

  // ---------- Helpers ----------
  const L = {
    date:        'Date',
    time:        'Time',
    order:       'Order#',
    cashier:     'Cashier',
    customer:    'Customer',
    method:      'Payment',
    subtotal:    'Subtotal',
    discount:    'Discount',
    vat:         'VAT',
    grandTotal:  'Grand Total',
    paid:        'Paid',
    change:      'Change',
    qty:         'Qty',
    item:        'Item',
    note:        'Nota',
  };

  function bi(s){ return s; } // semantik saja

  function lineItems(items, formatCurrency) {
    return {
      listEq: items.map((it,i)=>`${i+1}. ${it.name} x${it.qty} = ${formatCurrency(it.subtotal)}`).join('<br>'),
      listRight: items.map((it,i)=>`<div>${i+1}. ${it.name} x${it.qty} <span style="float:right">${formatCurrency(it.subtotal)}</span></div>`).join(''),
      listMid: items.map(it=>`<div>${it.qty} x ${it.name}<span style="float:right">${formatCurrency(it.subtotal)}</span></div>`).join(''),
      listDash: items.map((it,i)=>`<div>${i+1}. ${it.name} (${it.qty}) - ${formatCurrency(it.subtotal)}</div>`).join(''),
      listNameQtyRight: items.map(it=>`<div>${it.name} (${it.qty}) <span style="float:right">${formatCurrency(it.subtotal)}</span></div>`).join('')
    };
  }

  function headerBlock(ctx){
    const addr = ctx.storeAddress ? `<br>${ctx.storeAddress}` : '';
    return `<center><b>${ctx.storeName}</b>${addr?addr:''}</center>`;
  }

  function metaTop(ctx){
    const parts = [];
    if (ctx.orderId) parts.push(`${L.order}: ${ctx.orderId}`);
    if (ctx.cashierName) parts.push(`${L.cashier}: ${ctx.cashierName}`);
    if (ctx.custName) parts.push(`${L.customer}: ${ctx.custName}`);
    return parts.length ? parts.join('<br>') + '<br>' : '';
  }

  // Ringkasan totals bilingual, terhubung ke angka dari expense
  function totalsBlockExt(ctx, formatCurrency){
    const rows = [];

    rows.push(row(L.subtotal, ctx.subtotal));
    if (ctx.discountAmount > 0) {
      const discLabel = (ctx.discType === 'percent')
        ? `${L.discount} (${String(ctx.discValue).replace('.', ',')}%)`
        : `${L.discount}`;
      rows.push(row(discLabel, -ctx.discountAmount, true));
    }
    if (ctx.vatAmount > 0) {
      rows.push(row(`${L.vat} (${String(ctx.vatRate).replace('.', ',')}%)`, ctx.vatAmount));
    }
    rows.push(row(L.grandTotal, ctx.grandTotal, false, true));
    rows.push(row(`${L.paid} (${ctx.method})`, ctx.bayar));
    rows.push(row(L.change, ctx.kembali));

    function row(label, value, isMinus=false, isBold=false){
      const v = (isMinus ? `- ${formatCurrency(Math.max(0, Math.round(Math.abs(value)||0)))}` : formatCurrency(value||0));
      const strongS = isBold ? '<b>' : '';
      const strongE = isBold ? '</b>' : '';
      return `<div class="trow" style="display:flex;justify-content:space-between;margin:2px 0;">
        <span>${label}</span><span>${strongS}${v}${strongE}</span></div>`;
    }
    return `<div class="totals-block" style="margin-top:8px;border-top:1px dashed #ddd;padding-top:6px;font-size:12px;">${rows.join('')}</div>`;
  }

  function footerNote(ctx){
    return ctx.footerNote ? `<hr><p style="text-align:center; font-size:12px;">${ctx.footerNote}</p>` : '';
  }

  // ---------- Render ----------
  function render(t, ctx, formatCurrency){
    const li = lineItems(ctx.items || [], formatCurrency);
    let html = '';

    switch (t) {
      case 1:
        html = `<div style="font-family: Courier New; font-size: 13px">
          <center><b>=== ${ctx.storeName} ===</b><br>${ctx.dateStr}</center><hr>
          ${metaTop(ctx)}
          ${li.listEq}<br><hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          <hr>
          ${footerNote(ctx)}
        </div>`;
        break;

      case 2:
        html = `<div style="font-family: 'Segoe UI', sans-serif; font-size: 14px;">
          <div style="text-align:center;"><strong>${ctx.storeName}</strong></div>
          ${ctx.storeAddress ? `<div style="text-align:center; font-size:12px;">${ctx.storeAddress}</div>` : ``}
          <hr>
          <div>${ctx.orderId ? `<b>${L.note}:</b> #${ctx.orderId}<br>`:''}
          <b>${L.date}:</b> ${ctx.dateStr}</div><br>
          ${ctx.custName ? `<div><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
          ${ctx.cashierName ? `<div><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
          ${li.listRight}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 3:
        html = `<div style="font-family: 'Helvetica Neue', sans-serif; font-size: 13px;">
          <center><b>${ctx.storeName.toUpperCase()}</b><br>${ctx.dateStr}</center>
          <hr>
          ${li.listMid}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          <div>
            ${ctx.cashierName ? `${L.cashier}: ${ctx.cashierName} | `:''}
            ${ctx.orderId ? ` | ${L.order}: ${ctx.orderId}`:''}
            ${ctx.custName ? ` | ${L.customer}: ${ctx.custName}`:''}
          </div>
          ${footerNote(ctx)}
        </div>`;
        break;

      case 4:
        html = `<div style="font-family: Arial, sans-serif; font-size:13px">
          <div><b>${ctx.storeName}</b></div>
          ${ctx.storeAddress ? `<div>${ctx.storeAddress}</div>`:''}
          ${ctx.orderId ? `<div>${L.order}: ${ctx.orderId}</div>`:''}
          ${ctx.custName ? `<div>${L.customer}: ${ctx.custName}</div>`:''}
          <div>${ctx.dateStr}</div>
          <hr>
          ${li.listDash}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          <div>${L.method}: ${ctx.method}${ctx.cashierName ? ` | ${L.cashier}: ${ctx.cashierName}`:''}</div>
          ${footerNote(ctx)}
        </div>`;
        break;

      case 5:
        html = `<div style="font-family: Verdana, sans-serif; font-size:12px;">
          <center><b>== ${ctx.storeName} ==</b></center>
          <div style="text-align:center;">${ctx.dateStr}</div>
          ${ctx.orderId ? `<div style="text-align:center;">${L.order}: ${ctx.orderId}</div>`:''}
          ${ctx.cashierName ? `<div style="text-align:center;">${L.cashier}: ${ctx.cashierName}</div>`:''}
          ${ctx.custName ? `<div style="text-align:center;">${L.customer}: ${ctx.custName}</div>`:''}
          ${ctx.storeAddress ? `<div style="text-align:center;">${ctx.storeAddress}</div>`:''}
          <hr>
          ${li.listMid}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 6:
        html = `<div style="font-family:'Tahoma'; font-size:13px;">
          <center><b>${ctx.storeName}</b></center>
          ${ctx.storeAddress ? `<div style="text-align:center;">${ctx.storeAddress}</div>`:''}
          <div style="text-align:center;">${ctx.dateStr}</div>
          ${ctx.custName ? `<div>${L.customer}: ${ctx.custName}</div>`:''}
          ${ctx.orderId ? `<div>${L.order}: ${ctx.orderId}</div>`:''}
          ${ctx.cashierName ? `<div>${L.cashier}: ${ctx.cashierName}</div>`:''}
          <hr>
          ${li.listEq}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 7:
        html = `<div style="font-family: 'Georgia', serif; font-size: 13px;">
          ${headerBlock(ctx)}
          <hr>
          <div>${L.date}: ${ctx.dateStr}</div>
          ${ctx.custName ? `<div>${L.customer}: ${ctx.custName}</div>`:''}
          ${li.listRight}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${ctx.cashierName ? `<div>${L.cashier}: ${ctx.cashierName}</div>`:''}
          ${ctx.orderId ? `<div>${L.order}: ${ctx.orderId}</div>`:''}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 8:
        html = `<div style="font-family: 'Courier New', monospace; font-size: 14px;">
          ${headerBlock(ctx)}
          <hr>
          ${li.listEq}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${ctx.cashierName ? `<div>${L.cashier}: ${ctx.cashierName}</div>`:''}
          ${ctx.custName ? `<div>${L.customer}: ${ctx.custName}</div>`:''}
          ${ctx.orderId ? `<div>${L.order}: ${ctx.orderId}</div>`:''}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 9:
        html = `<div style="font-family: Arial, sans-serif; font-size: 12px;">
          <center><strong>${ctx.storeName}</strong></center>
          ${ctx.storeAddress ? `<div>${ctx.storeAddress}</div>`:''}
          <hr>
          <div>${L.date}: ${ctx.dateStr}</div>
          ${ctx.custName ? `<div>${L.customer}: ${ctx.custName}</div>`:''}
          ${li.listRight}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${ctx.cashierName ? `<div>${L.cashier}: ${ctx.cashierName}</div>`:''}
          ${ctx.orderId ? `<div>${L.order}: ${ctx.orderId}</div>`:''}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 10:
        html = `<div style="font-family: Verdana, sans-serif; font-size: 13px;">
          <center><b>${ctx.storeName}</b><br>${ctx.dateStr}</center>
          ${ctx.storeAddress ? `<div style="text-align:center;">${ctx.storeAddress}</div>`:''}
          ${ctx.custName ? `<div style="text-align:center;">${L.customer}: ${ctx.custName}</div>`:''}
          <hr>
          ${li.listNameQtyRight}
          <hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${ctx.cashierName ? `<div>${L.cashier}: ${ctx.cashierName}</div>`:''}
          ${ctx.orderId ? `<div>${L.order}: ${ctx.orderId}</div>`:''}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 11:
        html = `<div style="font-family: Courier New; font-size: 13px">
          ${headerBlock(ctx)}<hr>
          ${ctx.orderId ? `${L.order}: ${ctx.orderId}<br>`:''}
          ${ctx.cashierName ? `${L.cashier}: ${ctx.cashierName}<br>`:''}
          ${ctx.custName ? `${L.customer}: ${ctx.custName}<br>`:''}
          ${L.time}: ${ctx.dateStr}<hr>
          ${li.listEq}<hr>
          ${totalsBlockExt(ctx, formatCurrency)}
          <hr>
          ${footerNote(ctx)}
        </div>`;
        break;

      case 12:
        html = `<div style="font-family: 'Segoe UI', Tahoma, sans-serif; font-size:13px; line-height:1.35;">
          <div style="text-align:center; font-weight:700; font-size:16px;">${ctx.storeName}</div>
          ${ctx.storeAddress ? `<div style="text-align:center; font-size:11px; color:#555;">${ctx.storeAddress}</div>`:''}
          <div style="text-align:center; font-size:11px; color:#555;">${ctx.dateStr}</div>
          <div style="height:1px; background:#e6e6e6; margin:8px 0 10px;"></div>

          <div style="font-size:12px; color:#333;">
            ${ctx.orderId ? `<div><b>${L.order}:</b> ${ctx.orderId}</div>`:''}
            ${ctx.cashierName ? `<div><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
            ${ctx.custName ? `<div><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
          </div>

          <div style="height:1px; background:#f0f0f0; margin:8px 0;"></div>
          ${li.listRight}
          <div style="height:1px; background:#f0f0f0; margin:8px 0;"></div>

          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 13:
        html = `<div style="font-family: Arial, sans-serif; font-size:12px;">
          <div style="border:1px solid #e1e1e1; border-radius:8px; padding:12px;">
            <div style="text-align:center;">
              <div style="font-weight:800; font-size:15px; letter-spacing:.3px;">${ctx.storeName}</div>
              ${ctx.storeAddress ? `<div style="font-size:11px; color:#666;">${ctx.storeAddress}</div>`:''}
              <div style="font-size:11px; color:#666;">${ctx.dateStr}</div>
            </div>

            <div style="height:1px; background:#efefef; margin:10px 0;"></div>

            <div style="display:flex; gap:10px; font-size:12px; color:#333; flex-wrap:wrap;">
              ${ctx.orderId ? `<div><b>${L.order}</b>: ${ctx.orderId}</div>`:''}
              ${ctx.cashierName ? `<div><b>${L.cashier}</b>: ${ctx.cashierName}</div>`:''}
              ${ctx.custName ? `<div><b>${L.customer}</b>: ${ctx.custName}</div>`:''}
            </div>

            <div style="height:1px; background:#efefef; margin:10px 0;"></div>

            ${li.listRight}

            <div style="height:1px; background:#efefef; margin:10px 0;"></div>

            ${totalsBlockExt(ctx, formatCurrency)}

            ${footerNote(ctx)}
          </div>
        </div>`;
        break;

      case 14:
        html = `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size:12px;">
          <div style="text-align:center;">
            <div style="font-size:16px; font-weight:700;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="font-size:11px; color:#666;">${ctx.storeAddress}</div>`:''}
            <div style="font-size:11px; color:#666;">${ctx.dateStr}</div>
          </div>

          <div style="height:1px; background:#eee; margin:8px 0;"></div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1;">
              ${ctx.custName ? `<div style="font-size:12px;"><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
              ${ctx.orderId ? `<div style="font-size:12px;"><b>${L.order}:</b> ${ctx.orderId}</div>`:''}
              ${ctx.cashierName ? `<div style="font-size:12px;"><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
              <div style="height:1px; background:#f3f3f3; margin:8px 0;"></div>
              ${li.listRight}
            </div>

            <div style="width:38%; border:1px solid #ececec; border-radius:8px; padding:10px; align-self:flex-start;">
              <div style="font-weight:700; margin-bottom:6px;">Order Summary</div>
              ${totalsBlockExt(ctx, formatCurrency)}
            </div>
          </div>

          ${footerNote(ctx)}
        </div>`;
        break;

      case 15:
        html = `<div style="font-family: Roboto, Arial, sans-serif; font-size:12px;">
          <div style="height:6px; background:#eaeaea; border-radius:6px; margin-bottom:8px;"></div>
          <div style="text-align:center;">
            <div style="font-size:16px; font-weight:800; letter-spacing:.2px;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="font-size:11px; color:#666;">${ctx.storeAddress}</div>`:''}
            <div style="font-size:11px; color:#666;">${ctx.dateStr}</div>
          </div>
          <div style="height:1px; background:#f2f2f2; margin:8px 0;"></div>

          <div style="display:flex; flex-wrap:wrap; gap:8px; font-size:12px;">
            ${ctx.orderId ? `<div><b>${L.order}:</b> ${ctx.orderId}</div>`:''}
            ${ctx.cashierName ? `<div><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
            ${ctx.custName ? `<div><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
          </div>

          <div style="height:1px; background:#f2f2f2; margin:8px 0;"></div>
          ${li.listRight}
          <div style="height:1px; background:#f2f2f2; margin:8px 0;"></div>

          ${totalsBlockExt(ctx, formatCurrency)}

          <div style="height:6px; background:#eaeaea; border-radius:6px; margin-top:10px;"></div>
          ${footerNote(ctx)}
        </div>`;
        break;

      case 16:
        html = `<div style="font-family: 'Inter', Arial, sans-serif; font-size:12px;">
          <div style="text-align:center;">
            <div style="font-size:18px; font-weight:800;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="font-size:11px; color:#666;">${ctx.storeAddress}</div>`:''}
            <div style="font-size:11px; color:#666;">${ctx.dateStr}</div>
          </div>

          <div style="height:1px; background:#e9e9e9; margin:8px 0;"></div>

          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <div>
              ${ctx.custName ? `<div><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
              ${ctx.cashierName ? `<div><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
            </div>
            <div style="text-align:right;">
              ${ctx.orderId ? `<div><b>${L.order}:</b> ${ctx.orderId}</div>`:''}
            </div>
          </div>

          <div style="margin:8px 0 6px; font-weight:700;">Detail Item / Items</div>
          <div style="border:1px solid #eee; border-radius:6px; overflow:hidden;">
            <div style="display:flex; font-weight:700; background:#fafafa; border-bottom:1px solid #eee;">
              <div style="flex:1; padding:6px 8px;">${L.item}</div>
              <div style="width:60px; padding:6px 8px; text-align:right;">${L.qty}</div>
              <div style="width:110px; padding:6px 8px; text-align:right;">Subtotal</div>
            </div>
            ${(ctx.items||[]).map(it => `
              <div style="display:flex; border-bottom:1px solid #f4f4f4;">
                <div style="flex:1; padding:6px 8px;">${it.name}</div>
                <div style="width:60px; padding:6px 8px; text-align:right;">${it.qty}</div>
                <div style="width:110px; padding:6px 8px; text-align:right;">${formatCurrency(it.subtotal)}</div>
              </div>
            `).join('')}
          </div>

          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 17:
        html = `<div style="font-family: 'Helvetica Neue', sans-serif; font-size:13px; color:#333;">
          <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:18px; font-weight:800;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="font-size:11px; color:#555;">${ctx.storeAddress}</div>`:''}
          </div>
          <div style="font-size:12px; margin-bottom:6px;">${ctx.dateStr}</div>
          ${ctx.custName ? `<div><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
          ${ctx.orderId ? `<div><b>${L.order}:</b> ${ctx.orderId}</div>`:''}
          ${ctx.cashierName ? `<div><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
          <hr style="margin:8px 0;">
          ${li.listRight}
          <hr style="margin:8px 0;">
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 18:
        html = `<div style="font-family: Arial, sans-serif; font-size:12px;">
          <div style="background:#000; color:#fff; padding:6px; text-align:center; font-weight:700; font-size:14px;">
            ${ctx.storeName}
          </div>
          ${ctx.storeAddress ? `<div style="text-align:center; font-size:11px; margin:4px 0;">${ctx.storeAddress}</div>`:''}
          <div style="text-align:center; font-size:11px; margin-bottom:6px;">${ctx.dateStr}</div>
          <div style="height:1px; background:#ddd; margin:6px 0;"></div>
          ${li.listRight}
          <div style="height:1px; background:#ddd; margin:6px 0;"></div>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 19:
        html = `<div style="font-family: 'Times New Roman', serif; font-size:13px; color:#222;">
          <div style="border-top:3px double #000; border-bottom:3px double #000; padding:6px 0; text-align:center;">
            <div style="font-size:17px; font-weight:700; letter-spacing:.5px;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="font-size:11px;">${ctx.storeAddress}</div>`:''}
          </div>
          <div style="margin:6px 0;">${ctx.dateStr}</div>
          ${ctx.custName ? `<div>${L.customer}: ${ctx.custName}</div>`:''}
          ${li.listRight}
          <div style="margin:6px 0;"></div>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      case 20:
        html = `<div style="font-family: 'Segoe UI', sans-serif; font-size:12px;">
          <div style="border:1px solid #ccc; border-radius:6px; padding:10px;">
            <div style="text-align:center; font-size:15px; font-weight:700;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="text-align:center; font-size:11px; color:#666;">${ctx.storeAddress}</div>`:''}
            <div style="text-align:center; font-size:11px; margin-bottom:6px;">${ctx.dateStr}</div>
            <div style="border-top:1px solid #eee; margin:8px 0;"></div>
            ${li.listRight}
            <div style="border-top:1px solid #eee; margin:8px 0;"></div>
            ${totalsBlockExt(ctx, formatCurrency)}
            ${footerNote(ctx)}
          </div>
        </div>`;
        break;

      case 21:
        // PREMIUM INVOICE - bilingual + extended totals
        html = `<div style="font-family: 'Inter', sans-serif; font-size:12px;">
          <div style="text-align:center;">
            <div style="font-size:18px; font-weight:800;">${ctx.storeName}</div>
            ${ctx.storeAddress ? `<div style="font-size:11px; color:#555;">${ctx.storeAddress}</div>`:''}
          </div>
          <div style="text-align:center; font-size:11px; margin:4px 0;">${ctx.dateStr}</div>
          <div style="margin:6px 0;">
            ${ctx.custName ? `<div><b>${L.customer}:</b> ${ctx.custName}</div>`:''}
            ${ctx.orderId ? `<div><b>${L.order}:</b> ${ctx.orderId}</div>`:''}
            ${ctx.cashierName ? `<div><b>${L.cashier}:</b> ${ctx.cashierName}</div>`:''}
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin:6px 0;">
            <tr style="background:#f8f8f8; border-bottom:1px solid #ddd;">
              <th align="left" style="padding:4px;">${L.item}</th>
              <th align="right" style="padding:4px;">${L.qty}</th>
              <th align="right" style="padding:4px;">Subtotal</th>
            </tr>
            ${(ctx.items||[]).map(it=>`
              <tr>
                <td style="padding:4px; border-bottom:1px solid #f0f0f0;">${it.name}</td>
                <td align="right" style="padding:4px; border-bottom:1px solid #f0f0f0;">${it.qty}</td>
                <td align="right" style="padding:4px; border-bottom:1px solid #f0f0f0;">${formatCurrency(it.subtotal)}</td>
              </tr>
            `).join('')}
          </table>
          ${totalsBlockExt(ctx, formatCurrency)}
          ${footerNote(ctx)}
        </div>`;
        break;

      default:
        html = `<div>Template tidak ditemukan.</div>`;
    }

    return html;
  }

  // expose
  window.templates = { render };
})();
