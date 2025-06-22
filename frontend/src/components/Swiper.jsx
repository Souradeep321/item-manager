import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';


export default function CustomSwiper({ className = '', img = [] }) {
  return (
    <Swiper
      modules={[Scrollbar, A11y, Autoplay]}
      spaceBetween={12}
      slidesPerView="auto"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop
      className={`overflow-hidden ${className}`}
    >
      {img.map((slide, index) => (
        <SwiperSlide key={index} className="!w-[200px]">
          <div
            className="h-[250px] bg-cover bg-center rounded-xl shadow-lg flex flex-col justify-end text-white p-4"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <span className="text-sm opacity-70">Product</span>
            <h3 className="text-lg font-semibold truncate">{slide.title}</h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
