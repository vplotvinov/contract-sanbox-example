import { Blockchain } from "@ton-community/sandbox"
import "@ton-community/test-utils"
import { expect } from "chai";
import { IdoContract } from "../src/contracts/ido";
import { beginCell, toNano } from "ton-core";
import { updateOwnerBody } from "../src/services/ido.service"; // register matchers

describe('Ido contract', () => {
    it("set new owner", async () => {
        const blkch = await Blockchain.create()
        blkch.verbosity = {
            blockchainLogs: false,
            vmLogs: 'none',
            debugLogs: false,
        }
        const owner = await blkch.treasury('owner')
        const newOwner = await blkch.treasury('newOwner')

        const ido = blkch.openContract(new IdoContract(owner.address))
        await ido.sendDeploy(owner.getSender(), {
            initData: ido.init!.data
        })

        let ownerOfContract = await ido.getOwner()
        expect(ownerOfContract.toString()).eq(owner.address.toString())

        await ido.send(owner.getSender(), {
            body: updateOwnerBody(newOwner.address),
        })

        ownerOfContract = await ido.getOwner()
        expect(ownerOfContract.toString()).eq(newOwner.address.toString())
    })
})