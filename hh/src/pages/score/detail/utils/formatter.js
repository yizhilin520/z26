/**
 * 篮球赛况 teamStatics 字段格式化
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/19
 */
export const basketballTeamStaticsFormat = (data) => {
  const [,
    homeTeamThreePointerPercentage, // 主队三分命中率
    awayTeamThreePointerPercentage, // 客队三分命中率
    homeTeamShotPercentage, // 主队投篮命中率
    awayTeamShotPercentage, // 客队投篮命中率,
    homeTeamPenaltyPercentage, // 主队罚球命中率
    awayTeamPenaltyPercentage, // 客队罚球命中率
    homeTeamCurrentNodeFoul, // 主队本节犯规数
    awayTeamCurrentNodeFoul, // 客队本节犯规数
    homeTeamRemainingTimeout, // 主队剩余暂停数
    awayTeamRemainingTimeout, // 客队剩余暂停数
    homeTeamThreePointerScore, // 主队三分球得分
    awayTeamThreePointerScore, // 客队三分球得分
    homeTeamTwoPointerScore, // 主队两分球得分
    awayTeamTwoPointerScore, // 客队两分球得分
    homeTeamFreeThrowScore, // 主队罚球得分
    awayTeamFreeThrowScore// 客队罚球得分
  ] = data || [];

  const getProgress = (mainVal, guestVal) => {
    const total = mainVal + guestVal;
    const color = '#ffca43';
    if ((!mainVal && !guestVal) || mainVal === guestVal) {
      return {
        value: 50,
        color,
        reverse: true,
        align: 'center'
      };
    }

    if (guestVal > mainVal) {
      return {
        value: ((guestVal / total) || 0) * 100,
        color: '#ff6443',
        reverse: false,
        align: 'right'
      };
    }

    return {
      value: ((mainVal / total) || 0) * 100,
      color,
      reverse: true,
      align: 'left'
    };
  };
  const getProgressLabel = (val, unit) => `${((val || 0) * 100).toFixed()}${unit || ''}`;

  const threePointerProgress = getProgress(homeTeamThreePointerPercentage, awayTeamThreePointerPercentage);
  const shotProgress = getProgress(homeTeamShotPercentage, awayTeamShotPercentage);
  const penaltyProgress = getProgress(homeTeamPenaltyPercentage, awayTeamPenaltyPercentage);
  const threePointerScoreProgress = getProgress(homeTeamThreePointerScore, awayTeamThreePointerScore);
  const twoPointerScoreProgress = getProgress(homeTeamTwoPointerScore, awayTeamTwoPointerScore);
  const freeThrowScoreProgress = getProgress(homeTeamFreeThrowScore, awayTeamFreeThrowScore);

  return {
    // 三分命中率
    threePointerPercentage: {
      homeLabel: getProgressLabel(homeTeamThreePointerPercentage, '%'),
      awayLabel: getProgressLabel(awayTeamThreePointerPercentage, '%'),
      percentage: threePointerProgress.value,
      color: threePointerProgress.color,
      reverse: threePointerProgress.reverse
    },
    // 投篮命中率
    shotPercentage: {
      homeLabel: getProgressLabel(homeTeamShotPercentage, '%'),
      awayLabel: getProgressLabel(awayTeamShotPercentage, '%'),
      percentage: shotProgress.value,
      color: shotProgress.color,
      reverse: shotProgress.reverse
    },
    // 罚球命中率
    penaltyPercentage: {
      homeLabel: getProgressLabel(homeTeamPenaltyPercentage, '%'),
      awayLabel: getProgressLabel(awayTeamPenaltyPercentage, '%'),
      percentage: penaltyProgress.value,
      color: penaltyProgress.color,
      reverse: penaltyProgress.reverse
    },
    // 犯规数
    fouls: {
      homeLabel: homeTeamCurrentNodeFoul,
      awayLabel: awayTeamCurrentNodeFoul
    },
    // 暂停数
    surplusPauseNumber: {
      homeLabel: homeTeamRemainingTimeout,
      awayLabel: awayTeamRemainingTimeout
    },
    // 三分球得分
    threePointerScore: {
      homeLabel: homeTeamThreePointerScore,
      awayLabel: awayTeamThreePointerScore,
      percentage: `${threePointerScoreProgress.value}%`,
      align: threePointerScoreProgress.align
    },
    // 两分球得分
    twoPointerScore: {
      homeLabel: homeTeamTwoPointerScore,
      awayLabel: awayTeamTwoPointerScore,
      percentage: `${twoPointerScoreProgress.value}%`,
      align: twoPointerScoreProgress.align
    },
    // 罚球得分
    freeThrowScore: {
      homeLabel: homeTeamFreeThrowScore,
      awayLabel: awayTeamFreeThrowScore,
      percentage: `${freeThrowScoreProgress.value}%`,
      align: freeThrowScoreProgress.align
    }
  };
};
