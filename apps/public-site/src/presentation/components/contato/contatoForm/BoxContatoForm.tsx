"use client";

import { InputGroup } from "@/src/presentation/layout/shared/InputGroups";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MessageSquareText, Phone, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const contactSchema = z.object({
  name: z.string().min(4, "O nome é obrigatório"),
  email: z.string().min(4, "O email é obrigatório"),
  phone: z.string().min(4, "O telefone é obrigatório"),
  message: z.string().min(4, "A mensagem é obrigatória"),
});

type ContactForm = z.infer<typeof contactSchema>;

function BoxContatoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("E-mail enviado!");
        reset();
      } else {
        console.error("Error ao enviar email");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = `w-full pl-10 pr-4 py-3 
    border-2 rounded-xl 
    transition-all duration-200
    placeholder:text-gray-400 
    focus:outline-none focus:ring-2
    focus:border-blue-700 focus:ring-blue-200 focus:text-black
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${Object.keys(errors).length > 0 ? "border-red-400" : "border-gray-200"}
  `;

  const textareaStyle = `w-full pl-4 pr-4 py-3 
    border-2 rounded-xl 
    transition-all duration-200
    placeholder:text-gray-400 
    focus:outline-none focus:ring-2
    focus:border-blue-700 focus:ring-blue-200 focus:text-black
    disabled:bg-gray-50 disabled:cursor-not-allowed resize-none
    ${Object.keys(errors).length > 0 ? "border-red-400" : "border-gray-200"}
  `;

  return (
    <div
      className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
      data-oid="qxq20bp"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800" data-oid="5lb5ad8">
        Envie sua Mensagem
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        data-oid="-1c1vxt"
      >
        <InputGroup
          id="name"
          label="Nome"
          icon={<User size={20} />}
          error={errors.name}
        >
          <input
            type="text"
            id="name"
            {...register("name")}
            className={inputStyle}
            placeholder="Digite seu nome completo"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup
          id="email"
          label="Email"
          icon={<Mail size={20} />}
          error={errors.email}
        >
          <input
            type="text"
            id="email"
            {...register("email")}
            className={inputStyle}
            placeholder="seuemail@empresa.com.br"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup
          id="phone"
          label="Telefone"
          icon={<Phone size={20} />}
          error={errors.phone}
        >
          <input
            type="text"
            id="phone"
            {...register("phone")}
            className={inputStyle}
            placeholder="(11) 98765-4321"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup id="message" label="Mensagem" error={errors.message}>
          <textarea
            id="message"
            {...register("message")}
            rows={5}
            className={textareaStyle}
            placeholder="Digite sua mensagem aqui..."
            data-oid="fovnk:t"
          />
        </InputGroup>

        <button
          type="submit"
          disabled={isLoading || !isDirty || !isValid}
          className="w-full bg-[#1B4B7C] hover:bg-[#153a5f] disabled:bg-blue-400 text-white py-3 rounded-xl font-bold text-lg 
          transition-all duration-300 ease-in-out shadow-lg shadow-blue-200/50 
          flex items-center justify-center gap-3 mt-8"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Mensagem"
          )}
        </button>
      </form>
    </div>
  );
}

export default BoxContatoForm;
