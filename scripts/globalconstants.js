const BOX_SIZE = 32;
const PLAY_AREA_SIZE = {
  width: BOX_SIZE * 30, //960
  height: BOX_SIZE * 20 //640
}
const TOP_MARGIN_BOXES = 2;
const RIGHT_MARGIN_BOXES = 10;
const TOP_MARGIN = BOX_SIZE * TOP_MARGIN_BOXES;
const RIGHT_MARGIN = BOX_SIZE * RIGHT_MARGIN_BOXES;
const PLAYGROUND_DIMENSIONS = {
    minBoxX: 1,
    maxBoxX: (PLAY_AREA_SIZE.width / BOX_SIZE) - RIGHT_MARGIN_BOXES - 2,
    minBoxY: TOP_MARGIN_BOXES + 1,
    maxBoxY: (PLAY_AREA_SIZE.height / BOX_SIZE) - 2,
    minX: BOX_SIZE,
    maxX: PLAY_AREA_SIZE.width - RIGHT_MARGIN,
    minY: TOP_MARGIN + BOX_SIZE,
    maxY: PLAY_AREA_SIZE.height - BOX_SIZE
  }
  
  const DIRECTION = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4
  }