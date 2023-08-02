import path from 'path';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Folder } from '../models/folderModel';
import { Note } from '../models/noteModel';

export function generatePDF(items: any[], template: PDFGeneratorTemplate, filename: string): void {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    // Chama a função de template para preencher o PDF
    template(doc, items);

    doc.end();
}

function drawRoundedRectangle(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    bgColor: string,
    strokeColor: string
): void {
    doc.save();
    doc.roundedRect(x, y, width, height, radius).fillAndStroke(bgColor, strokeColor);
    doc.restore();
}

function drawFolderCard(doc: PDFKit.PDFDocument, folder: Folder, index: number, cardWidth: number): void {
    const folderCardHeight = 100;
    if (doc.y + folderCardHeight >= doc.page.height - 50) {
        doc.addPage();
    }

    const folderCardX = 20;
    const folderCardY = doc.y;

    const fieldSpacing = 200;
    const fieldPosition = 60 + 16 * ~~(folder.name.length / doc.x);
    const textColor = '#000000';

    drawRoundedRectangle(doc, folderCardX, folderCardY, cardWidth, folderCardHeight + fieldPosition, 10, '#f9f9f9', '#cccccc');

    doc.fontSize(20)
        .font('Helvetica-Bold')
        .text(`Pasta ${index + 1}`, folderCardX + 10, folderCardY + 10);
    doc.fontSize(12)
        .fillColor(textColor)
        .font('Helvetica')
        .text('Nome:', folderCardX + 10, folderCardY + 40, { continued: true, underline: true, indent: 20 })
        .text(` ${folder.name}`, folderCardX + 10, folderCardY + 40, { underline: false, width: folder.name.length });
    doc.fontSize(12)
        .fillColor(textColor)
        .text('Default:', folderCardX + 10, folderCardY + fieldPosition, { continued: true, underline: true, indent: 20 })
        .text(` ${folder.is_default ? 'Sim' : 'Não'}`, folderCardX + 10, folderCardY + fieldPosition, { underline: false });
    doc.fontSize(12)
        .fillColor(textColor)
        .text('Cor:', folderCardX + 10 + fieldSpacing, folderCardY + fieldPosition, { continued: true, underline: true, indent: 20 })
        .fillColor(folder.color)
        .text(` ${folder.color}`, folderCardX + 10 + fieldSpacing, folderCardY + fieldPosition, { underline: false });
    doc.fontSize(12)
        .fillColor(textColor)
        .text('Ordem:', folderCardX + 10 + fieldSpacing * 2, folderCardY + fieldPosition, { continued: true, underline: true, indent: 20 })
        .text(` ${folder.order}`, folderCardX + 10 + fieldSpacing * 2, folderCardY + fieldPosition, { underline: false });

    doc.fontSize(14).moveDown(2);
}

function drawNoteCard(doc: PDFKit.PDFDocument, note: Note, noteIndex: number, cardWidth: number): void {
    const noteCardHeight = doc.heightOfString(`Anotação ${noteIndex + 1}`, { width: cardWidth - 50 }) + 150; // Altura estimada da nota
    if (doc.y + noteCardHeight >= doc.page.height - 50) {
        doc.addPage();
    }

    const noteCardX = 100;
    const noteCardY = doc.y;

    drawRoundedRectangle(doc, noteCardX, noteCardY, cardWidth - 100, noteCardHeight, 10, '#f9f9f9', '#cccccc');

    doc.fontSize(14).fillColor('#000000').text(`Anotação ${noteIndex + 1}`, noteCardX + 10, noteCardY + 10);

    const fieldOptions = { width: cardWidth - 120, height: noteCardHeight - 40 };
    doc.fontSize(12).fillColor('#000000').text(`Título: ${note.title}`, noteCardX + 10, noteCardY + 40, fieldOptions);
    doc.fontSize(12).fillColor('#000000').text(`Corpo: ${note.body}`, noteCardX + 10, noteCardY + 60, fieldOptions);
    doc.fontSize(12).fillColor('#000000').text(`Estilo: ${note.style}`, noteCardX + 10, noteCardY + 80, fieldOptions);
    doc.fontSize(12).fillColor('#000000').text(`Na lixeira: ${note.trashed ? 'Sim' : 'Não'}`, noteCardX + 200, noteCardY + 60);
    doc.fontSize(12).fillColor('#000000').text(`Data de exclusão: ${note.deleted_date}`, noteCardX + 200, noteCardY + 80);
    doc.fontSize(12).fillColor('#000000').text(`Data de atualização: ${note.update_at}`, noteCardX + 200, noteCardY + 100);

    doc.fontSize(14).moveDown(2);
}

export type PDFGeneratorTemplate = (doc: PDFKit.PDFDocument, items: any[]) => void;

export class TemplatePDF {

