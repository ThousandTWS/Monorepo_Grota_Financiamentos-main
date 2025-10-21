import { Resend } from "resend";

interface ResendEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const resend = new Resend("re_YzpTCTc7_GNwwst52MzuFWdRTecWxQUka");

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Contato Site <onboarding@resend.dev>", // Domínio da GROTA oficial e cadastrado no Resend
      to: ["contato@grotafinanciamentos.com.br"], // Email corporativo da GROTA para receber os contatos
      replyTo: email, // Já marca o cliente no e-mail, podendo responder diretamente a ele
      subject: `Nova mensagem de ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 12px;">
          <h2>📩 Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || "Não informado"}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message}</p>
        </div>
      `, // Seria o HTML do email
    });

    if (error) {
      console.error("Erro Resend:", error);
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    return Response.json(
      { error: "Erro interno ao enviar e-mail." },
      { status: 500 }
    );
  }
}
