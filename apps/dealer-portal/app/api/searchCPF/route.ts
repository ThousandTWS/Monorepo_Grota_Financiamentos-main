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
          "DeviceToken": "20c1b882-e68b-4659-9877-3e0e711830d0",
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZ2F0ZXdheS5hcGlicmFzaWwuaW8vYXBpL3YyL2F1dGgvcmVnaXN0ZXIiLCJpYXQiOjE3NjQwMzI2NDcsImV4cCI6MTc5NTU2ODY0NywibmJmIjoxNzY0MDMyNjQ3LCJqdGkiOiJZVEJNQ3lCZmNoRnRFbkU3Iiwic3ViIjoiMTg3ODMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.gmxBG46RA_3sMIFzOXCKmG6p4N4PI77hWcKpWoBm5to" ,
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
