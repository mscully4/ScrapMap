const K_WIDTH = 40;
const K_HEIGHT = 40;
const K_SIZE = 10;

const MarkerStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  border: '5px solid #f44336',
  borderRadius: K_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer',
};

const MarkerStyleHover = {
    ...MarkerStyle,
    border: '5px solid #3f51b5',
    color: '#f44336',
};

const BoxStyle = {
    visibility: 'hidden',
}

const BoxStyleHover = {
    visibility: 'visible',
}

export {K_SIZE, MarkerStyle, MarkerStyleHover, BoxStyle, BoxStyleHover};
