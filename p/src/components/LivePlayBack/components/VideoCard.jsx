import React from "react";
import { Link } from "react-router-dom";
import ClassNames from "classnames";
import RenderJudge from "@/components/RenderJudge";
import NowPlayingIcon from "@/components/NowPlayingIcon";
import Iconfont from "@/components/Iconfont";
import Image from "@/components/Image";
import PlayIcon from "@/assets/images/VideoCard/play_icon.png";
import DefaultImage from "@/assets/images/default_image.jpg";
import CloseImage from "@/assets/images/close.png";
import DeleteImage from "@/assets/images/delete.png";
import UserDefaultImage from "@/assets/images/user_default_image.png";

import indexStyle from "../style.scss";
import styles from "@/components/VideoCard/style.scss";

const VideoCard = ({
  label,
  image,
  defaultImage,
  type,
  playing,
  url,
  target,
  headImage,
  userName,
  heat,
  tag,
  className,
  style,
  showIcon,
  isHot,
  right,
}) => (
  <Link
    to={url}
    target={target}
    className={ClassNames(styles.container, className)}
    style={style}
    onClick={(e) => {
      showIcon ? e.preventDefault() : "";
    }}
  >
    <div className={styles.imageWrapper}>
      <Image
        className={styles.image}
        src={image}
        defaultImage={defaultImage}
        alt={label}
      />
      <RenderJudge
        value={!showIcon}
        active={
          <div className={styles.imageHover}>
            <img className={styles.playImage} src={PlayIcon} alt={label} />
          </div>
        }
      />
      <RenderJudge
        value={playing}
        active={<NowPlayingIcon className={styles.playStatus} />}
      />
      <RenderJudge
        value={showIcon}
        active={
          <>
            <div
              className={indexStyle.leftIcon}
              style={{ right: right }}
              onClick={() => {
                console.log("隐藏");
              }}
            >
              <Image src={CloseImage} className={indexStyle.close_eyes} />
              <span>隐藏</span>
            </div>
            <div
              className={indexStyle.rightIcon}
              onClick={() => {
                console.log("删除");
              }}
            >
              <Image src={DeleteImage} className={indexStyle.deleteIcon} />{" "}
              <span>删除</span>
            </div>
          </>
        }
      />
    </div>
    <div className={styles.detail}>
      <div className={styles.title}>
        <RenderJudge
          value={type}
          active={<div className={styles.type}>{type}</div>}
        />
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.meta}>
        <Image
          className={styles.userImage}
          src={headImage}
          defaultImage={UserDefaultImage}
          alt={userName}
        />
        <div className={styles.userName}>{userName}</div>
        <RenderJudge
          value={isHot}
          active={
            <>
              <Iconfont name="huo" className={styles.heatIcon} />
              <div className={styles.heatLabel}>{heat}</div>
            </>
          }
        />

        <RenderJudge
          value={tag}
          active={<div className={styles.tagLabel}>{tag}</div>}
        />
      </div>
    </div>
  </Link>
);

VideoCard.defaultProps = {
  playing: false,
  target: "_self",
  defaultImage: DefaultImage,
};

VideoCard.tag = {
  1: "足球",
  2: "篮球",
  3: "电竞",
  100: "娱乐",
};

export default VideoCard;
