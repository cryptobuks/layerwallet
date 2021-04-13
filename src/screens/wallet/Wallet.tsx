// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// Copyright 2021 Commonwealth Labs, Inc.
// This file is part of Layer Wallet.

// Layer Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Layer Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Layer Wallet. If not, see <http://www.gnu.org/licenses/>.

import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BN from 'bn.js';

import { NetworkCard } from './NetworkCard';

import { components, fontStyles } from 'styles/index';
import { NetworksContext } from 'stores/NetworkContext';
import { AccountsContext } from 'stores/AccountsContext';
import testIDs from 'e2e/testIDs';
import {
	isEthereumNetworkParams,
	isSubstrateNetworkParams
} from 'types/networkTypes';
import { NavigationProps } from 'types/props';
import { getAddressWithPath } from 'utils/walletsUtils';
import { navigateToReceiveBalance } from 'utils/navigationHelpers';
import Button from 'components/Button';
import Onboarding from 'components/Onboarding';
import NavigationTab from 'components/NavigationTab';
import { ApiContext } from 'stores/ApiContext';
import { RegistriesContext } from 'stores/RegistriesContext';

interface State {
	freeBalance: string;
}

const EMPTY_STATE: State = {
	freeBalance: 'Loading...'
};

function Wallet({ navigation }: NavigationProps<'Wallet'>): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const { wallets, currentWallet, loaded } = accountsStore.state;
	const networkContextState = useContext(NetworksContext);
	const [balance, setBalance] = useState(EMPTY_STATE);
	const { allNetworks } = networkContextState;

	// catch android back button and prevent exiting the app
	useFocusEffect(
		React.useCallback((): any => {
			const handleBackButton = (): boolean => true;
			const backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				handleBackButton
			);
			return (): void => backHandler.remove();
		}, [])
	);

	const networkKey = currentWallet?.account?.networkKey;
	const networkParams = networkKey ? allNetworks.get(networkKey)! : undefined;

	// initialize the API using the first network the user has, if they have any
	const { initApi, state } = useContext(ApiContext);
	const { networks } = networkContextState;
	const { getTypeRegistry } = useContext(RegistriesContext);

	// initialize API (TODO: move out of wallet!)
	useEffect((): void => {
		// TODO: make this refresh less often!
		if (!networkKey || !networkParams) return;
		if (!isSubstrateNetworkParams(networkParams) || !networkParams.url) return;
		const registryData = getTypeRegistry(networks, networkKey);
		if (!registryData) return;
		const [registry, metadata] = registryData;
		initApi(networkKey, networkParams.url, registry, metadata);
	}, [networkKey, networkParams, getTypeRegistry, initApi, networks]);

	// initialize balances
	useEffect((): void => {
		if (state.isApiReady) {
			if (!networkKey || !networkParams) return;
			if (!isSubstrateNetworkParams(networkParams) || !networkParams.url)
				return;
			console.log(`Use API: ${networkKey}`);
			const path = `//${networkParams.pathId}`;
			const address = getAddressWithPath(path, currentWallet);
			const decimals = networkParams.decimals;
			if (state.api?.derive?.balances) {
				console.log(`FETCHING BALANCES: ${address}`);
				state.api.derive.balances
					.all(address)
					.then(fetchedBalance => {
						const base = new BN(10).pow(new BN(decimals));
						const div = fetchedBalance.availableBalance.div(base);
						const mod = fetchedBalance.availableBalance.mod(base);
						const nDisplayDecimals = 3;
						setBalance({
							freeBalance:
								div + '.' + mod.toString(10).slice(0, nDisplayDecimals)
						});
					})
					.catch(error => {
						console.log('FETCHING BALANCE ERROR', error);
					});
			}
		}
	}, [state, currentWallet, networkKey, networkParams]);

	if (!loaded) return <View />;
	if (wallets.length === 0) return <Onboarding />;

	if (currentWallet === null)
		return (
			<>
				<View style={components.pageWide}>
					<Text style={fontStyles.quote}>Select a wallet to get started.</Text>
				</View>
				<NavigationTab />
			</>
		);

	const onNetworkChosen = (): void => {
		if (!networkKey || !networkParams) return;
		if (isSubstrateNetworkParams(networkParams)) {
			// navigate to substrate account
			const { pathId } = networkParams;
			const fullPath = `//${pathId}`;
			navigateToReceiveBalance(navigation, networkKey, fullPath);
		} else {
			// navigate to ethereum account
			navigateToReceiveBalance(navigation, networkKey, networkKey);
		}
	};

	const renderNetwork = (): ReactElement => {
		if (!networkKey || !networkParams) return <View />; // should never reach
		const networkIndexSuffix = isEthereumNetworkParams(networkParams)
			? networkParams.ethereumChainId
			: networkParams.pathId;
		return (
			<NetworkCard
				key={networkKey}
				testID={testIDs.Wallet.networkButton + networkIndexSuffix}
				networkKey={networkKey}
				onPress={(): void => onNetworkChosen()}
				balance={balance.freeBalance}
				title={networkParams.title}
			/>
		);
	};

	return (
		<>
			<View style={components.pageWide}>
				{networkKey && networkParams && renderNetwork()}
				<View style={{ marginBottom: 12, paddingHorizontal: 15 }}>
					<Button
						title="Switch network"
						onPress={(): void => navigation.navigate('AddNetwork')}
						fluid={true}
					/>
				</View>
				<View style={{ padding: 20 }}>
					<Text>Error: {state.apiError || '-'}</Text>
					<Text>Connected?: {state.isApiConnected ? 'true' : 'false'}</Text>
					<Text>Initialized?: {state.isApiInitialized ? 'true' : 'false'}</Text>
					<Text>Ready?: {state.isApiReady ? 'true' : 'false'}</Text>
				</View>
			</View>
			<NavigationTab />
		</>
	);
}

export default Wallet;
