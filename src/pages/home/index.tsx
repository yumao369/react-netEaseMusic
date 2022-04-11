import React, { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";
import styles from "./index.module.less"
import { Carousel } from "antd";
import { Banner } from "../../types/GlobalTypes";

export default function Home() {

  const [banners, setBanners] = useState<Banner[]>([])

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
      <div className={[styles.carousel, styles.wrap].join(' ')}>
        <Carousel autoplay effect="fade">
          {renderCarouselItem()}
        </Carousel>
      </div>
    </div>
  )
}