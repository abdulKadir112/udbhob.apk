import { Member, MonthlyPayment, Fund } from '../types';
import { MONTHS, formatBDT, formatCustomDate, toBengaliNumerals, getCountryFlag, getCountryBn } from './formatters';

/**
 * Print a Member's Official Statement & Payment Slip (Optimized strictly for single-page A4 Portrait)
 */
export function printMemberStatementSlip(
  member: Member,
  payments: MonthlyPayment[],
  selectedYear: number,
  fund: Fund,
  isBn: boolean = true
) {
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const yearPayments = memberPayments.filter((p) => p.year === selectedYear);

  const totalLifetimePaid = memberPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalYearPaid = yearPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const monthlyDue = member.monthlyShareAmount || (member.shares ? member.shares * 1000 : 1000);
  const yearlyTarget = monthlyDue * 12;
  const yearDue = Math.max(0, yearlyTarget - totalYearPaid);

  const memberName = isBn ? member.nameBn || member.name : member.name;
  const fundName = fund?.name || 'প্রবাসী মুক্ত ফান্ড';
  const fundDesc = fund?.description || 'প্রবাসীদের সঞ্চয় ও যৌথ বিনিয়োগ তহবিল';
  const printDate = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const monthRows = MONTHS.map((m) => {
    const monthPayments = yearPayments.filter((p) => p.month === m.id);
    const monthTotal = monthPayments.reduce((s, p) => s + (p.amount || 0), 0);
    const isPaid = monthTotal >= monthlyDue;
    const isPartial = monthTotal > 0 && monthTotal < monthlyDue;

    const statusText = isPaid
      ? (isBn ? 'পরিশোধিত ✓' : 'Paid ✓')
      : isPartial
      ? (isBn ? 'আংশিক জমা' : 'Partial')
      : (isBn ? 'বকেয়া' : 'Due');

    const paymentDateStr = monthPayments.length > 0
      ? formatCustomDate(monthPayments[0].paymentDate, isBn)
      : '—';

    const methodStr = monthPayments.length > 0
      ? monthPayments.map((p) => p.paymentMethod || 'Paid').join(', ')
      : '—';

    return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="padding: 4.5px 8px; font-weight: 700; color: #1e293b;">${isBn ? m.nameBn : m.nameEn}</td>
        <td style="padding: 4.5px 6px; text-align: center; color: #475569; font-size: 10.5px;">${paymentDateStr}</td>
        <td style="padding: 4.5px 6px; text-align: center; color: #475569; font-size: 10.5px;">${methodStr}</td>
        <td style="padding: 4.5px 8px; text-align: right; font-weight: 800; font-family: monospace; font-size: 11.5px; color: ${isPaid ? '#047857' : isPartial ? '#b45309' : '#94a3b8'};">
          ${monthTotal > 0 ? `৳${monthTotal.toLocaleString()}` : '—'}
        </td>
        <td style="padding: 4.5px 8px; text-align: center;">
          <span style="display: inline-block; padding: 1.5px 7px; border-radius: 9999px; font-size: 10px; font-weight: 700; ${
            isPaid
              ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;'
              : isPartial
              ? 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;'
              : 'background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;'
          }">
            ${statusText}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isBn ? 'bn' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <title>${fundName} - ${memberName} (${selectedYear}) Statement Slip</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          font-family: 'Hind Siliguri', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          background: #ffffff;
          width: 100%;
          height: 100%;
          line-height: 1.35;
        }
        .page-container {
          width: 100%;
          max-width: 194mm;
          margin: 0 auto;
          border: 2px solid #059669;
          border-radius: 12px;
          padding: 16px 20px;
          background: #ffffff;
          position: relative;
          page-break-inside: avoid;
        }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 60px;
          font-weight: 900;
          color: rgba(5, 150, 105, 0.04);
          pointer-events: none;
          white-space: nowrap;
          z-index: 0;
          letter-spacing: 4px;
        }
        .content-layer {
          position: relative;
          z-index: 1;
        }
        @media print {
          body {
            padding: 0;
            background: #ffffff;
          }
          .page-container {
            border: 1.5px solid #059669;
            box-shadow: none;
            padding: 14px 18px;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        <div class="watermark">PROBASHI MUKTO FUND</div>
        <div class="content-layer">
          
          <!-- Header Banner -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${
                fund?.logoUrl || fund?.avatarUrl
                  ? `<img src="${fund.logoUrl || fund.avatarUrl}" alt="${fundName}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 10px; border: 1.5px solid #059669; background: #ffffff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);" />`
                  : `<div style="width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg, #065f46, #047857); color: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; border: 1.5px solid #059669; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      <span style="font-size: 7.5px; letter-spacing: 0.5px; color: #a7f3d0; font-weight: 800; line-height: 1; margin-top: 1px;">FUND</span>
                    </div>`
              }
              <div>
                <h1 style="font-size: 20px; font-weight: 800; color: #065f46; letter-spacing: -0.3px; line-height: 1.15;">${fundName}</h1>
                <p style="font-size: 11px; color: #475569; margin-top: 1px; font-weight: 500;">${fundDesc}</p>
                <p style="font-size: 10px; color: #64748b; margin-top: 2px;">
                  <span>${isBn ? 'মুদ্রণ তারিখ:' : 'Printed on:'} <strong>${printDate}</strong></span>
                  <span style="margin: 0 6px;">•</span>
                  <span>${isBn ? 'অর্থবছর:' : 'Year:'} <strong>${isBn ? toBengaliNumerals(selectedYear) : selectedYear}</strong></span>
                </p>
              </div>
            </div>

            <div style="text-align: right;">
              <div style="background: linear-gradient(135deg, #065f46, #047857); color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; display: inline-block; letter-spacing: 0.2px;">
                ${isBn ? 'সদস্য সঞ্চয় বিবরণী ও অফিসিয়াল রশিদ' : 'Member Official Statement Slip'}
              </div>
              <p style="font-size: 10px; color: #475569; margin-top: 4px; font-family: monospace; font-weight: 700;">
                MEM-ID: #${member.id ? member.id.slice(0, 10).toUpperCase() : 'PMF-01'}
              </p>
            </div>
          </div>

          <!-- Member Particulars Card -->
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px;">
            <div style="display: grid; grid-template-columns: 1.4fr 1.2fr 1fr; gap: 8px 12px; font-size: 11.5px;">
              <div>
                <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase;">${isBn ? 'সদস্যের নাম:' : 'Member Name:'}</span>
                <p style="font-size: 14px; font-weight: 800; color: #0f172a;">${memberName} <span style="font-size: 11px; font-weight: 600; color: #047857;">(@${member.username || 'user'})</span></p>
              </div>
              <div>
                <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase;">${isBn ? 'প্রবাসী অবস্থান ও ফোন:' : 'Country & Phone:'}</span>
                <p style="font-size: 12px; font-weight: 700; color: #0f172a;">${getCountryFlag(member.country)} ${member.country} • <span style="font-family: monospace;">${member.phone}</span></p>
              </div>
              <div>
                <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase;">${isBn ? 'শেয়ার ও মাসিক কিস্তি:' : 'Shares & Monthly Rate:'}</span>
                <p style="font-size: 12px; font-weight: 800; color: #047857;">
                  ${isBn ? `${toBengaliNumerals(member.shares || 1)} টি শেয়ার` : `${member.shares || 1} Shares`} • ৳${monthlyDue.toLocaleString()}/${isBn ? 'মাস' : 'mo'}
                </p>
              </div>
            </div>
          </div>

          <!-- Summary Metric Cards (3 Columns) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="border: 1px solid #bbf7d0; border-radius: 8px; padding: 7px 10px; text-align: center; background: #f0fdf4;">
              <span style="font-size: 10px; font-weight: 700; color: #166534; text-transform: uppercase;">
                ${isBn ? `${toBengaliNumerals(selectedYear)} বাৎসরিক টার্গেট` : `${selectedYear} Target`}
              </span>
              <p style="font-size: 15px; font-weight: 800; color: #166534; margin-top: 1px; font-family: monospace;">৳${yearlyTarget.toLocaleString()}</p>
            </div>
            <div style="border: 1px solid #a7f3d0; border-radius: 8px; padding: 7px 10px; text-align: center; background: #ecfdf5;">
              <span style="font-size: 10px; font-weight: 700; color: #065f46; text-transform: uppercase;">
                ${isBn ? `${toBengaliNumerals(selectedYear)} সালে মোট আদায়` : `${selectedYear} Total Paid`}
              </span>
              <p style="font-size: 15px; font-weight: 800; color: #047857; margin-top: 1px; font-family: monospace;">৳${totalYearPaid.toLocaleString()}</p>
            </div>
            <div style="border: 1px solid #bfdbfe; border-radius: 8px; padding: 7px 10px; text-align: center; background: #eff6ff;">
              <span style="font-size: 10px; font-weight: 700; color: #1e40af; text-transform: uppercase;">
                ${isBn ? 'সর্বমোট সঞ্চয় প্রদান (আজীবন)' : 'Lifetime Contributed'}
              </span>
              <p style="font-size: 15px; font-weight: 800; color: #1d4ed8; margin-top: 1px; font-family: monospace;">৳${totalLifetimePaid.toLocaleString()}</p>
            </div>
          </div>

          <!-- 12-Month Table -->
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <h3 style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase;">
                ${isBn ? `${toBengaliNumerals(selectedYear)} সালের ১২ মাসের সঞ্চয় কিস্তির হিসাব লেজার` : `12-Month Payment Ledger Breakdown (${selectedYear})`}
              </h3>
              <span style="font-size: 10px; color: #64748b; font-weight: 600;">
                ${isBn ? `বকেয়া: ৳${yearDue.toLocaleString()}` : `Due: ৳${yearDue.toLocaleString()}`}
              </span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #065f46; color: #ffffff; font-size: 10.5px; text-align: left;">
                  <th style="padding: 5px 8px; border-top-left-radius: 5px;">${isBn ? 'মাস' : 'Month'}</th>
                  <th style="padding: 5px 6px; text-align: center;">${isBn ? 'জমার তারিখ' : 'Payment Date'}</th>
                  <th style="padding: 5px 6px; text-align: center;">${isBn ? 'পদ্ধতি / রেফারেন্স' : 'Method / Ref'}</th>
                  <th style="padding: 5px 8px; text-align: right;">${isBn ? 'জমা পরিমাণ' : 'Amount'}</th>
                  <th style="padding: 5px 8px; text-align: center; border-top-right-radius: 5px;">${isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                ${monthRows}
              </tbody>
            </table>
          </div>

          <!-- Official Signatures & Verification Badge Footer -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 18px; border-top: 1px dashed #94a3b8; font-size: 11px;">
            <div style="text-align: center;">
              <div style="width: 140px; border-bottom: 1.5px solid #475569; margin-bottom: 4px;"></div>
              <p style="font-size: 11px; font-weight: 700; color: #334155;">${isBn ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}</p>
              <p style="font-size: 9px; color: #94a3b8;">${memberName}</p>
            </div>

            <!-- Central Official Seal Emblem -->
            <div style="text-align: center; border: 1.5px solid #059669; border-radius: 8px; padding: 4px 12px; background: #f0fdf4;">
              <div style="font-size: 10px; font-weight: 800; color: #065f46; letter-spacing: 0.5px;">✓ OFFICIAL VERIFIED</div>
              <div style="font-size: 8.5px; color: #047857; font-family: monospace; font-weight: 700;">PROBASHI MUKTO FUND • DIGITAL SEAL</div>
            </div>

            <div style="text-align: center;">
              <div style="width: 150px; border-bottom: 1.5px solid #475569; margin-bottom: 4px;"></div>
              <p style="font-size: 11px; font-weight: 700; color: #334155;">${isBn ? 'ফান্ড এডমিন ও কোষাধ্যক্ষ' : 'Fund Admin / Treasurer'}</p>
              <p style="font-size: 9px; color: #94a3b8;">${fundName}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Auto Print Trigger -->
      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback via invisible iframe if popups blocked
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
    
    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => document.body.removeChild(printFrame), 2000);
      }, 500);
    } else {
      window.print();
    }
  }
}

