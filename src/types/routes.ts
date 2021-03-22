import { Identity } from 'types/identityTypes';

export type RootStackParamList = {
	AccountDetails: undefined;
	AccountEdit: undefined;
	AccountPin: { isNew: boolean } | undefined;
	Main: { isNew: boolean } | undefined;
	AccountUnlockAndSign: { next: string };
	AccountUnlock: { next: string; onDelete: () => any };
	IdentityBackup: { isNew: true } | { isNew: false; seedPhrase: string };
	IdentityManagement: undefined;
	IdentityNew: { isRecover: boolean } | undefined;
	IdentitySwitch: undefined;
	MessageDetails: undefined;
	Empty: undefined;
	LegacyAccountBackup:
		| {
				isNew: boolean;
		  }
		| undefined;
	LegacyAccountList: undefined;
	LegacyNetworkChooser: undefined;
	NetworkDetails: { pathId: string };
	NetworkSettings: undefined;
	PathDetails: { path: string };
	PathManagement: { path: string };
	PathSecret: { path: string; password?: string };
	PathsList: { networkKey: string };
	PinNew: { resolve: (pin: string) => void };
	PinUnlock:
		| {
				identity?: Identity;
				resolve: (seedPhrase: string) => void;
				shouldReturnSeed: true;
		  }
		| {
				identity?: Identity;
				resolve: () => void;
				shouldReturnSeed: false;
		  };
	PinUnlockWithPassword: {
		identity?: Identity;
		isSeedRefValid: boolean;
		resolve: (password: string) => void;
	};
	QrScanner:
		| undefined
		| {
				isScanningNetworkSpec: true;
		  };
	Security: undefined;
	DetailsMessage: undefined;
	SignedMessage: undefined;
	DetailsTx: { resolve: () => void };
	SignedTx: undefined;
	TxDetails: undefined;
};
