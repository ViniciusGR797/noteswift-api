import path from 'path';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Folder } from '../models/folderModel';
import { Note } from '../models/noteModel';

export function generatePDF(items: any[], filename: string): void {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename);

    doc.pipe(stream);

    TemplatePDF.backupBinTemplate(doc, items);

    doc.end();
}

export class TemplatePDF {
    static downloadNoteTemplate(doc: PDFKit.PDFDocument, library: Folder[]): void {
        doc.fontSize(20).text('Library de Pastas e Notas', { align: 'center' });
        doc.moveDown();

        library.forEach((folder, index) => {
            doc.fontSize(14).text(`Pasta ${index + 1}`);
            doc.fontSize(12).text(`Nome: ${folder.name}`);
            doc.fontSize(12).text(`Default: ${folder.is_default ? 'Sim' : 'Não'}`);
            doc.fontSize(12).text(`Cor: ${folder.color}`);
            doc.fontSize(12).text(`Ordem: ${folder.order}`);

            doc.moveDown();
            doc.fontSize(14).text('Notas:');
            doc.moveDown();

            folder.notes.forEach((note, noteIndex) => {
                doc.fontSize(12).text(`Título: ${note.title}`);
                doc.fontSize(12).text(`Corpo: ${note.body}`);
                doc.fontSize(12).text(`Estilo: ${note.style}`);
                doc.fontSize(12).text(`Na lixeira: ${note.trashed ? 'Sim' : 'Não'}`);
                doc.fontSize(12).text(`Data de exclusão: ${note.deleted_date}`);
                doc.fontSize(12).text(`Data de atualização: ${note.update_at}`);

                if (noteIndex < folder.notes.length - 1) {
                    doc.moveDown();
                }
            });

            if (index < library.length - 1) {
                doc.moveDown(2);
            }
        });
    }

    static backupBinTemplate(doc: PDFKit.PDFDocument, bin: Note[]): void {
        doc.fontSize(20).text('Backup da Lixeira', { align: 'center' });
        doc.moveDown();

        const trashedNotes = bin.filter((note) => note.trashed);

        if (trashedNotes.length === 0) {
            doc.fontSize(14).text('Nenhuma nota marcada como trashed encontrada.');
        } else {
            trashedNotes.forEach((note, index) => {
                doc.fontSize(14).text(`Anotação ${index + 1}`);
                doc.fontSize(12).text(`Título: ${note.title}`);
                doc.fontSize(12).text(`Corpo: ${note.body}`);
                doc.fontSize(12).text(`Estilo: ${note.style}`);
                doc.fontSize(12).text(`Data de Exclusão: ${note.deleted_date}`);
                doc.fontSize(12).text(`Data de Atualização: ${note.update_at}`);

                if (index < trashedNotes.length - 1) {
                    doc.moveDown();
                }
            });
        }
    }
}