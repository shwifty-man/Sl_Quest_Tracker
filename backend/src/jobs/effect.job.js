import pool from "../../DB/config/db.js"
import { sendSseEvent } from "../services/sse.service.js"
import { myEmitter, boss } from "../services/eventEmitter.js";

export async function startEffectWorker() {

  boss.work("effect-active", async ([job]) => {

  })
}
