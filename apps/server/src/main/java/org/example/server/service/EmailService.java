package org.example.server.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.server.exception.EmailException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    @Async
    public void sendVerificationEmail(String to, String code){
        sendEmailWithTemplate(to, "Verificação de E-mail", "verification-email", code);
    }

    @Async
    public void sendPasswordResetEmail(String to, String code) {
        sendEmailWithTemplate(to, "Redefinição de Senha", "password-reset-email", code);
    }

    @Async
    public void sendPasswordToEmail(String to, String password){
        sendEmailWithTemplate(to, "Senha para login", "password-seller", password);
    }

    @Async
    protected void sendEmailWithTemplate(String to, String subject, String templateName, String code){
        try {
            Context ctx = new Context();
            ctx.setVariable("code", code);

            String html = springTemplateEngine.process(templateName, ctx);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            helper.setFrom(fromEmail);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new EmailException("Não foi possível enviar e-mail", e);
        }
    }
}
