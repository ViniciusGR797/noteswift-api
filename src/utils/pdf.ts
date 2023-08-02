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

export type PDFGeneratorTemplate = (doc: PDFKit.PDFDocument, items: any[]) => void;

export class TemplatePDF {
    static drawRoundedRectangle(
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

    static drawFolderCard(doc: PDFKit.PDFDocument, folder: Folder, index: number, cardWidth: number): void {
        const folderCardHeight = 80;
        const folderCardX = 20;
        const folderCardY = doc.y;

        const fieldSpacing = 200;
        const fieldPosition = 60 + 16 * ~~(folder.name.length / doc.x);
        const textColor = '#000000';

        if (doc.y + folderCardHeight >= doc.page.height - 50) {
            doc.addPage();
        }

        TemplatePDF.drawRoundedRectangle(doc, folderCardX, folderCardY, cardWidth, folderCardHeight + fieldPosition, 10, '#f9f9f9', '#cccccc');

        doc.fontSize(20)
            .font('Helvetica-Bold')
            .text(`Pasta ${index + 1}`, folderCardX + 20, folderCardY + 10);
        doc.fontSize(12)
            .fillColor(textColor)
            .font('Helvetica')
            .text('Nome:', folderCardX + 20, folderCardY + 40, { continued: true, underline: true, indent: 20 })
            .text(` ${folder.name}`, folderCardX + 20, folderCardY + 40, { underline: false, width: folder.name.length });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Default:', folderCardX + 20, folderCardY + fieldPosition, { continued: true, underline: true, indent: 20 })
            .text(` ${folder.is_default ? 'Sim' : 'Não'}`, folderCardX + 20, folderCardY + fieldPosition, { underline: false });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Cor:', folderCardX + 20 + fieldSpacing, folderCardY + fieldPosition, { continued: true, underline: true, indent: 20 })
            .fillColor(folder.color)
            .text(` ${folder.color}`, folderCardX + 20 + fieldSpacing, folderCardY + fieldPosition, { underline: false });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Ordem:', folderCardX + 20 + fieldSpacing * 2, folderCardY + fieldPosition, { continued: true, underline: true, indent: 20 })
            .text(` ${folder.order}`, folderCardX + 20 + fieldSpacing * 2, folderCardY + fieldPosition, { underline: false });

        doc.fontSize(14).moveDown(2);
    }

    static drawNoteCard(doc: PDFKit.PDFDocument, note: Note, noteIndex: number, cardWidth: number): void {
        const noteCardHeight = 100;
        const noteCardX = 100;
        let noteCardY = doc.y;

        const fieldPositionTitle = 56 + 1.48 * ~~(note.title.length / (doc.x / 60));
        const fieldPositionBody = 18 + fieldPositionTitle + 1.45 * ~~(note.body.length / (doc.x / 60));
        const fieldPositionStyle = 18 + fieldPositionBody + 1.45 * ~~(note.style.length / (doc.x / 60));
        const textColor = '#000000';

        if (doc.y + noteCardHeight + fieldPositionStyle >= doc.page.height - 50) {
            doc.addPage();
            noteCardY = 50;
        }

        TemplatePDF.drawRoundedRectangle(doc, noteCardX, noteCardY, cardWidth - 100, noteCardHeight + fieldPositionStyle, 10, '#f9f9f9', '#cccccc');

        doc.fontSize(20)
            .font('Helvetica-Bold')
            .text(`Anotação ${noteIndex + 1}`, noteCardX + 20, noteCardY + 10);
        doc.fontSize(12)
            .fillColor(textColor)
            .font('Helvetica')
            .text('Título:', noteCardX + 20, noteCardY + 40, { continued: true, underline: true, indent: 20 })
            .text(` ${note.title}`, noteCardX + 20, noteCardY + 40, { underline: false, width: note.title.length });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Corpo:', noteCardX + 20, noteCardY + fieldPositionTitle, { continued: true, underline: true, indent: 20 })
            .text(` ${note.body}`, noteCardX + 20, noteCardY + fieldPositionTitle, { underline: false, width: note.body.length });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Estilo:', noteCardX + 20, noteCardY + fieldPositionBody, { continued: true, underline: true, indent: 20 })
            .text(` ${note.style}`, noteCardX + 20, noteCardY + fieldPositionBody, { underline: false, width: note.style.length });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Na lixeira:', noteCardX + 20, noteCardY + fieldPositionStyle, { continued: true, underline: true, indent: 20 })
            .text(` ${note.trashed ? 'Sim' : 'Não'}`, noteCardX + 20, noteCardY + fieldPositionStyle, { underline: false });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Data de exclusão:', noteCardX + 20, noteCardY + fieldPositionStyle + 18, { continued: true, underline: true, indent: 20 })
            .text(` ${note.deleted_date}`, noteCardX + 20, noteCardY + fieldPositionStyle + 18, { underline: false });
        doc.fontSize(12)
            .fillColor(textColor)
            .text('Data de atualização:', noteCardX + 20, noteCardY + fieldPositionStyle + 36, { continued: true, underline: true, indent: 20 })
            .text(` ${note.update_at}`, noteCardX + 20, noteCardY + fieldPositionStyle + 36, { underline: false });

        doc.fontSize(14).moveDown(2);
    }

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
            TemplatePDF.drawFolderCard(doc, folder, index, cardWidth);

            folder.notes.forEach((note, noteIndex) => {
                TemplatePDF.drawNoteCard(doc, note, noteIndex, cardWidth);
            });

            if (index < library.length - 1) {
                doc.moveDown(2);
            }
        });
    }

    static backupBinTemplate(doc: PDFKit.PDFDocument, bin: Note[]): void {
        doc.fontSize(30)
            .font('Helvetica-Bold')
            .text('Backup da Lixeira', { align: 'center' });

        doc.fontSize(14).moveDown(2);

        bin.forEach((note, noteIndex) => {
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
    }
}