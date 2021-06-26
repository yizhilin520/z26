import React from "react";

import LivePlayBack from "@/components/LivePlayBack";

import styles from "../style/PlayBackPage.scss";

const style = {
  boxShadow: "none",
  margin: "0",
};

const PlaybackPage = () => {
  return (
    <div>
      <LivePlayBack style={style} showIcon={true} isHot={false} />
    </div>
  );
};

export default PlaybackPage;
