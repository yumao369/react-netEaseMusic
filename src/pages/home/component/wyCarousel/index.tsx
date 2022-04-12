import React from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from "./index.module.less"

interface WyCarouselProps {
  children: React.ReactNode;
}

export default function WyCarousel(props: WyCarouselProps) {
  return (
    <div className={styles.carousel}>
      <div className={[styles.wrap, 'wrap'].join(" ")}>
        <Button className={[styles.arrow, styles.left].join(' ')} icon={<LeftOutlined />} ghost={true}></Button>
        {props.children}
        <Button className={[styles.arrow, styles.right].join(' ')} icon={<RightOutlined />}></Button>
      </div>
    </div>
  )
}