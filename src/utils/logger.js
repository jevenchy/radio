import { label } from '../../config/config.js';

const now = () => new Date().toISOString().replace('T', ' ').split('.')[0];

export const logStartup = (msg) => {
  console.log(`${now()} INFO     ${label} - ${msg}`);
};

export const log = (type, client, data = {}) => {
  switch (type) {
    case 'now_playing':
      console.log(`${now()} LOG      ${label} - Now Playing: ${data.name}`);
      break;
    default:
      console.log(`${now()} LOG      ${label} - ${type}`);
      break;
  }
};
