import axios, { AxiosError } from "axios";

export async function POST(req: Request) {
  const { cpf } = await req.json();

  try {
    if (!cpf) {
      return Response.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://gateway.apibrasil.io/api/v2/dados/cpf",
      { cpf },
      {
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          "DeviceToken": process.env.APIBRASIL_DEVICE_TOKEN_CPF!,
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          "Authorization": `Bearer ${process.env.APIBRASIL_TOKEN!}`,
        }
      }
    );

    return Response.json({ success: true, data: response.data }, { status: 200 });
  } catch (err) {
    const error = err as AxiosError;
    console.error("API Brasil ERROR:", error?.response?.data || err);

    return Response.json(
      { error: "Erro interno ao buscar CPF." },
      { status: 500 }
    );
  }
}
