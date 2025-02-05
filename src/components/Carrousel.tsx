'use client';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import {imagesDecoy} from "@/Utils/imagesDecoy";

const Carrousel = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true, // Active le mode centré
        centerPadding: '1rem', // Ajoute un espace de 1rem autour des slides
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    centerMode: true,
                    centerPadding: '1rem',
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    centerMode: true,
                    centerPadding: '1rem',
                }
            }
        ]
    };



    return (
        <div className={"w-[750px] m-auto bg-[#F1E8E8]"}>
            <Slider {...settings}>
                {imagesDecoy.map((image, index) => (
                    <div key={index}>
                        <div className={"bg-white m-4 p-2 rounded-lg"}>
                            <Image src={image} alt={`Slide ${index + 1}`} width={250} height={250} />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carrousel;