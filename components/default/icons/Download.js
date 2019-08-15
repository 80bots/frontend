import React from 'react';
import PropTypes from 'prop-types';

const Download = ({ color, width = 20, height = 20 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 26 26" >
      <g fill={color}>
        <path d="m25,17h-2c-0.6,0-1,0.4-1,1v2.5c0,0.3-0.2,0.5-0.5,0.5h-17c-0.3,0-0.5-0.2-0.5-0.5v-2.5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v6c0,0.6 0.4,1 1,1h24c0.6,0 1-0.4 1-1v-6c0-0.6-0.4-1-1-1z"/>
        <path d="m12.3,16.7c0.2,0.2 0.5,0.3 0.7,0.3s0.5-0.1 0.7-0.3l6-6c0.2-0.2 0.3-0.4 0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4c-0.2-0.2-0.4-0.3-0.7-0.3-0.3,0-0.5,0.1-0.7,0.3l-1,1c-0.3,0.3-0.9,0.1-0.9-0.4v-6.5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v6.6c0,0.4-0.5,0.7-0.9,0.4l-1-1c-0.2-0.2-0.4-0.3-0.7-0.3-0.3,0-0.5,0.1-0.7,0.3l-1.4,1.4c-0.2,0.2-0.3,0.4-0.3,0.7s0.1,0.5 0.3,0.7l6,5.9z"/>
      </g>
    </svg>
  );
};

Download.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Download;
