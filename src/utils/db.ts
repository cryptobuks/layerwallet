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

import SecureStorage from 'react-native-secure-storage';

import { deserializeWallets, serializeWallets } from './walletsUtils';

import { mergeNetworks, serializeNetworks } from 'utils/networksUtils';
import { SUBSTRATE_NETWORK_LIST } from 'constants/networkSpecs';
import { SubstrateNetworkParams } from 'types/networkTypes';
import { Wallet } from 'types/walletTypes';

function handleError(e: Error, label: string): any[] {
	console.warn(`loading ${label} error`, e);
	return [];
}

/*
 * ========================================
 *	Wallets Store
 * ========================================
 */
const walletsStore = {
	keychainService: 'parity_signer_wallets',
	sharedPreferencesName: 'parity_signer_wallets'
};
const currentIdentityStorageLabel = 'wallets_v1';

export async function loadWallets(version = 4): Promise<Wallet[]> {
	const identityStorageLabel = `wallets_v${version}`;
	try {
		const wallets = await SecureStorage.getItem(
			identityStorageLabel,
			walletsStore
		);
		if (!wallets) return [];
		return deserializeWallets(wallets);
	} catch (e) {
		return handleError(e, 'wallet');
	}
}

export const saveWallets = (wallets: Wallet[]): void => {
	SecureStorage.setItem(
		currentIdentityStorageLabel,
		serializeWallets(wallets),
		walletsStore
	);
};

/*
 * ========================================
 *	Networks Store
 * ========================================
 */
const networkStorage = {
	keychainService: 'parity_signer_updated_networks',
	sharedPreferencesName: 'parity_signer_updated_networks'
};
const currentNetworkStorageLabel = 'networks_v4';

export async function loadNetworks(): Promise<
	Map<string, SubstrateNetworkParams>
> {
	try {
		const networksJson = await SecureStorage.getItem(
			currentNetworkStorageLabel,
			networkStorage
		);

		if (!networksJson) return new Map(Object.entries(SUBSTRATE_NETWORK_LIST));
		const networksEntries = JSON.parse(networksJson);
		return mergeNetworks(SUBSTRATE_NETWORK_LIST, networksEntries);
	} catch (e) {
		handleError(e, 'networks');
		return new Map();
	}
}

export async function saveNetworks(
	newNetwork: SubstrateNetworkParams
): Promise<void> {
	try {
		let addedNetworks = new Map();
		const addedNetworkJson = await SecureStorage.getItem(
			currentNetworkStorageLabel,
			networkStorage
		);
		if (addedNetworkJson) addedNetworks = new Map(JSON.parse(addedNetworkJson));

		addedNetworks.set(newNetwork.genesisHash, newNetwork);
		SecureStorage.setItem(
			currentNetworkStorageLabel,
			serializeNetworks(addedNetworks),
			networkStorage
		);
	} catch (e) {
		handleError(e, 'networks');
	}
}
