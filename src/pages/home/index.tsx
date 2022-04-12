import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { API } from "../../utils/api";
import styles from "./index.module.less"
import { Carousel } from "antd";
import { Banner } from "../../types/GlobalTypes";
import WyCarousel from "./component/wyCarousel";
import { CarouselRef } from "antd/lib/carousel";

export default function Home() {

  const [banners, setBanners] = useState<Banner[]>([]);
  const carouselRef = useRef<CarouselRef | null>(null);

  useEffect(() => {
    getBanners();
  }, [])

  const getBanners = async () => {
    const res = await API.get('/banner');
    const { code, banners } = res.data;
    if (code === 200) {
      setBanners(banners)
    }
  }

  const prev = () => {
    carouselRef.current?.prev();
  }

  const next = () => {
    carouselRef.current?.next();
  }

  const renderCarouselItem = () => {
    return banners.map(item => {
      return (
        <div className={styles.carouselItem}>
          <a href={item.url} target="_blank" className={styles.bannerItem}>
            <img src={item.imageUrl} />
          </a>
        </div>
      )
    })
  }
  return (
    <div className={styles.home}>
      <WyCarousel prev={prev} next={next}>
        <Carousel autoplay effect="fade" ref={carouselRef}>
          {renderCarouselItem()}
        </Carousel>
      </WyCarousel>
    </div>
  )
}