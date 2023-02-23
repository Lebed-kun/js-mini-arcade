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
