import { Blockchain } from "@ton-community/sandbox"
import "@ton-community/test-utils"
import { expect } from "chai";
import { IdoContract } from "../src/contracts/ido";
import { toNano } from "ton-core"; // register matchers

describe('Ido contract', () => {
    it("call get method", async () => {
        const blkch = await Blockchain.create()
        const owner = await blkch.treasury('owner')
        const ido = blkch.openContract(new IdoContract(owner.address))
        await ido.sendDeploy(owner.getSender(), {
            initData: ido.init!.data
        })
        const addrOfContract = await ido.getOwner()
        expect(addrOfContract.toString()).eq(owner.address.toString())
    })
})