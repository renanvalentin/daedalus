// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { action } from '@storybook/addon-actions';
import { withKnobs, select, number, boolean } from '@storybook/addon-knobs';
import { withState } from '@dump247/storybook-state';
import StoryDecorator from '../_support/StoryDecorator';
import DappTransactionRequest from '../../../source/renderer/app/components/dapp/DappTransactionRequest';
import { WALLETS_V2 } from '../_support/StoryProvider';
import { generateAssetToken } from '../_support/utils';

const allAssets = [
  generateAssetToken(
    '65ac82542b0ca20391caaf66a4d4d7897d281f9c136cd3513136945b',
    '',
    'token1rjklcrnsdzqp65wjgrg55sy9723kw09m5z2345',
    200
  ),
  generateAssetToken(
    '65bc72542b0ca20391caaf66a4d4e7897d282f9c136cd3513136945c',
    '',
    'token1rjklcrnsdzqp65wjgrg55sy9723kw09m5z4567',
    50,
    {
      name: 'MakerDAO',
      ticker: 'DAI',
      description: 'Test description',
      unit: {
        name: 'DAI',
        decimals: 6,
      },
      url: 'http://example.com',
      logo: '',
    }
  ),
];

storiesOf('dApps|TransactionRequest', module)
  .addDecorator((story) => <StoryDecorator>{story()}</StoryDecorator>)
  .addDecorator(withKnobs)

  // ====== Stories ======

  .add(
    'Request',
    withState({ selectedWallet: null }, (store) => {
      const { selectedWallet } = store.state;
      const wallets = boolean('Has wallets?', true)
        ? WALLETS_V2.map((wallet, index) => {
            let assetsList = allAssets;
            let { name } = wallet;
            if (index === 0) {
              assetsList = assetsList.slice(0, 1);
              name = `${wallet.name} - Missing token`;
            }
            const assets = {
              total: assetsList,
              available: assetsList,
            };
            return {
              ...wallet,
              assets,
              name,
            };
          })
        : [];
      return (
        <DappTransactionRequest
          address="addr1zCqrhsvWEPg886YEtnjN3vLXhFBHsc6j7oZ3pXzuwgZquGUT4fuztk43fHZnBhQKMnojvyxhFBHsc6j7oZ3pXzuwgZq"
          onAddWallet={action('onAddWallet')}
          onClose={action('onClose')}
          onSubmit={action('onSubmit')}
          onSelectWallet={(walletId) => {
            const newSelectedWallet = wallets.find(({ id }) => id === walletId);
            store.set({ selectedWallet: newSelectedWallet });
          }}
          selectedWallet={selectedWallet}
          triggedFrom={select(
            'triggedFrom',
            {
              safari: 'safari',
              chrome: 'chrome',
            },
            'safari'
          )}
          wallets={wallets}
          assets={allAssets}
          feesAmount={new BigNumber(number('feesAmount', 100))}
          transactionFee={new BigNumber(1)}
          additionalData={{
            appName: 'daedalus',
            action: 'convert',
            state: 'true',
          }}
          metadata={{
            id: 1569325866799,
            title: {
              'en-US': 'Incident 1 in English',
              'ja-JP': 'Incident 1 in Japanese',
            },
            content: {
              'en-US':
                '# h1 English incident content 1\nUt consequat semper viverra nam libero justo laoreet sit. Sagittis vitae et leo duis. Eget nullam non nisi est sit amet facilisis magna etiam. Nisl tincidunt eget nullam non nisi est sit amet facilisis. Auctor neque vitae tempus quam pellentesque. Vel facilisis volutpat est velit egestas dui id ornare arcu.\n\n## h2 Heading\n\nConsequat mauris nunc congue nisi vitae suscipit. Dictum non consectetur a erat nam. Laoreet non curabitur gravida arcu ac tortor dignissim. Eu augue ut lectus arcu bibendum at. Facilisis gravida neque convallis a cras semper. Ut consequat semper viverra nam libero justo laoreet sit. Sagittis vitae et leo duis. Eget nullam non nisi est sit amet facilisis magna etiam. Nisl tincidunt eget nullam non nisi est sit amet facilisis. Auctor neque vitae tempus quam pellentesque. Vel facilisis volutpat est velit egestas dui id ornare arcu. Nam aliquam sem et tortor consequat id porta nibh venenatis.\n\nViverra nam libero justo laoreet sit amet. Pharetra diam sit amet nisl. Quam viverra orci sagittis eu. Rhoncus dolor purus non enim. Posuere urna nec tincidunt praesent semper feugiat. Suspendisse in est ante in nibh mauris cursus. Sit amet consectetur adipiscing elit duis. Tortor id aliquet lectus proin nibh nisl condimentum id. At in tellus integer feugiat scelerisque. Maecenas sed enim ut sem viverra aliquet. Pellentesque pulvinar pellentesque habitant morbi. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Praesent tristique magna sit amet purus gravida. Diam volutpat commodo sed egestas egestas. Ut placerat orci nulla pellentesque dignissim enim. Ultrices in iaculis nunc sed augue lacus viverra. Etiam sit amet nisl purus.\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ "title text!")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O',
              'ja-JP':
                '# h1 Japanese incident content 1\nUt consequat semper viverra nam libero justo laoreet sit. Sagittis vitae et leo duis. Eget nullam non nisi est sit amet facilisis magna etiam. Nisl tincidunt eget nullam non nisi est sit amet facilisis. Auctor neque vitae tempus quam pellentesque. Vel facilisis volutpat est velit egestas dui id ornare arcu.\n\n## h2 Heading\n\nConsequat mauris nunc congue nisi vitae suscipit. Dictum non consectetur a erat nam. Laoreet non curabitur gravida arcu ac tortor dignissim. Eu augue ut lectus arcu bibendum at. Facilisis gravida neque convallis a cras semper. Ut consequat semper viverra nam libero justo laoreet sit. Sagittis vitae et leo duis. Eget nullam non nisi est sit amet facilisis magna etiam. Nisl tincidunt eget nullam non nisi est sit amet facilisis. Auctor neque vitae tempus quam pellentesque. Vel facilisis volutpat est velit egestas dui id ornare arcu. Nam aliquam sem et tortor consequat id porta nibh venenatis.\n\nViverra nam libero justo laoreet sit amet. Pharetra diam sit amet nisl. Quam viverra orci sagittis eu. Rhoncus dolor purus non enim. Posuere urna nec tincidunt praesent semper feugiat. Suspendisse in est ante in nibh mauris cursus. Sit amet consectetur adipiscing elit duis. Tortor id aliquet lectus proin nibh nisl condimentum id. At in tellus integer feugiat scelerisque. Maecenas sed enim ut sem viverra aliquet. Pellentesque pulvinar pellentesque habitant morbi. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Praesent tristique magna sit amet purus gravida. Diam volutpat commodo sed egestas egestas. Ut placerat orci nulla pellentesque dignissim enim. Ultrices in iaculis nunc sed augue lacus viverra. Etiam sit amet nisl purus.\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ "title text!")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O',
            },
            target: {
              daedalusVersion: '>=2.0.0-ITN1',
              platforms: ['darwin', 'win32', 'linux'],
            },
            action: {
              label: {
                'en-US': 'Visit en-US',
                'ja-JP': 'Visit ja-JP',
              },
              url: {
                'en-US': 'https://iohk.zendesk.com/hc/en-us/articles/',
                'ja-JP': 'https://iohk.zendesk.com/hc/ja/articles/',
              },
            },
            publishedAt: {
              'en-US': 1569325866799,
              'ja-JP': 1569325866799,
            },
            type: 'incident',
          }}
        />
      );
    })
  );
