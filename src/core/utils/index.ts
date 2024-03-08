export const isXYInBounds = (
  dstX: number,
  dstY: number,
  boxX: number,
  boxY: number,
  boxWidth: number,
  boxHeight: number,
) => {
  const xIn = dstX >= boxX && dstX <= (boxX + boxWidth);
  const yIn = dstY >= boxY && dstY <= (boxY + boxHeight);
  return xIn && yIn;
};

export const calcRemainingTimeMs = (maxFps: number, elapsedTimeMs: number) => {
  return ((1000 / maxFps) ^ 0) - elapsedTimeMs;
};

export const delay = async (ms: number) => {
  return await new Promise((res) => {
    window.setTimeout(res, ms);
  });
}