/**
 * Print the Complete 12-Month Fund Matrix Spreadsheet Report (Optimized for A4 Landscape)
 */
export function printYearlyFundMatrix(
  members: Member[],
  payments: MonthlyPayment[],
  selectedYear: number,
  fund: Fund,
  isBn: boolean = true
) {
  const fundName = fund?.name || 'প্রবাসী মুক্ত ফান্ড';
  const printDate = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const memberRows = members.map((member) => {
    const memberPayments = payments.filter((p) => p.memberId === member.id && p.year === selectedYear);
    const monthlyDue = member.monthlyShareAmount || (member.shares ? member.shares * 1000 : 1000);
    let totalPaid = 0;

    const monthTds = MONTHS.map((m) => {
      const monthPays = memberPayments.filter((p) => p.month === m.id);
      const sum = monthPays.reduce((acc, p) => acc + (p.amount || 0), 0);
      totalPaid += sum;

      const isPaid = sum >= monthlyDue;
      const isPartial = sum > 0 && sum < monthlyDue;

      return `
        <td style="padding: 6px 4px; text-align: center; border: 1px solid #cbd5e1; font-size: 11px; ${
          isPaid ? 'background: #d1fae5; color: #065f46; font-weight: 700;' : isPartial ? 'background: #fef3c7; color: #92400e; font-weight: 600;' : 'color: #94a3b8;'
        }">
          ${sum > 0 ? sum.toLocaleString() : '—'}
        </td>
      `;
    }).join('');

    const target = monthlyDue * 12;
    const isComplete = totalPaid >= target;

    return `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 12px; color: #0f172a;">
          ${isBn ? member.nameBn || member.name : member.name}
        </td>
        <td style="padding: 6px 4px; border: 1px solid #cbd5e1; font-size: 11px; color: #475569; text-align: center;">
          ${member.country}
        </td>
        <td style="padding: 6px 4px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; text-align: center;">
          ${member.shares || 1}
        </td>
        ${monthTds}
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 800; font-size: 12px; color: ${isComplete ? '#047857' : '#0f172a'}; background: #f8fafc;">
          ৳${totalPaid.toLocaleString()}
        </td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isBn ? 'bn' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <title>${fundName} - ${selectedYear} Annual Matrix Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Hind Siliguri', sans-serif;
          color: #0f172a;
          background: #ffffff;
          padding: 20px;
        }
        @page { size: landscape; margin: 10mm; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div style="border: 2px solid #059669; border-radius: 12px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${
              fund?.logoUrl || fund?.avatarUrl
                ? `<img src="${fund.logoUrl || fund.avatarUrl}" alt="${fundName}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 8px; border: 1.5px solid #059669; background: #ffffff; padding: 2px;" />`
                : `<div style="width: 42px; height: 42px; border-radius: 8px; background: #065f46; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900;">PMF</div>`
            }
            <div>
              <h1 style="font-size: 20px; font-weight: 800; color: #065f46;">${fundName}</h1>
              <p style="font-size: 12px; color: #475569;">${isBn ? `${toBengaliNumerals(selectedYear)} সালের বার্ষিক সদস্য সঞ্চয় আদায় লেজার` : `Annual Member Contribution Ledger (${selectedYear})`}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 11px; color: #64748b;">${isBn ? 'মুদ্রণ তারিখ:' : 'Printed on:'} ${printDate}</p>
            <p style="font-size: 12px; font-weight: 700; color: #065f46;">${isBn ? `মোট সদস্য: ${toBengaliNumerals(members.length)} জন` : `Total Members: ${members.length}`}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #065f46; color: #ffffff;">
              <th style="padding: 6px 8px; border: 1px solid #047857; text-align: left;">${isBn ? 'সদস্যের নাম' : 'Member'}</th>
              <th style="padding: 6px 4px; border: 1px solid #047857; text-align: center;">${isBn ? 'দেশ' : 'Country'}</th>
              <th style="padding: 6px 4px; border: 1px solid #047857; text-align: center;">${isBn ? 'শেয়ার' : 'Share'}</th>
              ${MONTHS.map((m) => `<th style="padding: 6px 4px; border: 1px solid #047857; text-align: center;">${isBn ? m.nameBn.slice(0, 3) : m.nameEn.slice(0, 3)}</th>`).join('')}
              <th style="padding: 6px 8px; border: 1px solid #047857; text-align: right;">${isBn ? 'মোট জমা' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            ${memberRows}
          </tbody>
        </table>
      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    window.print();
  }
}

/**
 * Print Single Payment Receipt Slip
 */
export function printSinglePaymentReceipt(
  payment: MonthlyPayment,
  member: Member | undefined,
  fund: Fund,
  isBn: boolean = true
) {
  const memberName = isBn ? member?.nameBn || payment.memberName : payment.memberName;
  const fundName = fund?.name || 'প্রবাসী মুক্ত ফান্ড';
  const monthName = isBn ? MONTHS[payment.month - 1]?.nameBn || payment.month : MONTHS[payment.month - 1]?.nameEn || payment.month;
  const printDate = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isBn ? 'bn' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <title>${fundName} - Payment Receipt #${payment.receiptNumber || payment.id.slice(0, 8)}</title>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
      <style>
        @page { size: A5 portrait; margin: 10mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          background: #ffffff;
          padding: 15px;
        }
        .receipt-card {
          border: 2px solid #059669;
          border-radius: 12px;
          padding: 18px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 12px;
          margin-bottom: 15px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #cbd5e1;
          font-size: 13px;
        }
        .amount-box {
          background: #ecfdf5;
          border: 1.5px solid #a7f3d0;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <div>
            <h1 style="font-size: 18px; font-weight: 800; color: #065f46;">${fundName}</h1>
            <p style="font-size: 11px; color: #64748b;">${isBn ? 'অফিসিয়াল মানি রসিদ (Official Money Receipt)' : 'Official Money Receipt'}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 11px; font-family: monospace; font-weight: bold; color: #065f46;">#${payment.receiptNumber || payment.id.slice(0, 8)}</p>
            <p style="font-size: 10px; color: #64748b;">${printDate}</p>
          </div>
        </div>

        <div class="row">
          <span style="color: #64748b;">${isBn ? 'সদস্যের নাম:' : 'Member Name:'}</span>
          <span style="font-weight: 700; color: #0f172a;">${memberName}</span>
        </div>
        ${member?.country ? `
        <div class="row">
          <span style="color: #64748b;">${isBn ? 'প্রবাসী দেশ:' : 'Country:'}</span>
          <span style="font-weight: 600;">${getCountryFlag(member.country)} ${member.country}</span>
        </div>` : ''}
        <div class="row">
          <span style="color: #64748b;">${isBn ? 'সঞ্চয়ের মাস ও বছর:' : 'Savings Month/Year:'}</span>
          <span style="font-weight: 700;">${monthName} ${isBn ? toBengaliNumerals(payment.year) : payment.year}</span>
        </div>
        <div class="row">
          <span style="color: #64748b;">${isBn ? 'পরিশোধের মাধ্যম:' : 'Payment Method:'}</span>
          <span style="font-weight: 600;">${payment.paymentMethod}</span>
        </div>
        <div class="row">
          <span style="color: #64748b;">${isBn ? 'পরিশোধের তারিখ:' : 'Payment Date:'}</span>
          <span style="font-weight: 600;">${formatCustomDate(payment.paymentDate, isBn)}</span>
        </div>
        ${payment.transactionId ? `
        <div class="row">
          <span style="color: #64748b;">${isBn ? 'ট্রানজেকশন আইডি:' : 'Transaction ID:'}</span>
          <span style="font-family: monospace; font-weight: 700;">${payment.transactionId}</span>
        </div>` : ''}

        <div class="amount-box">
          <span style="font-size: 11px; color: #047857; font-weight: 600; text-transform: uppercase; display: block;">${isBn ? 'জমাকৃত মোট টাকা' : 'Total Contributed Amount'}</span>
          <span style="font-size: 22px; font-weight: 800; color: #065f46; font-family: monospace;">${formatBDT(payment.amount, isBn)}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; font-size: 11px;">
          <div style="text-align: center;">
            <div style="border-top: 1px solid #94a3b8; width: 100px; padding-top: 4px; color: #64748b;">${isBn ? 'সদস্যের স্বাক্ষর' : 'Member Sign'}</div>
          </div>
          <div style="text-align: center;">
            <div style="border-top: 1px solid #059669; width: 120px; padding-top: 4px; color: #065f46; font-weight: 700;">${isBn ? 'তহবিল পরিচালক / ক্যাশিয়ার' : 'Authorized Signatory'}</div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=800,height=700');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    window.print();
  }
}

/**
 * Print Entire Transactions Ledger
 */
export function printTransactionsLedger(
  payments: MonthlyPayment[],
  fund: Fund,
  isBn: boolean = true
) {
  const fundName = fund?.name || 'প্রবাসী মুক্ত ফান্ড';
  const totalSum = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const printDate = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const rows = payments.map((p, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 6px 8px; text-align: center;">${isBn ? toBengaliNumerals(idx + 1) : idx + 1}</td>
      <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; color: #475569;">#${p.receiptNumber || p.id.slice(0, 8)}</td>
      <td style="padding: 6px 8px; font-weight: 700; color: #0f172a;">${p.memberName}</td>
      <td style="padding: 6px 8px; text-align: center;">${MONTHS[p.month - 1]?.nameBn || p.month} ${isBn ? toBengaliNumerals(p.year) : p.year}</td>
      <td style="padding: 6px 8px; text-align: right; font-weight: 800; font-family: monospace; color: #047857;">${formatBDT(p.amount, isBn)}</td>
      <td style="padding: 6px 8px; text-align: center;">${p.paymentMethod}</td>
      <td style="padding: 6px 8px; text-align: center; color: #64748b;">${formatCustomDate(p.paymentDate, isBn)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isBn ? 'bn' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <title>${fundName} - Transactions Ledger Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        @page { size: landscape; margin: 10mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Hind Siliguri', sans-serif; color: #0f172a; background: #ffffff; padding: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 12px;">
        <div>
          <h1 style="font-size: 20px; font-weight: 800; color: #065f46;">${fundName}</h1>
          <p style="font-size: 12px; color: #475569;">${isBn ? 'সকল সদস্য সঞ্চয় ও আদায়কৃত লেনদেন লেজার স্টেটমেন্ট' : 'Complete Member Transactions & Contribution Ledger'}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 11px; color: #64748b;">${isBn ? 'মুদ্রণ তারিখ:' : 'Printed on:'} ${printDate}</p>
          <p style="font-size: 13px; font-weight: 800; color: #065f46;">${isBn ? `সর্বমোট জমা: ${formatBDT(totalSum, true)} (${toBengaliNumerals(payments.length)} টি লেনদেন)` : `Total Collected: ${formatBDT(totalSum, false)} (${payments.length} txns)`}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr style="background: #065f46; color: #ffffff; font-size: 11px;">
            <th style="padding: 6px 8px; text-align: center;">#</th>
            <th style="padding: 6px 8px; text-align: left;">${isBn ? 'রসিদ নং' : 'Receipt #'}</th>
            <th style="padding: 6px 8px; text-align: left;">${isBn ? 'সদস্যের নাম' : 'Member'}</th>
            <th style="padding: 6px 8px; text-align: center;">${isBn ? 'মাস ও বছর' : 'Month/Year'}</th>
            <th style="padding: 6px 8px; text-align: right;">${isBn ? 'জমাকৃত পরিমাণ' : 'Amount'}</th>
            <th style="padding: 6px 8px; text-align: center;">${isBn ? 'মাধ্যম' : 'Method'}</th>
            <th style="padding: 6px 8px; text-align: center;">${isBn ? 'তারিখ' : 'Date'}</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    window.print();
  }
}
