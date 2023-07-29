import nodemailer from 'nodemailer';
import config from '../config';

// Configurações para o serviço de envio de e-mails (pode variar de acordo com o seu provedor de e-mails)
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass,
  },
});

export interface EmailOptions {
  from?: string;
  to: string;
  replyTo?: string;
  subject: string;
  text?: string; // Conteúdo em texto
  html?: string; // Conteúdo em formato HTML
}

// Função para enviar o e-mail
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Definir o valor padrão para 'from' e 'replyTo'
  options.from = options.from || config.email.auth.user;
  options.replyTo = options.replyTo || config.email.auth.user;

  try {
    await transporter.sendMail(options);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
}

export class Template {
  static deleteUserTemplate(user: any): string {
    const emailBody = `
            <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Conta Excluída</h1>
                <p style="color: #333333;">Olá ${user.name},</p>
                <p style="color: #333333;">Recebemos uma solicitação para excluir a sua conta.</p>
                <p style="color: #333333;">Infelizmente, a sua conta com ID ${user._id} foi excluída com sucesso.</p>
                <h2 style="color: #333333; margin-top: 30px;">Aqui estão os dados apagados do seu perfil:</h2>
                <div style="background-color: #ffffff; padding: 20px; border: 1px solid #cccccc; border-radius: 5px; margin-bottom: 20px;">
                <p style="color: #333333;"><strong>Nome:</strong> ${user.name}</p>
                <p style="color: #333333;"><strong>E-mail:</strong> ${user.email}</p>
                <h3 style="color: #333333; margin-top: 15px;">Biblioteca:</h3>
                <pre style="background-color: #f0f0f0; padding: 10px; border: 1px solid #cccccc; border-radius: 5px; margin-bottom: 10px;">${JSON.stringify(user.library, null, 2)}</pre>
                <h3 style="color: #333333; margin-top: 15px;">Configurações:</h3>
                <div style="background-color: #f0f0f0; padding: 20px; border: 1px solid #cccccc; border-radius: 5px;">
                    <p style="color: #333333; margin: 0;"><strong>Modo Escuro:</strong> ${user.config.dark_mode ? 'Ativado' : 'Desativado'}</p>
                    <p style="color: #333333; margin: 0;"><strong>Notificação de Rascunhos:</strong> ${user.config.draft_notification ? 'Ativada' : 'Desativada'}</p>
                    <p style="color: #333333; margin: 0;"><strong>Arquivado:</strong> ${user.config.archived ? 'Sim' : 'Não'}</p>
                    <p style="color: #333333; margin: 0;"><strong>Backup Automático:</strong> ${user.config.auto_backup ? 'Ativado' : 'Desativado'}</p>
                    <p style="color: #333333; margin: 0;"><strong>Receber Notícias:</strong> ${user.config.news ? 'Sim' : 'Não'}</p>
                </div>          
                </div>
                <p style="color: #333333;">Atenciosamente,</p>
                <p style="color: #333333;">NoteSwift</p>
            </div>  
            `;

    return emailBody;
  }

  static deleteLibraryTemplate(user: any): string {
    const emailBody = `
          <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Pastas Excluída</h1>
              <p style="color: #333333;">Olá ${user.name},</p>
              <p style="color: #333333;">Recebemos uma solicitação para excluir a biblioteca de pastas não padrão.</p>
              <p style="color: #333333;">Infelizmente, a sua conta com ID ${user._id} teve as biblioteca não padrão excluídas com sucesso.</p>
              <h2 style="color: #333333; margin-top: 30px;">Aqui estão os dados apagados do seu perfil:</h2>
              <div style="background-color: #ffffff; padding: 20px; border: 1px solid #cccccc; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333333; margin-top: 15px;">Biblioteca:</h3>
              <pre style="background-color: #f0f0f0; padding: 10px; border: 1px solid #cccccc; border-radius: 5px; margin-bottom: 10px;">${JSON.stringify(user.library, null, 2)}</pre>    
              </div>
              <p style="color: #333333;">Atenciosamente,</p>
              <p style="color: #333333;">NoteSwift</p>
          </div>  
          `;

    return emailBody;
  }

  static deleteFolderTemplate(user: any): string {
    const emailBody = `
        <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Conta Excluída</h1>
            <p style="color: #333333;">Olá ${user.name},</p>
            <p style="color: #333333;">Recebemos uma solicitação para excluir a pasta <strong>${user.library[0].name}</strong> da sua conta.</p>
            <p style="color: #333333;">Infelizmente, a sua conta com ID ${user._id} teve a pasta excluída com sucesso.</p>
            <h2 style="color: #333333; margin-top: 30px;">Aqui estão os dados da pasta apagada do seu perfil:</h2>
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #cccccc; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #333333; margin-top: 15px;">Pasta:</h3>
            <pre style="background-color: #f0f0f0; padding: 10px; border: 1px solid #cccccc; border-radius: 5px; margin-bottom: 10px;">${JSON.stringify(user.library[0], null, 2)}</pre>      
            </div>
            <p style="color: #333333;">Atenciosamente,</p>
            <p style="color: #333333;">NoteSwift</p>
        </div>  
        `;

    return emailBody;
  }
}
