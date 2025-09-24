import React from "react";

function BoxMapa() {
  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.869903222802!2d-47.104703699999995!3d-22.918168899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c92f31a76275%3A0x434ca72498013552!2sGrota%20Financiamentos!5e0!3m2!1spt-BR!2sbr!4v1757037300639!5m2!1spt-BR!2sbr"
          width="100%"
          height="480"
          style={{ border: 5 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa da Grota Financiamentos"
        ></iframe>
      </div>
    </div>
  );
}

export default BoxMapa;