// @flow
import React from 'react';
import classnames from 'classnames';
import { intlShape, injectIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import { observer } from 'mobx-react';
import styles from './AssetsTransactionConfirmation.scss';
import AssetTransactionConfirmation from './AssetTransactionConfirmation';
import Wallet from '../../domains/Wallet';
import globalMessages from '../../i18n/global-messages';
import { formattedWalletAmount } from '../../utils/formatters';
import type { AssetToken } from '../../api/assets/types';
import { isTokenMissingInWallet } from '../../utils/assets';

type Props = {
  assets: Array<AssetToken>,
  className?: string,
  feesAmount?: BigNumber,
  feesUnit?: string,
  intl: intlShape.isRequired,
  wallet?: ?Wallet,
};

const AssetsTransactionConfirmation = observer((props: Props) => {
  const {
    assets,
    className,
    feesAmount,
    intl,
    feesUnit = intl.formatMessage(globalMessages.unitAda),
    wallet,
  } = props;
  const componentStyles = classnames([styles.component, className]);
  return (
    <div className={componentStyles}>
      <div className={styles.fees}>
        <p>{feesUnit}</p>
        <div className={styles.amount}>
          {formattedWalletAmount(feesAmount, false)}
        </div>
      </div>
      {assets.map((asset, index) => (
        <AssetTransactionConfirmation
          key={asset.uniqueId}
          index={index}
          isHardwareWallet={false}
          asset={asset}
          tokenIsMissing={isTokenMissingInWallet(wallet, asset)}
        />
      ))}
    </div>
  );
});

export default injectIntl(AssetsTransactionConfirmation);
