import React from "react";

function BoxMapa() {
  return (
    <div className="w-full" data-oid="0nsxvyp">
      <div
        className="rounded-xl overflow-hidden shadow-xl border border-gray-200"
        data-oid="1c7jx-n">

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.869903222802!2d-47.104703699999995!3d-22.918168899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c92f31a76275%3A0x434ca72498013552!2sGrota%20Financiamentos!5e0!3m2!1spt-BR!2sbr!4v1757037300639!5m2!1spt-BR!2sbr"
          width="100%"
          height="680"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa da Grota Financiamentos"
          data-oid="q90wn-9">
        </iframe>
      </div>
    </div>);

}

export default BoxMapa;