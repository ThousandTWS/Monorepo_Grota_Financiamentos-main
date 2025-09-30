package org.example.server.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
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

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    @Async
    public void sendVerificartionEmail(String to, String code){
        try {
            // cria contexto do Thymeleaf
            Context ctx = new Context();
            ctx.setVariable("code", code);

            // processa template
            String html = springTemplateEngine.process("verification-email", ctx);

            // prepara e envia o e-mail
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setTo(to);
            helper.setSubject("Verificação de E-mail");
            helper.setText(html, true);
            helper.setFrom("no-reply@suaempresa.com");

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }
}
