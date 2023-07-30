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
    static downloadNoteTemplate(doc: PDFKit.PDFDocument, library: Folder[]): void {
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
    
        const pageHeight = doc.page.height;
        const cardWidth = 500;
        const cornerRadius = 10;
        const fieldSpacing = 130;
    
        doc.fontSize(20).text('Library de Pastas e Notas', { align: 'center' });
        doc.moveDown();
    
        library.forEach((folder, index) => {
            // Check if there is enough space to draw the folder card
            const folderCardHeight = 100;
            if (doc.y + folderCardHeight >= pageHeight - 50) {
                doc.addPage();
            }
    
            // Configurações para o "card" com cantos arredondados da pasta
            const folderCardX = 50;
            const folderCardY = doc.y;
    
            doc.save(); // Salvar o estado atual do documento
    
            // Preenche o retângulo com cor de fundo e adiciona o contorno
            drawRoundedRectangle(folderCardX, folderCardY, cardWidth, folderCardHeight, cornerRadius);
            doc.fillAndStroke('#f9f9f9', '#cccccc');
    
            doc.fontSize(14).fillColor('#000000').text(`Pasta ${index + 1}`, folderCardX + 10, folderCardY + 10); // Adicione a cor preta ao texto
            doc.fontSize(12).fillColor('#000000').text(`Nome: ${folder.name}`, folderCardX + 10, folderCardY + 30); // Adicione a cor preta ao texto
            doc.fontSize(12).fillColor('#000000').text(`Default: ${folder.is_default ? 'Sim' : 'Não'}`, folderCardX + 10 + fieldSpacing, folderCardY + 30); // Adicione a cor preta ao texto
            doc.fontSize(12).fillColor('#000000').text(`Cor: ${folder.color}`, folderCardX + 10 + fieldSpacing * 2, folderCardY + 30); // Adicione a cor preta ao texto
            doc.fontSize(12).fillColor('#000000').text(`Ordem: ${folder.order}`, folderCardX + 10 + fieldSpacing * 3, folderCardY + 30); // Adicione a cor preta ao texto
    
            doc.restore(); // Restaurar o estado anterior do documento
    
            doc.moveDown();
    
            // Notas da pasta
            folder.notes.forEach((note, noteIndex) => {
                // Check if there is enough space to draw the note card
                const noteCardHeight = doc.heightOfString(`Anotação ${noteIndex + 1}`, { width: cardWidth - 50 }) + 150; // Altura estimada da nota
                if (doc.y + noteCardHeight >= pageHeight - 50) {
                    doc.addPage();
                }
    
                const noteCardX = folderCardX + 50;
                const noteCardY = doc.y;
    
                doc.save(); // Salvar o estado atual do documento
    
                // Preenche o retângulo com cor de fundo e adiciona o contorno
                drawRoundedRectangle(noteCardX, noteCardY, cardWidth - 50, noteCardHeight, cornerRadius);
                doc.fillAndStroke('#f9f9f9', '#cccccc');
    
                doc.fontSize(14).fillColor('#000000').text(`Anotação ${noteIndex + 1}`, noteCardX + 10, noteCardY + 10); // Adicione a cor preta ao texto
    
                // Tamanho dinâmico dos campos Corpo e Estilo
                const fieldOptions = { width: cardWidth - 70, height: noteCardHeight - 40 };
                doc.fontSize(12).fillColor('#000000').text(`Título: ${note.title}`, noteCardX + 10, noteCardY + 40, fieldOptions); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Corpo: ${note.body}`, noteCardX + 10, noteCardY + 60, fieldOptions); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Estilo: ${note.style}`, noteCardX + 10, noteCardY + 80, fieldOptions); // Adicione a cor preta ao texto
    
                doc.fontSize(12).fillColor('#000000').text(`Na lixeira: ${note.trashed ? 'Sim' : 'Não'}`, noteCardX + 200, noteCardY + 60); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Data de exclusão: ${note.deleted_date}`, noteCardX + 200, noteCardY + 80); // Adicione a cor preta ao texto
                doc.fontSize(12).fillColor('#000000').text(`Data de atualização: ${note.update_at}`, noteCardX + 200, noteCardY + 100); // Adicione a cor preta ao texto
    
                doc.restore(); // Restaurar o estado anterior do documento
    
                doc.moveDown();
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