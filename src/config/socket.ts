import {io} from 'socket.io-client'
import { websocketAPI } from './urls';
 
export const socket = io(websocketAPI ? websocketAPI:"localhost:3000", { transports: ["websocket"], autoConnect: false });