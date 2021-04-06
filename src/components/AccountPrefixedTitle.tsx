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

import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontStyles } from 'styles';
import { colors } from 'styles';

export default function AccountPrefixedTitle({
	titlePrefix,
	title
}: {
	title: string;
	titlePrefix?: string;
}): ReactElement {
	return (
		<View style={{ flexDirection: 'column' }}>
			{titlePrefix && (
				<Text numberOfLines={1} style={[fontStyles.t_codeS, styles.text]}>
					{titlePrefix}
				</Text>
			)}
			<Text numberOfLines={1} style={[fontStyles.h2, { marginTop: -2 }]}>
				{title}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		color: colors.signal.main,
		marginBottom: 1,
		marginRight: 4
	}
});
