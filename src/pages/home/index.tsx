import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { API } from "../../utils/api";
import styles from "./index.module.less"
import { Button, Carousel } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import { Banner, HotTag, SongSheet } from "../../types/GlobalTypes";
import WyCarousel from "./component/wyCarousel";
import { CarouselRef } from "antd/lib/carousel";
import SingleSheet from "../../components/wyUi/singleSheet";

export default function Home() {

  const [banners, setBanners] = useState<Banner[]>([]);
  const [hotTags, setHotTags] = useState<HotTag[]>([]);
  const [songSheetList, setSongSheetList] = useState<SongSheet[]>([]);
  const carouselRef = useRef<CarouselRef | null>(null);

  useEffect(() => {
    getBanners();
    getHotTags();
    getPersonalSheetList();
  }, [])

  const getBanners = async () => {
    const res = await API.get('/banner');
    const { code, banners } = res.data;
    if (code === 200) {
      setBanners(banners)
    }
  }

  const getHotTags = async () => {
    const res = await API.get('/playlist/hot');
    const { code, tags } = res.data;
    if (code === 200) {
      const hotTags = tags.sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5)
      setHotTags(hotTags)
    }
  }

  const getPersonalSheetList = async () => {
    const res = await API.get('personalized');
    const { code, result } = res.data;
    if (code === 200) {
      const sheet: SongSheet[] = result.slice(0, 16)
      setSongSheetList(sheet)
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

  const renderHotTags = () => {
    return hotTags.map(item => {
      return <a className={styles.hotTagItem}>{item.name}</a>
    })
  }

  const renderSongSheet = () => {
    return songSheetList.map(item => {
      return <SingleSheet sheet={item} ></SingleSheet>
    })
  }

  return (
    <div className={styles.home}>
      <WyCarousel prev={prev} next={next}>
        <Carousel autoplay effect="fade" ref={carouselRef}>
          {renderCarouselItem()}
        </Carousel>
      </WyCarousel>

      <div className={styles.main}>
        <div className={[styles.wrap, 'wrap'].join(" ")}>
          <div className={styles.left}>
            <div className={styles.sec}>
              <div className={styles.up}>
                <div className={styles.navs}>
                  <h2 className={styles.hotTagTitle}>
                    <i className={styles.symbol}></i>
                    <a className={styles.titleName}>热门推荐</a>
                  </h2>
                  <nav>
                    {renderHotTags()}
                  </nav>
                </div>
                <a>
                  更多
                  <Button className={styles.more} icon={<ArrowRightOutlined />} ></Button>
                </a>
              </div>

              <div className={styles.down}>
                <div className={styles.downWrap}>
                  {renderSongSheet()}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.right}>right</div>
        </div>
      </div>
    </div>
  )
}