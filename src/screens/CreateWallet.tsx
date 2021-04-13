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

import React, { useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { components } from 'styles';
import { AccountsContext } from 'stores/AccountsContext';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { NavigationProps } from 'types/props';
import { emptyWallet } from 'utils/walletsUtils';

function CreateWallet({
	navigation
}: NavigationProps<'CreateWallet'>): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const clearWallet = useRef(() => {
		const newWallet = emptyWallet();
		// TODO: ensure this name generation works as expected
		newWallet.name = `Wallet ${accountsStore.state.wallets.length + 1}`;
		return accountsStore.updateNewWallet(newWallet);
	});

	useEffect((): (() => void) => {
		clearWallet.current();
		return clearWallet.current;
	}, [clearWallet]);

	const updateName = (name: string): void => {
		accountsStore.updateNewWallet({ name });
	};

	return (
		<View style={components.page}>
			<TextInput
				onChangeText={updateName}
				value={accountsStore.state.newWallet.name}
				placeholder="Wallet name"
				autofocus={true}
			/>
			<Button
				title="Create wallet"
				onPress={(): void => navigation.navigate('CreateWallet2')}
				fluid={true}
			/>
			<Button
				title="Import wallet"
				onPress={(): void => navigation.navigate('CreateWalletImport')}
				fluid={true}
				secondary={true}
			/>
		</View>
	);
}

export default CreateWallet;
