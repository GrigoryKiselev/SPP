import { environment } from "../../environments/environment";
import * as io from 'socket.io-client';

export class SocketioService {
    socket;
    constructor() {   }
    setupSocketConnection() {
      this.socket = io(environment.SOCKET_ENDPOINT);
    }
  }