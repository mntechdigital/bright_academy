const MapSection = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <iframe
          title="আমাদের অবস্থান"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58994.44882292452!2d90.32153!3d22.70192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3754d38ef6e83e33%3A0xa53f956c01b5f8d!2sBarisal%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
          width="100%"
          height="420"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

export default MapSection;