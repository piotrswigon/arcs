// This file initializes debug mode on the arc and contains message receiving
// and queing, so that opening DevTools without showing the Arcs panel is
// sufficient to start gathering information.

// TODO: Clean this up a little bit, it's spaghetti-ish.

(() => {
  const msgQueue = [];
  let windowForEvents = undefined;

  const sendMessage = function chooseConnection() {
    const remoteLabel = new URLSearchParams(window.location.search).get('remote');
    if (remoteLabel) {
      // what if we're in devtools and debugging a device.
      return connectViaWebRTC(remoteLabel);
    } else if (chrome.devtools && chrome.devtools.inspectedWindow.tabId) {
      // Use the extension API if we're in devtools and having a window to inspect.
      return connectViaExtensionApi();
    } else {
      // Otherwise use WebSocket. We may still be in devtools, but if we inspect node ....
      // fix comments.
      // In later case we might be in devtools but running
      // against NodeJS, but in such case there's no window to inspect.
      return connectViaWebSocket();
    }
  }();

  if (chrome && chrome.devtools) {
    // Add the panel for devtools, and flush the events to it once it's shown.
    chrome.devtools.panels.create('Arcs',
      null,
      'index.html',
      panel => panel.onShown.addListener(panelWindow => initializeWindow(panelWindow)));
  } else {
    // Fire on a regular window without queueing in the standalone scenario.
    initializeWindow(window);
  }

  function initializeWindow(w) {
    if (windowForEvents) return;
    w.document.addEventListener('command', e => sendMessage(e.detail));

    const setWindowForEventsAndEmptyMsgQueue = () => {
      windowForEvents = w;
      for (const msg of msgQueue) fire(msg);
      msgQueue.length = 0;
    };
    
    if (w._msgRaceConditionGuard) {
      // arcs-communication-channel.js loaded first (likely in extension mode),
      // let's let it know we are ready to receive events.
      w.document.dispatchEvent(new Event('arcs-communication-channel-ready'));
      setWindowForEventsAndEmptyMsgQueue();
    } else {
      w._msgRaceConditionGuard = 'devtools-script-loaded';
      // We loaded first (likely in standalone mode),
      // let's wait for arcs-communication-channel.js before sending it stuff.
      w.document.addEventListener('arcs-communication-channel-ready', e => {
        setWindowForEventsAndEmptyMsgQueue();
      });
    }
  }

  function connectViaExtensionApi() {
    const backgroundPageConnection = chrome.runtime.connect({name: 'arcs'});
    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
    backgroundPageConnection.onMessage.addListener(
      e => queueOrFire(e));
    return msg => {
      backgroundPageConnection.postMessage({
          name: 'command',
          tabId: chrome.devtools.inspectedWindow.tabId,
          msg
      });
    };
  }

  function connectViaWebSocket() {
    let ws;

    let retriesLeft = 10;
    (function createWebSocket() {
      ws = new WebSocket('ws://localhost:8787');
      ws.onopen = e => {
        console.log(`WebSocket connection established.`);
        ws.onmessage = msg => queueOrFire(JSON.parse(msg.data));
        ws.send('init');
      };
      ws.onerror = e => {
        console.log(`No WebSocket connection found, ${retriesLeft} retries left.`);
        if (retriesLeft--) setTimeout(createWebSocket, 500);
      };
    })();
    return msg => ws.send(JSON.stringify(msg));
  }

  function connectViaWebRTC(remoteLabel) {
    console.log('Waiting for WebShell to connect...');

    const hub = signalhub('arcs-demo', 'https://arcs-debug-switch.herokuapp.com/');//'https://signalhub-jccqtwhdwc.now.sh'); //'http://localhost:8999');//
    
    let exposedP = null;
    const p = new SimplePeer({initatior: false, trickle: false, objectMode: true});

    p.on('signal', (data) => {
      console.log('Sending', data);
      hub.broadcast(`${remoteLabel}:answer`, btoa(JSON.stringify(data)));
      // document.querySelector('#signaling').innerHTML = btoa(JSON.stringify(data));
      hub.close();
    });

    console.log(`Listening on ${remoteLabel}:offer`);
    hub.subscribe(`${remoteLabel}:offer`).on('data', (message) => {
      console.log('new message received:', message);

      const signalD = JSON.parse(atob(message));
      console.log('singalD', signalD);
      p.signal(signalD);
    });

    // TODO: Add some broadcast for 'READY', so that when devtools connects second,
    // shell can know to re-broadcast its signal.

    // const signalD = JSON.parse(atob(signal));
    // console.log('singalD', signalD);
    // p.signal(signalD);

    p.on('connect', () => {
      console.log('CONNECT');
      // document.querySelector('#signaling').innerHTML = '';
      p.send('init');
      exposedP = p;
    });
    p.on('data', msg => {
      let m = null;
      try {
        // console.log('SIZE:', msg.length / 262528.0);
        m = JSON.parse(msg);
      } catch (e) {
        // Issues with parsing messages sliced by WebRTC...
        debugger;
        return;
      }
      queueOrFire(m);
    });
    p.on('error', function(err) { console.log('error', err); });

    // const peer = new Peer(peerId);
    // let connection = null;

    // console.log('Waiting for WebShell to connect...');
    // peer.on('connection', conn => {
    //   console.log('New Connection!');

    //   conn.on('open', () => {
    //     connection = conn;
    //     conn.send('init');
    //   });
      
    //   conn.on('data', data => {
    //     queueOrFire(JSON.parse(data));
    //   });

    //   conn.on('error', x => console.log(x));
    // });
    
    return msg => {
      if (!exposedP) {
        console.log('too early for', msg);
      } else {
        exposedP.send(JSON.stringify(msg));
      }
    };
  }

  function queueOrFire(msg) {
    if (windowForEvents) {
      fire(msg);
    } else {
      msgQueue.push(msg);
    }
  }

  function fire(msg) {
    windowForEvents.document.dispatchEvent(new CustomEvent('raw-messages', {detail: msg}));
  }
})();
