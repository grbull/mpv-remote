import { MpvService } from './mpv';
import { Ws } from './websocket';

// rename sockets
function main(): void {
  console.log('Main()');
  const mpv = new MpvService();

  // eslint-disable-next-line init-declarations
  let ws: Ws | undefined;

  mpv.onConnect(() => {
    console.log('Mpv Connected, opening websocket');
    ws = new Ws(mpv);
  });

  mpv.onDisconnect(() => {
    console.log('Mpv Disconnected, closing websocket, retrying in 5s');
    if (ws) {
      ws.close();
    }

    setTimeout(() => {
      main();
    }, 5000);
  });

  mpv.onError(() => {
    console.log('Mpv error');
  });
}

main();
