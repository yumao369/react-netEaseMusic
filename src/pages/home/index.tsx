import React from "react";
import { useEffect } from "react";
import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";
import styles from "./index.module.less"

export default function Home() {

  useEffect(() => {
    getBanners();
  })

  const getBanners = async () => {
    const res = await API.get('/banner');
    const data = res.data;
    console.log('bannerdata', data)
  }
  return <div className={styles.home}>home</div>
}