/**
 * 装备被动：史莱姆靴子 + 幸运盔甲四件套。
 *
 *  - 史莱姆靴子（lucky:slime_boots）：穿在脚上时持续获得跳跃提升 IV 与速度 IV；
 *    护甲值已与钻石靴子一致（minecraft:wearable.protection = 3 = 钻石靴子的护甲点数）。
 *  - 幸运盔甲（lucky:lucky_helmet / chestplate / leggings / boots）：
 *      1) 四件齐全时每 10 秒获得一个持续 10 秒、II 级的随机正面效果
 *         （不含瞬间治疗与水下呼吸）；
 *      2) 四件齐全时被攻击，随机给攻击者挂 5 秒负面效果
 *         （凋零 I / 饥饿 100 级 / 缓慢·剧毒·悬浮·虚弱·失明 I，不含瞬间伤害），
 *         同一个敌人 2 秒内只吃一次。
 */
import { system, world, EquipmentSlot, TicksPerSecond } from "@minecraft/server"

const SLIME_BOOTS_ID = "lucky:slime_boots"

/** 幸运盔甲全套（槽位 → 物品 id）。 */
const LUCKY_ARMOR_SLOTS = [
    [EquipmentSlot.Head, "lucky:lucky_helmet"],
    [EquipmentSlot.Chest, "lucky:lucky_chestplate"],
    [EquipmentSlot.Legs, "lucky:lucky_leggings"],
    [EquipmentSlot.Feet, "lucky:lucky_boots"],
]

/** 史莱姆靴子刷新间隔与效果时长（tick）。 */
const BOOTS_REFRESH = TicksPerSecond
const BOOTS_DURATION = 2 * TicksPerSecond
/** 跳跃提升 IV / 速度 IV 都对应 amplifier 3。 */
const BOOTS_AMPLIFIER = 3

/** 幸运盔甲被动：每 10 秒触发一次，效果同样持续 10 秒。 */
const SET_INTERVAL = 10 * TicksPerSecond
const SET_DURATION = 10 * TicksPerSecond
/** 套装正面效果统一 II 级（amplifier 1）。 */
const SET_AMPLIFIER = 1

/**
 * 套装随机正面效果池（II 级）。
 * 按需求排除“瞬间治疗”与“水下呼吸”。
 * @type {string[]}
 */
const SET_EFFECTS = [
    "speed",
    "haste",
    "jump_boost",
    "resistance",
    "fire_resistance",
    "regeneration",
    "absorption",
    "health_boost",
    "night_vision",
    "strength",
    "saturation",
    "slow_falling",
    "conduit_power",
    "dolphin_grace",
]

/**
 * 受击反击的负面效果池（5 秒）：[效果名, amplifier]。
 * 凋零 I、饥饿 100 级（amplifier 99），其余 I 级；不含瞬间伤害。
 * @type {[string, number][]}
 */
const RETALIATE_EFFECTS = [
    ["slowness", 0],
    ["poison", 0],
    ["wither", 0],
    ["levitation", 0],
    ["hunger", 99],
    ["weakness", 0],
    ["blindness", 0],
]

/** 反击效果时长（tick）。 */
const RETALIATE_DURATION = 5 * TicksPerSecond
/** 同一个敌人两次反击效果之间的最小间隔（2 秒，多次伤害只吃一次）。 */
const RETALIATE_COOLDOWN = 2 * TicksPerSecond

/** 每个敌人最近一次吃到反击效果的 tick。 @type {Map<string, number>} */
const retaliateGuard = new Map()

function getEquippable(entity) {
    try {
        return entity.getComponent("minecraft:equippable")
    } catch {
        return undefined
    }
}

/** 是否穿齐了四件幸运盔甲。 */
function isWearingLuckySet(player) {
    const equippable = getEquippable(player)
    if (!equippable) return false

    for (const [slot, typeId] of LUCKY_ARMOR_SLOTS) {
        try {
            if (equippable.getEquipment(slot)?.typeId !== typeId) return false
        } catch {
            return false
        }
    }
    return true
}

/** 只有活体才吃 effect，避免对箭矢之类的实体报错。 */
function isLiving(entity) {
    try {
        return !!entity?.getComponent("minecraft:health")
    } catch {
        return false
    }
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

// ---------------------------------------------------------------------------
// 史莱姆靴子
// ---------------------------------------------------------------------------
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const equippable = getEquippable(player)
        if (!equippable) continue

        let worn = false
        try {
            worn = equippable.getEquipment(EquipmentSlot.Feet)?.typeId === SLIME_BOOTS_ID
        } catch {
            continue
        }
        if (!worn) continue

        try {
            player.addEffect("jump_boost", BOOTS_DURATION, {
                amplifier: BOOTS_AMPLIFIER,
                showParticles: false,
            })
            player.addEffect("speed", BOOTS_DURATION, {
                amplifier: BOOTS_AMPLIFIER,
                showParticles: false,
            })
        } catch {
            // 玩家刚好离线，忽略
        }
    }
}, BOOTS_REFRESH)

// ---------------------------------------------------------------------------
// 幸运盔甲：全套被动
// ---------------------------------------------------------------------------
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!isWearingLuckySet(player)) continue

        try {
            player.addEffect(pickRandom(SET_EFFECTS), SET_DURATION, {
                amplifier: SET_AMPLIFIER,
                showParticles: false,
            })
        } catch {
            // 个别效果名在旧版本可能不存在，忽略这一次
        }
    }
}, SET_INTERVAL)

// ---------------------------------------------------------------------------
// 幸运盔甲：受击反击
// ---------------------------------------------------------------------------
world.afterEvents.entityHurt.subscribe(({ hurtEntity, damageSource }) => {
    if (hurtEntity?.typeId !== "minecraft:player") return
    if (!isWearingLuckySet(hurtEntity)) return

    const attacker = damageSource?.damagingEntity
    if (!attacker || attacker.id === hurtEntity.id) return
    if (!isLiving(attacker)) return

    // 同一个敌人 2 秒内多次造成伤害，也只吃一次负面效果
    const now = system.currentTick
    const last = retaliateGuard.get(attacker.id)
    if (last !== undefined && now - last < RETALIATE_COOLDOWN) return
    retaliateGuard.set(attacker.id, now)

    try {
        const [effect, amplifier] = pickRandom(RETALIATE_EFFECTS)
        attacker.addEffect(effect, RETALIATE_DURATION, {
            amplifier,
            showParticles: true,
        })
    } catch {
        // 攻击者刚好消失，忽略
    }
})
