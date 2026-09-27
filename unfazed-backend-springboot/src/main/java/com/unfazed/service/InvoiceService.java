package com.unfazed.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.unfazed.entity.Payment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.awt.Color;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    public byte[] generateGstInvoicePdf(Payment payment) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryColor = new Color(49, 130, 206); // Sleek blue
            Color darkGray = new Color(45, 55, 72);

            // Header Font
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, primaryColor);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, darkGray);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, darkGray);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, darkGray);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);

            // Document Header
            Paragraph title = new Paragraph("UNFAZED - GST TAX INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);

            Paragraph sub = new Paragraph("Private Practice Management Platform | GSTIN: 29AABCU9603R1ZM", normalFont);
            document.add(sub);
            document.add(new Paragraph(" "));

            // Invoice details table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);

            PdfPCell c1 = new PdfPCell(new Phrase("Invoice Number: " + (payment.getInvoiceNumber() != null ? payment.getInvoiceNumber() : "INV-" + payment.getId()), boldFont));
            c1.setBorder(Rectangle.NO_BORDER);
            metaTable.addCell(c1);

            String dateStr = payment.getCreatedAt() != null ? payment.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")) : "N/A";
            PdfPCell c2 = new PdfPCell(new Phrase("Date: " + dateStr, normalFont));
            c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c2.setBorder(Rectangle.NO_BORDER);
            metaTable.addCell(c2);

            document.add(metaTable);
            document.add(new Paragraph("----------------------------------------------------------------------------------------------------------------"));
            document.add(new Paragraph(" "));

            // Provider & Recipient info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);

            String therapistName = payment.getTherapist() != null ? payment.getTherapist().getName() : "Dr. Sharma";
            String clientName = payment.getClient() != null ? payment.getClient().getName() : "Valued Client";
            String clientEmail = payment.getClient() != null ? payment.getClient().getEmail() : "client@example.com";

            PdfPCell therapistCell = new PdfPCell();
            therapistCell.setBorder(Rectangle.NO_BORDER);
            therapistCell.addElement(new Paragraph("PROVIDER (Therapist):", boldFont));
            therapistCell.addElement(new Paragraph(therapistName, subTitleFont));
            therapistCell.addElement(new Paragraph("Licensed Clinical Practice", normalFont));

            PdfPCell clientCell = new PdfPCell();
            clientCell.setBorder(Rectangle.NO_BORDER);
            clientCell.addElement(new Paragraph("BILLED TO (Client):", boldFont));
            clientCell.addElement(new Paragraph(clientName, subTitleFont));
            clientCell.addElement(new Paragraph("Email: " + clientEmail, normalFont));

            infoTable.addCell(therapistCell);
            infoTable.addCell(clientCell);
            document.add(infoTable);
            document.add(new Paragraph(" "));

            // Line items table
            PdfPTable itemTable = new PdfPTable(4);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{4, 2, 2, 2});

            // Table Headers
            String[] headers = {"Item Description", "Base Price", "GST (18%)", "Net Amount (INR)"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(primaryColor);
                cell.setPadding(8);
                itemTable.addCell(cell);
            }

            double gross = payment.getGrossAmount() != null ? payment.getGrossAmount() : 1500.0;
            double gst = payment.getGstAmount() != null ? payment.getGstAmount() : (gross * 0.18);
            double net = payment.getNetAmount() != null ? payment.getNetAmount() : (gross + gst);

            // Line Item row
            itemTable.addCell(new PdfPCell(new Phrase("Psychotherapy Consultation Session", normalFont)));
            itemTable.addCell(new PdfPCell(new Phrase(String.format("INR %.2f", gross), normalFont)));
            itemTable.addCell(new PdfPCell(new Phrase(String.format("INR %.2f", gst), normalFont)));
            itemTable.addCell(new PdfPCell(new Phrase(String.format("INR %.2f", net), boldFont)));

            document.add(itemTable);
            document.add(new Paragraph(" "));

            // Summary
            Paragraph total = new Paragraph(String.format("Total Amount Paid: INR %.2f (Payment Status: SUCCESS - %s)", net, payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "ONLINE"), subTitleFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph("Thank you for using Unfazed SaaS Platform. Computer generated invoice — no signature required.", FontFactory.getFont(FontFactory.HELVETICA, 9, Font.ITALIC, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}
