export const formatTime = (_time) => {
  const time = _time / 1000;
  const _min = (((time || 0) - (time % 60)) / 60).toFixed(0);
  const sec =
    time % 60 >= 10 ? Math.round(time % 60) : `0${Math.round(time % 60)}`;
  return `${_min >= 10 ? _min : `0${_min}`}:${sec}`;
};
