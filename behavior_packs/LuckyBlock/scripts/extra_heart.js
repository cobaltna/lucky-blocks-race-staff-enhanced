/**
 * 额外的心：吃下后永久 +2 颗心，死亡清零。
 *
 * 机制参考 Better on Bedrock 的 soul_heart.js：
 *  - health_boost 每级 +4 HP = 2 颗心，等级 N 就代表吃了 N 个；
 *  - 效果时长拉满，并在玩家上线/重生时按计数重新施加，所以对玩家而言是永久的；
 *  - 死亡时游戏本身会清掉所有状态效果，这里同时把计数清零，符合“死了就归零”。
 *
 * 触发钩子用 world.afterEvents.itemCompleteUse（@minecraft/server 1.4.0 起的稳定事件，
 * 吃东西完成时必定触发，比物品自定义组件更可靠）；计数存在玩家自己的动态属性上，
 * 联机时每个人的层数互相独立。
 */
import { world } from "@minecraft/server"

const HEART_ID = "lucky:extra_heart"
const COUNT_PROP = "lucky:extra_heart_count"
/** 最多叠 20 次（+40 颗心）。 */
const MAX_COUNT = 20
/** 效果时长拉满，实际靠上线/重生时重挂维持。 */
const BOOST_DURATION = 20000000

function applyHeartBoost(player, count) {
    if (count <= 0) {
        if (player.getEffect("health_boost") !== undefined) {
            player.removeEffect("health_boost")
        }
        return
    }

    // amplifier 从 0 起：第 N 个额外的心 = 等级 N = +2N 颗心
    player.addEffect("health_boost", BOOST_DURATION, {
        amplifier: count - 1,
        showParticles: false,
    })
}

/** 吃下额外的心时的结算（由 itemCompleteUse 触发）。 */
export function eatExtraHeart({ itemStack, source }) {
    if (itemStack?.typeId !== HEART_ID) return
    if (!source) return

    let current
    try {
        current = source.getDynamicProperty(COUNT_PROP) ?? 0
    } catch {
        return
    }

    if (current >= MAX_COUNT) {
        try {
            source.onScreenDisplay.setActionBar("§7[§b额外的心§7] §c已达上限")
        } catch {
            // 玩家已离线
        }
        return
    }

    const count = current + 1
    try {
        source.setDynamicProperty(COUNT_PROP, count)
        applyHeartBoost(source, count)
        source.playSound("random.levelup")
        source.onScreenDisplay.setActionBar(`§7[§b额外的心§7] §b+2 ❤ §7(§b${count}§7)`)
    } catch {
        // 玩家已离线，忽略
    }
}

// 吃下时结算
world.afterEvents.itemCompleteUse.subscribe(eatExtraHeart)

// 死亡清零（状态效果本身也会被游戏清掉）
world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
    if (deadEntity?.typeId !== "minecraft:player") return
    try {
        deadEntity.setDynamicProperty(COUNT_PROP, 0)
    } catch {
        // 忽略
    }
})

// 上线 / 重生时按已存计数重新施加（状态效果不跨会话保留）
world.afterEvents.playerSpawn.subscribe(({ player }) => {
    if (!player) return
    try {
        applyHeartBoost(player, player.getDynamicProperty(COUNT_PROP) ?? 0)
    } catch {
        // 忽略
    }
})
