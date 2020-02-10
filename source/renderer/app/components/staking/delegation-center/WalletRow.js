// @flow
import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import { defineMessages, intlShape, FormattedMessage } from 'react-intl';
import SVGInline from 'react-svg-inline';
import isNil from 'lodash/isNil';
import Wallet from '../../../domains/Wallet';
import StakePool, { DelegationActions } from '../../../domains/StakePool';
import { getColorFromRange } from '../../../utils/colors';
import settingsIcon from '../../../assets/images/settings-ic.inline.svg';
import { DECIMAL_PLACES_IN_ADA } from '../../../config/numbersConfig';
import DropdownMenu from './DropdownMenu';
import styles from './WalletRow.scss';

import type { DelegationAction } from '../../../api/staking/types';
import type { WalletNextDelegationEpoch } from '../../../api/wallets/types';

const messages = defineMessages({
  walletAmount: {
    id: 'staking.delegationCenter.walletAmount',
    defaultMessage: '!!!{amount} ADA',
    description:
      'Amount of each wallet for the Delegation center body section.',
  },
  delegated: {
    id: 'staking.delegationCenter.delegated',
    defaultMessage: '!!!Delegated',
    description: 'Delegated label for the Delegation center body section.',
  },
  notDelegated: {
    id: 'staking.delegationCenter.notDelegated',
    defaultMessage: '!!!Undelegated',
    description: 'Undelegated label for the Delegation center body section.',
  },
  changeDelegation: {
    id: 'staking.delegationCenter.changeDelegation',
    defaultMessage: '!!!Change stake pool',
    description:
      'Change delegation label for the Delegation center body section.',
  },
  removeDelegation: {
    id: 'staking.delegationCenter.removeDelegation',
    defaultMessage: '!!!Undelegate',
    description:
      'Remove delegation label for the Delegation center body section.',
  },
  toStakePoolTickerPart1: {
    id: 'staking.delegationCenter.toStakePoolTickerPart1',
    defaultMessage: '!!!currently',
    description:
      'Delegated stake pool ticker for the Delegation center body section.',
  },
  toStakePoolTickerPart2: {
    id: 'staking.delegationCenter.toStakePoolTickerPart2',
    defaultMessage: '!!!from epoch',
    description:
      'Delegated stake pool ticker for the Delegation center body section.',
  },
  delegate: {
    id: 'staking.delegationCenter.delegate',
    defaultMessage: '!!!Delegate',
    description: 'Delegate label for the Delegation center body section.',
  },
  yourStake: {
    id: 'staking.delegationCenter.yourStake',
    defaultMessage: '!!!your stake',
    description: 'Your stake label for the Delegation center body section.',
  },
  unknownStakePoolLabel: {
    id: 'staking.delegationCenter.unknownStakePoolLabel',
    defaultMessage: '!!!unknown',
    description:
      'unknown stake pool label for the Delegation center body section.',
  },
});

type Props = {
  wallet: Wallet,
  delegatedStakePool?: ?StakePool,
  nextDelegatedStakePool?: ?StakePool,
  nextDelegatedStakePoolEpoch?: ?WalletNextDelegationEpoch,
  numberOfStakePools: number,
  onDelegate: Function,
  onMenuItemClick: Function,
};

