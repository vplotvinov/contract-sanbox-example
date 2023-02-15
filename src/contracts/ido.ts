import {
    Address,
    Contract,
    ContractABI,
    ContractProvider,
    Cell,
    beginCell,
    contractAddress,
    toNano,
    Sender, storeStateInit, Builder
} from "ton-core";
import {
    Maybe
} from "ton-core/dist/utils/maybe";
import {
    hex as idoHexCode
} from '../../build/ido.compiled.json'
import { zeroAddress } from "../helpers";

export class IdoContract implements Contract {
    static readonly code = Cell.fromBoc(Buffer.from(idoHexCode, 'hex'))[0]

    readonly abi: Maybe<ContractABI>;
    readonly address: Address;
    readonly init: Maybe<{ code: Cell; data: Cell }>;

    constructor(owner: Address | null, workchain: number = 0) {
        const data = beginCell()
            .storeAddress(owner ?? zeroAddress) // Wallet Id
            .endCell();
        this.init = {code: IdoContract.code, data};
        this.address = contractAddress(workchain, this.init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, params: {
        initData: Cell
        body?: Cell
        value?: bigint
        deployValue?: bigint
    }) {
        await provider.internal(via, {
            value: params.value ?? toNano('0.1'),
            body: beginCell()
                .storeUint(1, 32) // op
                .storeCoins(params.deployValue ?? toNano('0.05'))
                .storeRef(beginCell().storeWritable(storeStateInit({code: IdoContract.code, data: params.initData})))
                .storeRef(params.body ?? new Cell())
                .endCell()
        })
        return contractAddress(0, {code: IdoContract.code, data: params.initData})
    }

    async send(provider: ContractProvider, via: Sender, params: {
        value?: bigint
        body: Cell
    }) {
        return await provider.internal(via, {
            value: params.value ?? toNano('0.1'),
            body: params.body
        })
    }

    async getOwner(provider: ContractProvider): Promise<Address> {
        const { stack } = await provider.get('get_owner', [])
        return stack.readAddress()
    }
}