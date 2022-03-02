import { IpcChannel } from '../../common/ipc/lib/IpcChannel';
import type { IpcReceiver, IpcSender } from '../../common/ipc/lib/IpcChannel';
import { ipcMain, ipcRenderer } from '../../spec/electron';

import { createChannels } from './createHardwareWalletIPCChannels';
import { handleHardwareWalletRequests } from './getHardwareWalletChannel';

class MockIpcChannel<Incoming, Outgoing> extends IpcChannel<
  Incoming,
  Outgoing
> {
  async send(
    message: Outgoing,
    sender: IpcSender = ipcRenderer,
    receiver: IpcReceiver = ipcRenderer
  ): Promise<Incoming> {
    return super.send(message, sender, receiver);
  }

  async request(
    message: Outgoing,
    sender: IpcSender = ipcMain,
    receiver: IpcReceiver = ipcMain
  ): Promise<Incoming> {
    return super.request(message, sender, receiver);
  }

  onReceive(
    handler: (message: Incoming) => Promise<Outgoing>,
    receiver: IpcReceiver = ipcMain
  ): void {
    super.onReceive(handler, receiver);
  }

  onRequest(
    handler: (arg0: Incoming) => Promise<Outgoing>,
    receiver: IpcReceiver = ipcMain
  ): void {
    super.onRequest(handler, receiver);
  }
}

describe('test', () => {
  it('the correct Url for TESTNET', async (done) => {
    const channels = createChannels(MockIpcChannel);
    handleHardwareWalletRequests(ipcRenderer, channels);

    const cardanoAppChannel = new MockIpcChannel('GET_CARDANO_ADA_APP_CHANNEL');
    const getExtendedPublicKeyChannel = new MockIpcChannel(
      'GET_EXTENDED_PUBLIC_KEY_CHANNEL'
    );

    const harwalletConnectionChannel = new MockIpcChannel(
      'GET_HARDWARE_WALLET_CONNECTION_CHANNEL'
    );
    harwalletConnectionChannel.onReceive(async (params) => {
      expect(params).toEqual({
        disconnected: expect.any(Boolean),
        deviceType: expect.any(String),
        deviceId: null,
        // Available only when Cardano APP opened
        deviceModel: expect.any(String),
        // e.g. nanoS
        deviceName: expect.any(String),
        // e.g. Test Name
        path: expect.any(String),
      });

      console.log('channel connected ======================', params);

      const connectCardanoApp = async () => {
        try {
          console.log('connecting--------------');
          const x = await cardanoAppChannel.request(
            { path: params.path },
            ipcRenderer,
            ipcRenderer
          );
          console.log('result ================', x);

          const extendedPublicKey = await getExtendedPublicKeyChannel.request(
            {
              path: "1852'/1815'/0'",
              // Shelley 1852 ADA 1815 indicator for account '0'
              isTrezor: false,
              devicePath: params.path,
            },
            ipcRenderer,
            ipcRenderer
          );

          console.log('extendedPublicKey', extendedPublicKey);
          done();
        } catch (err) {
          // setTimeout(connectCardanoApp, 500)
        }
      };

      connectCardanoApp();
    });

    const initLedgerConnectChannel = new MockIpcChannel(
      'GET_INIT_LEDGER_CONNECT_CHANNEL'
    );
    initLedgerConnectChannel.request({}, ipcRenderer, ipcMain);
  }, 10000000);
});

/*
\\?\hid#vid_2c97&pid_1011&mi_00#c&31cd3488&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}
\\?\hid#vid_2c97&pid_1015&mi_00#c&4c4d8ea&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}

*/