@observer
export default class WalletRow extends Component<Props> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  onDelegate = () => {
    const { wallet, onDelegate } = this.props;
    onDelegate(wallet.id);
  };

  onMenuItemClick = ({ value }: { value: DelegationAction }) => {
    const { wallet } = this.props;
    this.props.onMenuItemClick(value, wallet.id);
  };

  render() {
    const { intl } = this.context;
    const {
      wallet: { name, amount, delegatedStakePoolId, nextDelegationStakePoolId },
      delegatedStakePool,
      nextDelegatedStakePool,
      nextDelegatedStakePoolEpoch,
      numberOfStakePools,
    } = this.props;

    const nextEpochNumber = get(
      nextDelegatedStakePoolEpoch,
      'epoch_number',
      null
    );

    const { ranking } = delegatedStakePool || {};
    const nextRanking = get(nextDelegatedStakePool, 'ranking', {});

    const color =
      delegatedStakePoolId && delegatedStakePool && !isNil(ranking)
        ? getColorFromRange(ranking, numberOfStakePools)
        : null;

    const nextColor =
      nextDelegationStakePoolId && nextDelegatedStakePool && !isNil(nextRanking)
        ? getColorFromRange(nextRanking, numberOfStakePools)
        : null;

    const delegated = intl.formatMessage(messages.delegated);
    const notDelegated = intl.formatMessage(messages.notDelegated);
    const changeDelegation = intl.formatMessage(messages.changeDelegation);
    const removeDelegation = intl.formatMessage(messages.removeDelegation);
    const delegate = intl.formatMessage(messages.delegate);
    const yourStake = intl.formatMessage(messages.yourStake);
    const delegatedStakePoolTicker = delegatedStakePool
      ? `[${delegatedStakePool.ticker}]`
      : intl.formatMessage(messages.unknownStakePoolLabel);
    const nextDelegatedStakePoolTicker = nextDelegatedStakePool
      ? `[${nextDelegatedStakePool.ticker}]`
      : intl.formatMessage(messages.unknownStakePoolLabel);

    const delegatedWalletActionOptions = [
      {
        label: changeDelegation,
        value: DelegationActions.CHANGE_DELEGATION,
        className: styles.normalOption,
      },
      {
        label: removeDelegation,
        value: DelegationActions.REMOVE_DELEGATION,
        className: styles.removeOption,
      },
    ];

    return (
      <div className={styles.component}>
        <div className={styles.left}>
          <div className={styles.title}>{name}</div>
          <div className={styles.description}>
            <FormattedMessage
              {...messages.walletAmount}
              values={{
                amount: amount.toFormat(DECIMAL_PLACES_IN_ADA),
              }}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div>
            <div className={styles.status}>
              <span>{delegatedStakePoolId ? delegated : notDelegated}</span>
              {delegatedStakePoolId && (
                <DropdownMenu
                  label={
                    <SVGInline svg={settingsIcon} className={styles.gearIcon} />
                  }
                  menuItems={delegatedWalletActionOptions}
                  onMenuItemClick={this.onMenuItemClick}
                />
              )}
            </div>
            <div className={styles.action}>
              {delegatedStakePoolId ? (
                <Fragment>
                  {intl.formatMessage(messages.toStakePoolTickerPart1)}
                  {': '}
                  <span
                    className={!delegatedStakePool ? styles.unknown : null}
                    style={{ color }}
                  >
                    {delegatedStakePoolTicker}
                  </span>
                  {nextDelegatedStakePoolEpoch && (
                    <Fragment>
                      {', '}
                      {intl.formatMessage(messages.toStakePoolTickerPart2)}{' '}
                      <span
                        className={
                          !nextDelegatedStakePool ? styles.unknown : null
                        }
                      >
                        {nextEpochNumber}
                      </span>
                      {': '}
                      {nextDelegationStakePoolId ? (
                        <span
                          className={
                            !nextDelegatedStakePool ? styles.unknown : null
                          }
                          style={{ color: nextColor }}
                        >
                          {nextDelegatedStakePoolTicker}
                        </span>
                      ) : (
                        <span
                          className={
                            !nextDelegatedStakePool ? styles.unknown : null
                          }
                        >
                          {notDelegated}
                        </span>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              ) : (
                <span>
                  <span
                    className={styles.actionLink}
                    role="presentation"
                    onClick={this.onDelegate}
                  >
                    {delegate}
                  </span>
                  {` ${yourStake}`}
                </span>
              )}
            </div>
          </div>
          <div>
            <div
              className={styles.stakePoolRankingIndicator}
              style={{ background: color }}
            />
          </div>
        </div>
      </div>
    );
  }
}