    static downloadNoteSimpleTemplate(doc: PDFKit.PDFDocument, library: Folder[]): void {
        doc.fontSize(30)
            .font('Helvetica-Bold')
            .text('Library de Pastas e Notas', { align: 'center' });

        doc.fontSize(14).moveDown(2);

        library.forEach((folder, index) => {
            doc.fontSize(20)
                .font('Helvetica-Bold')
                .text(`Pasta ${index + 1}`);
            doc.fontSize(12)
                .font('Helvetica')
                .text('Nome:', { continued: true, underline: true, indent: 20 })
                .text(` ${folder.name}`, { underline: false, width: folder.name.length });
            doc.fontSize(12)
                .text('Default:', { continued: true, underline: true, indent: 20 })
                .text(` ${folder.is_default ? 'Sim' : 'Não'}`, { underline: false });
            doc.fontSize(12)
                .fillColor('#000000')
                .text('Cor:', { continued: true, underline: true, indent: 20 })
                .fillColor(folder.color)
                .text(` ${folder.color}`, { underline: false });
            doc.fontSize(12)
                .fillColor('#000000')
                .text('Ordem:', { continued: true, underline: true, indent: 20 })
                .text(` ${folder.order}`, { underline: false });

            doc.fontSize(14).moveDown();

            doc.fontSize(20)
                .font('Helvetica-Bold')
                .text(`Notas:`);

            doc.fontSize(14).moveDown();

            folder.notes.forEach((note, noteIndex) => {
                doc.fontSize(14)
                    .font('Helvetica-Bold')
                    .text(`Anotação ${noteIndex + 1}`, { indent: 20 });
                doc.fontSize(12)
                    .font('Helvetica')
                    .text('Título:', { continued: true, underline: true, indent: 40 })
                    .text(` ${note.title}`, { underline: false, width: note.title.length });
                doc.fontSize(12)
                    .text('Corpo:', { continued: true, underline: true, indent: 40 })
                    .text(` ${note.body}`, { underline: false, width: note.body.length });
                doc.fontSize(12)
                    .text('Estilo:', { continued: true, underline: true, indent: 40 })
                    .text(` ${note.style}`, { underline: false, width: note.style.length });
                doc.fontSize(12)
                    .text('Na lixeira:', { continued: true, underline: true, indent: 40 })
                    .text(` ${note.trashed ? 'Sim' : 'Não'}`, { underline: false });
                doc.fontSize(12)
                    .text('Data de exclusão:', { continued: true, underline: true, indent: 40 })
                    .text(` ${note.deleted_date}`, { underline: false });
                doc.fontSize(12)
                    .text('Data de atualização:', { continued: true, underline: true, indent: 40 })
                    .text(` ${note.update_at}`, { underline: false });

                doc.fontSize(14).moveDown();
            });

            doc.fontSize(14).moveDown(2);
        });
    }

    static downloadNoteTemplate(doc: PDFKit.PDFDocument, library: Folder[]): void {
        const cardWidth = 570;

        doc.fontSize(20).text('Library de Pastas e Notas', { align: 'center' });
        doc.moveDown();

        library.forEach((folder, index) => {
            drawFolderCard(doc, folder, index, cardWidth);

            folder.notes.forEach((note, noteIndex) => {
                drawNoteCard(doc, note, noteIndex, cardWidth);
            });

            if (index < library.length - 1) {
                doc.moveDown(2);
            }
        });
    }


    static backupBinTemplate(doc: PDFKit.PDFDocument, bin: Note[]): void {
        // Função para criar o estilo de "card" com cantos arredondados
        const drawRoundedRectangle = (x: number, y: number, width: number, height: number, radius: number): void => {
            doc.moveTo(x + radius, y);
            doc.lineTo(x + width - radius, y);
            doc.quadraticCurveTo(x + width, y, x + width, y + radius);
            doc.lineTo(x + width, y + height - radius);
            doc.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            doc.lineTo(x + radius, y + height);
            doc.quadraticCurveTo(x, y + height, x, y + height - radius);
            doc.lineTo(x, y + radius);
            doc.quadraticCurveTo(x, y, x + radius, y);
        };

        doc.fontSize(20).text('Backup da Lixeira', { align: 'center' });
        doc.moveDown();

        const trashedNotes = bin.filter((note) => note.trashed);

        if (trashedNotes.length === 0) {
            doc.fontSize(14).fillColor('#000000').text('Nenhuma nota marcada como trashed encontrada.'); // Adicione a cor preta ao texto
        } else {
            trashedNotes.forEach((note, index) => {
                // Configurações para o "card" com cantos arredondados
                const cardX = 50;
                const cardY = doc.y;
                const cardWidth = 500;
                const cardHeight = 100;
                const cornerRadius = 10;

                drawRoundedRectangle(cardX, cardY, cardWidth, cardHeight, cornerRadius);
                doc.fillAndStroke('#f9f9f9', '#cccccc'); // Preencha o retângulo com cor de fundo e adicione o contorno

                doc.fontSize(14).fillColor('#000000').text(`Anotação ${index + 1}`, cardX + 10, cardY + 10); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Título: ${note.title}`, cardX + 10, cardY + 40); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Corpo: ${note.body}`, cardX + 10, cardY + 60); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Estilo: ${note.style}`, cardX + 10, cardY + 80); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Data de Exclusão: ${note.deleted_date}`, cardX + 200, cardY + 60); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Data de Atualização: ${note.update_at}`, cardX + 200, cardY + 80); // Adicione a cor preta ao texto

                doc.moveDown(2);
            });
        }
    }
}