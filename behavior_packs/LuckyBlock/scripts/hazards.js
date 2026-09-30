/**
 * 幸运方块灾难事件：雷暴 + 凋零。
 *
 * 触发后：
 *  - 连续 10 秒不停劈雷（每 10 tick 一波，每波 4~8 道，散布在以触发点为中心 15 格内）；
 *  - 同时召唤一只凋零，2 分钟后自动清除；
 *  - 触发瞬间给【所有在线玩家】发标题提示、一把弓、64 根箭，以及 2 分钟抗性提升 I。
 *
 * 多人相关：所有发放都逐个玩家独立 try/catch，谁出问题都不影响其他人；
 * 背包满时把物品掉在本人脚下，保证一定拿得到（拿到的弓/箭都是新建的 ItemStack，
 * 不会出现“同一个物品被多个玩家分摊”的问题）。
 *
 * 凋零会打标签，脚本（重新）加载时兜底清理一次，避免存档里留下永不消失的凋零。
 */
import { system, world, ItemStack, TicksPerSecond } from "@minecraft/server"

/** 雷暴持续时间：10 秒。 */
const STORM_TICKS = 10 * TicksPerSecond
/** 每波雷击的间隔（tick）。 */
const STORM_WAVE_INTERVAL = 10
/** 每波闪电数量范围。 */
const BOLTS_MIN = 4
const BOLTS_MAX = 8
/** 闪电散布半径（格）。 */
const BOLT_RADIUS = 15
/** 凋零存活时间：2 分钟。 */
const WITHER_LIFETIME = 120 * TicksPerSecond
/** 临时凋零的标签，用于兜底清理。 */
const WITHER_TAG = "lucky:temp_wither"
/** 兜底清理时要扫的维度。 */
const DIMENSION_IDS = ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"]
/** 触发时发给全体玩家的抗性提升 I 时长。 */
const RESISTANCE_DURATION = 120 * TicksPerSecond
/** 触发时发给全体玩家的箭数量。 */
const ARROW_COUNT = 64

function isAlive(entity) {
    if (!entity) return false
    try {
        const value = entity.isValid
        return typeof value === "function" ? value.call(entity) : value === true
    } catch {
        return false
    }
}

function removeTaggedWithers(dimensionId) {
    try {
        const dimension = world.getDimension(dimensionId)
        for (const entity of dimension.getEntities({ tags: [WITHER_TAG] })) {
            entity.remove()
        }
    } catch {
        // 维度不存在 / 尚未加载时忽略
    }
}

/** 把物品放进背包，装不下就掉在本人脚下。 */
function giveOrDrop(player, itemStack) {
    try {
        const container = player.getComponent("minecraft:inventory")?.container
        const leftover = container?.addItem(itemStack)
        if (leftover) player.dimension.spawnItem(leftover, player.location)
    } catch {
        try {
            player.dimension.spawnItem(itemStack, player.location)
        } catch {
            // 玩家刚好离线，忽略
        }
    }
}

/**
 * 触发瞬间的全体发放：标题 + 弓 + 64 箭 + 2 分钟抗性提升 I。
 * 逐人独立处理，联机时任何一个人出错都不影响其他人。
 * @param {import("@minecraft/server").Player} player
 */
function armPlayer(player) {
    try {
        player.onScreenDisplay.setTitle("§4§l厄运降临", {
            subtitle: "§c快跑？！！",
            fadeInDuration: 5,
            stayDuration: 40,
            fadeOutDuration: 10,
        })
    } catch {
        // 玩家已离线，忽略提示
    }

    try {
        player.playSound("ambient.weather.thunder")
    } catch {
        // 同上
    }

    try {
        player.addEffect("resistance", RESISTANCE_DURATION, {
            amplifier: 0,
            showParticles: false,
        })
    } catch {
        // 同上
    }

    // 每名玩家各自新建物品，避免共用一个 ItemStack 被分摊
    giveOrDrop(player, new ItemStack("minecraft:bow", 1))
    giveOrDrop(player, new ItemStack("minecraft:arrow", ARROW_COUNT))
}

/**
 * 开始一场雷暴并放出凋零。
 * @param {import("@minecraft/server").Dimension} dimension 触发点所在维度
 * @param {{x: number, y: number, z: number}} origin 触发点（幸运方块所在位置）
 */
export function startWitherStorm(dimension, origin) {
    // ---- 触发瞬间：全体玩家的提示与装备 ----
    for (const player of world.getAllPlayers()) {
        armPlayer(player)
    }

    // ---- 雷暴：连续 10 秒 ----
    let elapsed = 0
    const runId = system.runInterval(() => {
        elapsed += STORM_WAVE_INTERVAL
        try {
            const bolts = BOLTS_MIN + Math.floor(Math.random() * (BOLTS_MAX - BOLTS_MIN + 1))
            for (let i = 0; i < bolts; i++) {
                const angle = Math.random() * Math.PI * 2
                const distance = Math.random() * BOLT_RADIUS
                dimension.spawnEntity("minecraft:lightning_bolt", {
                    x: origin.x + Math.cos(angle) * distance,
                    y: origin.y + 1,
                    z: origin.z + Math.sin(angle) * distance,
                })
            }
        } catch {
            // 区块卸载 / 维度异常时忽略这一波
        }

        if (elapsed >= STORM_TICKS) system.clearRun(runId)
    }, STORM_WAVE_INTERVAL)

    // ---- 凋零 ----
    let wither
    try {
        wither = dimension.spawnEntity("minecraft:wither", {
            x: origin.x,
            y: origin.y + 1,
            z: origin.z,
        })
        wither.addTag(WITHER_TAG)
    } catch {
        wither = undefined
    }

    if (!isAlive(wither)) return

    // 2 分钟后自动清除
    system.runTimeout(() => {
        try {
            if (isAlive(wither)) wither.remove()
        } catch {
            // 已经被打死了，无需处理
        }
    }, WITHER_LIFETIME)
}

// 兜底：脚本加载时清掉上一次会话残留的临时凋零（例如中途退出游戏）
system.run(() => {
    for (const dimensionId of DIMENSION_IDS) removeTaggedWithers(dimensionId)
})
