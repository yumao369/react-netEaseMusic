import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { API } from "../../utils/api";
import styles from "./index.module.less";
import { Button, Carousel } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Banner,
  HotTag,
  Singer,
  SingerParams,
  Song,
  SongSheet,
} from "../../types/GlobalTypes";
import WyCarousel from "./component/wyCarousel";
import { CarouselRef } from "antd/lib/carousel";
import SingleSheet from "../../components/wyUi/singleSheet";
import MemberCard from "./component/memberCard";
import { useAppDispatch } from "../../redux/hooks";
import {
  setCurrentIndex,
  setPlayList,
  setSongList,
} from "../../redux/playerSlice";
import { playsheet } from "../../services/sheet.service";

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [hotTags, setHotTags] = useState<HotTag[]>([]);
  const [songSheetList, setSongSheetList] = useState<SongSheet[]>([]);
  const [settledSinger, setSettledSinger] = useState<Singer[]>([]);
  const carouselRef = useRef<CarouselRef | null>(null);

  const dispatch = useAppDispatch();

  const defaultSingerParams: SingerParams = {
    offset: 0,
    limit: 9,
    cat: "5001",
  };

  useEffect(() => {
    getBanners();
    getHotTags();
    getPersonalSheetList();
    getSettledSinger();
  }, []);

  const getBanners = async () => {
    const res = await API.get("/banner");
    const { code, banners } = res.data;
    if (code === 200) {
      setBanners(banners);
    }
  };

  const getHotTags = async () => {
    const res = await API.get("/playlist/hot");
    const { code, tags } = res.data;
    if (code === 200) {
      const hotTags = tags
        .sort((x: HotTag, y: HotTag) => x.position - y.position)
        .slice(0, 5);
      setHotTags(hotTags);
    }
  };

  const getPersonalSheetList = async () => {
    const res = await API.get("personalized");
    const { code, result } = res.data;
    if (code === 200) {
      const sheet: SongSheet[] = result.slice(0, 16);
      setSongSheetList(sheet);
    }
  };

  const getSettledSinger = async () => {
    const res = await API.get("artist/list", { params: defaultSingerParams });
    const { code, artists } = res.data;
    if (code === 200) {
      setSettledSinger(artists);
    }
  };

  const prev = () => {
    //@ts-ignore
    carouselRef.current.prev();
  };

  const next = () => {
    //@ts-ignore
    carouselRef.current.next();
  };

  const onPlaySheet = async (id: number) => {
    const list = await playsheet(id);
    console.log("list", list);
    dispatch(setSongList({ songList: list }));
    dispatch(setPlayList({ playList: list }));
    dispatch(setCurrentIndex({ currentIndex: 0 }));
  };

  const renderCarouselItem = () => {
    return banners.map((item, index) => {
      return (
        <div className={styles.carouselItem} key={index}>
          <a href={item.url} target="_blank" className={styles.bannerItem}>
            <img src={item.imageUrl} />
          </a>
        </div>
      );
    });
  };

  const renderHotTags = () => {
    return hotTags.map((item, index) => {
      return (
        <a className={styles.hotTagItem} key={index}>
          {item.name}
        </a>
      );
    });
  };

  const renderSongSheet = () => {
    return songSheetList.map((item, index) => {
      return (
        <SingleSheet
          sheet={item}
          onPlay={onPlaySheet}
          key={index}
        ></SingleSheet>
      );
    });
  };

  const renderSettledSinger = () => {
    return settledSinger.map((item, index) => {
      return (
        <div className={styles.card} key={index}>
          <div className={styles.pic}>
            <img src={item.picUrl} alt={item.name} />
          </div>
          <div className={styles.txt}>
            <b className={styles.ellipsis}>{item.name}</b>
            <span className={styles.albumSize}>专辑数：{item.albumSize}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.home}>
      <WyCarousel prev={prev} next={next}>
        <Carousel autoplay effect="fade" ref={carouselRef}>
          {renderCarouselItem()}
        </Carousel>
      </WyCarousel>

      <div className={styles.main}>
        <div className={[styles.wrap, "wrap"].join(" ")}>
          <div className={styles.left}>
            <div className={styles.sec}>
              <div className={styles.up}>
                <div className={styles.navs}>
                  <h2 className={styles.hotTagTitle}>
                    <i className={styles.symbol}></i>
                    <a className={styles.titleName}>热门推荐</a>
                  </h2>
                  <nav>{renderHotTags()}</nav>
                </div>
                <a>
                  更多
                  <Button
                    className={styles.more}
                    icon={<ArrowRightOutlined />}
                  ></Button>
                </a>
              </div>

              <div className={styles.down}>
                <div className={styles.downWrap}>{renderSongSheet()}</div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <MemberCard />
            <div className={styles.settledSinger}>
              <div className={styles.title}>
                <b className={styles.titTxt}>入驻歌手</b>
              </div>
              <div className={styles.list}>{renderSettledSinger()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
