import { Address, beginCell } from "ton-core";

export const updateOwnerBody = (address: Address) => {
    return beginCell()
        .storeUint(202, 32) // op
        .storeAddress(address)
        .endCell()
}