import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

interface ResendEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const resendApiKey = "re_YzpTCTc7_GNwwst52MzuFWdRTecWxQUka";

const resend = new Resend(resendApiKey);

export const ResendEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { name, email, phone, message } = req.body as ResendEmailProps;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${email}`,
      to: ["marciojorgemedeirosmelofilho@gmail.com"],
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
      `,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    return res.status(500).json({ error: "Erro interno ao enviar e-mail." });
  }
};
