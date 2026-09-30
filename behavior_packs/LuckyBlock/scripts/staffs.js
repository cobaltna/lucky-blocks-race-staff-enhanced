/**
 * 法杖系统 —— 由《更好的基岩版》迁移进幸运方块 Add-On，并做了加强。
 *
 * 设计说明：
 *  - 法力值复用物品耐久度：消耗法力 = 增加 durability.damage，耐久条即法力条。
 *  - 主攻击：按住使用键（itemStartUse）持续释放光束。
 *  - 二次攻击：潜行 + 点击（itemUse）。
 *  - 视觉部分全部用原版粒子沿视线绘制，不依赖 molang 变量，保证一定看得见。
 *  - 冷却：物品自带 6 秒 minecraft:cooldown（物品栏转圈），同时脚本在动作栏显示倒计时。
 */
import {
    system,
    world,
    ItemDurabilityComponent,
    EntityInventoryComponent,
    EntityProjectileComponent,
    EntityDamageCause,
    GameMode,
    TicksPerSecond,
} from "@minecraft/server";

const DURABILITY_COMPONENT = ItemDurabilityComponent.componentId;
const INVENTORY_COMPONENT = EntityInventoryComponent.componentId;
const PROJECTILE_COMPONENT = EntityProjectileComponent.componentId;

/** 主攻击的结算间隔（tick）。原实现是 20，这里加强为 5。 */
const EFFECT_INTERVAL = 5;
/** 主攻击每次结算消耗的法力。 */
const MANA_PER_EFFECT = 3;
/** 光束音效的循环间隔（tick）。 */
const SOUND_INTERVAL = 40;
/** 光束绘制间隔（tick）。 */
const BEAM_INTERVAL = 2;
/** 枪口粒子（“发射中”反馈）的间隔（tick）。 */
const MUZZLE_INTERVAL = 10;
/** 冷却时间：所有法杖统一 6 秒，与物品 minecraft:cooldown 保持一致。 */
const COOLDOWN_TICKS = 6 * TicksPerSecond;
/** 与物品 JSON 里 minecraft:cooldown.category 保持一致，用于脚本强制开启冷却。 */
const COOLDOWN_CATEGORY = "lucky:staff";
/** 冰法杖每 5 tick 结算一次的法力。 */
const ICE_MANA_PER_EFFECT = 2;
/** 主攻击最长持续时间：长按屏幕也只结算 1 秒，之后自动收手并进入冷却。 */
const MAX_CAST_TICKS = TicksPerSecond;
/** 冰法杖的锁定距离：从 20 缩到 12。 */
const ICE_RANGE = 12;
/** 冰法杖追踪触发扇形的半角：全角 90°（基础/吸血法杖的攻击光束仍是 140°）。 */
const ICE_CONE_ANGLE = 45;
/** 冰弹飞行中朝锁定目标弱追踪的强度：每 2 tick 把速度方向朝目标混合 30%（速率不变）。 */
const ICE_STEER = 0.3;
/**
 * 追踪修正的作用半径（按冰弹自己到目标的距离算）。
 * 索敌的 ICE_RANGE（12 格）量的是“目标离玩家”——玩家身边的目标永远锁得到，
 * 但冰弹可能已经飞出去几十格；没有这条限制，飞远的冰弹会被玩家身边的
 * 目标从远处拽回来。超过 16 格就不再修正，直飞 + 缓降。
 */
const ICE_STEER_RANGE = 16;
/** 冰弹每 2 tick 由脚本施加的下坠量（0.015/tick）。引擎重力已关闭，下坠全部由脚本管；
 * 之前 0.005/tick 太温和，稍微朝上瞄准就会飘很久才掉头，看起来像“往上飘”。 */
const ICE_DROP = 0.03;

const STAFF_IDS = [
    "lucky:staff",
    "lucky:ice_staff",
    "lucky:flender_staff",
    "lucky:explosion_staff",
];

/** 炸弹球出手速度（格/tick）。原来 1.8 太快，看不清也不好瞄，降到 1。 */
const BOMB_SPEED = 1;
/** 出手时的上抬量，给一点点抛物线手感。 */
const BOMB_LIFT = 0.05;
/**
 * 每 2 tick 自己施加的下坠量（0.01/tick）。
 * 不靠 projectile / physics 的重力，是因为两边都写重力会叠加成“沉得特别快”，
 * 自己管之后下坠是线性的、看得清，飞得也远。
 */
const BOMB_DROP = 0.02;
/**
 * 爆炸法杖一次发射的法力，与其它法杖一次完整蓄力相同（4 次结算 × 3）。
 * 注意要和 explosion_staff.json 的 max_durability = 156 配对：法力判据是“严格小于”，
 * 156 / 12 = 13 组但最后一组取不到，所以恰好能发射 12 次。改其中一个，另一个要一起算。
 */
const BOMB_MANA_COST = 4 * MANA_PER_EFFECT;
/** 炸弹球落点周围撒 TNT 的半径，对应“总范围大约半径 5~6 格”。 */
const TNT_SPREAD_RADIUS = 5.5;
/** 每次撒下的 TNT 数量范围。 */
const TNT_MIN = 6;
const TNT_MAX = 8;

// 粒子（均为本整合包已验证可用的 ID）
const PARTICLE_SPARK = "minecraft:totem_particle";
const PARTICLE_SOUL = "pog:soul";
const PARTICLE_SNOW = "pog:snow_effect";
/** 发射时的枪口粒子。 */
const PARTICLE_MUZZLE = "minecraft:knockback_roar_particle";

/** 基本法杖 / 吸血法杖共用的锥形判定参数：半径大、角度宽，尽量好打中。 */
const BEAM_RANGE = 20;
const CONE_ANGLE = 70;
/** 这个距离以内不再判角度，贴脸必中。 */
const POINT_BLANK = 5;

const STAFFS = {
    "lucky:staff": {
        beamParticles: [PARTICLE_SPARK],
        muzzle: true,
        loopSound: "staff.basic.use",
        secondaryMana: 15,
        secondaryCooldown: COOLDOWN_TICKS,
        effect(player) {
            for (const entity of getConeTargets(player, BEAM_RANGE, CONE_ANGLE)) {
                entity.addEffect("levitation", 5.5 * TicksPerSecond, {
                    amplifier: 2,
                    showParticles: false,
                });
                entity.applyDamage(4);
            }
        },
        secondary(player) {
            const entity = spawnAhead(player, "minecraft:shulker_bullet");
            entity.applyImpulse(player.getViewDirection());
            setProjectileOwner(entity, player);
            muzzleBurst(player, PARTICLE_MUZZLE, 10, 0.8, 1.2);
            player.dimension.playSound("mob.shulker.shoot", player.getHeadLocation());
        },
    },

    "lucky:ice_staff": {
        startSound: "staff.ice.use",
        track: true,
        secondaryMana: 15,
        secondaryCooldown: COOLDOWN_TICKS,
        // 冰霜新星：以自身为中心冻结周围敌人
        secondary(player) {
            for (const entity of getSphereTargets(player, 8)) {
                entity.addEffect("slowness", 5 * TicksPerSecond, {
                    amplifier: 2,
                    showParticles: true,
                });
                entity.addEffect("mining_fatigue", 5 * TicksPerSecond, {
                    amplifier: 0,
                    showParticles: false,
                });
                entity.applyDamage(8);
            }
            muzzleBurst(player, PARTICLE_SNOW, 20, 4, 0);
            player.dimension.playSound("staff.ice.use", player.getHeadLocation());
        },
    },

    // 吸血法杖（原“弗兰德法杖”）
    "lucky:flender_staff": {
        beamParticles: [PARTICLE_SOUL, PARTICLE_SPARK],
        muzzle: true,
        startSound: "staff.flender.use",
        secondaryMana: 20,
        secondaryCooldown: COOLDOWN_TICKS,
        effect(player) {
            const targets = getConeTargets(player, BEAM_RANGE, CONE_ANGLE);
            for (const entity of targets) {
                entity.addEffect("wither", 4 * TicksPerSecond, {
                    amplifier: 0,
                    showParticles: false,
                });
                entity.applyDamage(10);
            }
            if (targets.length > 0) {
                // 生命恢复 III（amplifier 2），持续 5 秒
                player.addEffect("regeneration", 5 * TicksPerSecond, {
                    amplifier: 2,
                    showParticles: false,
                });
            }
        },
        secondary(player) {
            const entity = spawnAhead(player, "lucky:flender_fireball");
            const view = player.getViewDirection();
            entity.applyImpulse({ x: view.x * 1.4, y: view.y * 1.2, z: view.z * 1.4 });
            muzzleBurst(player, PARTICLE_SOUL, 16, 1.0, 1.3);
            player.dimension.playSound("staff.flender.use", player.getHeadLocation());
        },
    },

    // 爆炸法杖：出手瞬间打出一颗炸弹球，沿视线直飞（不追踪），
    // 撞停或 5 秒自毁时在球最后所在的位置炸出一圈“即将爆炸”的 TNT
    "lucky:explosion_staff": {
        muzzle: true,
        startSound: "staff.fire.use",
        launchOnStart: true,
        effect(player) {
            launchBombBall(player);
        },
    },
};

/**
 * 正在施法中的玩家状态。
 * @type {Map<string, {typeId: string, slot: number, runId: number|undefined, iceProjectile: any, lockedTarget: any}>}
 */
const casting = new Map();
/** 二次攻击冷却结束的 tick。 @type {Map<string, number>} */
const secondaryReady = new Map();
/** 主攻击冷却结束的 tick。 @type {Map<string, number>} */
const primaryReady = new Map();
/** 冷却倒计时显示用的 interval。 @type {Map<string, number>} */
const cooldownDisplay = new Map();

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------

/** 兼容 isValid 属性 / 方法两种形态。 */
function isAlive(entity) {
    if (!entity) return false;
    try {
        const value = entity.isValid;
        return typeof value === "function" ? value.call(entity) : value === true;
    } catch {
        return false;
    }
}

function isStaff(itemStack) {
    return !!itemStack && STAFF_IDS.includes(itemStack.typeId);
}

/** 只有活体才能吃 effect / damage，避免对投掷物调用时报错。 */
function isLiving(entity) {
    try {
        return !!entity.getComponent("minecraft:health");
    } catch {
        return false;
    }
}

/**
 * 不能当作索敌目标的地图装饰实体：悬浮名牌（entity:name，幸运方块掉落物头顶
 * 那种悬浮文字）、特效火焰（entity:living_flame 是陨星之剑的火焰残影、
 * entity:fire_particle 是大厅装饰）、盔甲架。
 * 它们都带 health，isLiving 会放行，但追逐它们 = 朝着空气飞——
 * 名牌都悬在半空，这就是“冰球没人的时候突然疯狂往上飞”的根源。
 */
const NON_TARGET_TYPES = new Set([
    "entity:name",
    "entity:show_name",
    "entity:fire_particle",
    "entity:living_flame",
    "minecraft:armor_stand",
]);

/** 碰撞箱为 0 的是纯标记实体（悬浮名牌之类），一律不当目标。 */
function isMarkerEntity(entity) {
    try {
        const box = entity.getComponent("minecraft:collision_box");
        return !box || (box.width <= 0.01 && box.height <= 0.01);
    } catch {
        return false;
    }
}

function getInventory(player) {
    return player.getComponent(INVENTORY_COMPONENT)?.container;
}

/** 沿视线方向铺一条粒子束 —— 这样才看得出“在发射”。 */
function drawBeam(player, particleIds, distance) {
    const head = player.getHeadLocation();
    const view = player.getViewDirection();
    const dimension = player.dimension;

    for (let d = 2; d <= distance; d += 2) {
        const point = {
            x: head.x + view.x * d,
            y: head.y + view.y * d,
            z: head.z + view.z * d,
        };
        for (const particleId of particleIds) {
            dimension.spawnParticle(particleId, point);
        }
    }
}

/** 枪口爆发：在视线前方喷出一团粒子。 */
function muzzleBurst(player, particleId, count, spread, forward) {
    const head = player.getHeadLocation();
    const view = player.getViewDirection();
    const dimension = player.dimension;
    const base = {
        x: head.x + view.x * forward,
        y: head.y + view.y * forward,
        z: head.z + view.z * forward,
    };

    for (let i = 0; i < count; i++) {
        dimension.spawnParticle(particleId, {
            x: base.x + (Math.random() - 0.5) * spread,
            y: base.y + (Math.random() - 0.5) * spread,
            z: base.z + (Math.random() - 0.5) * spread,
        });
    }
}

/**
 * 视线锥形判定。
 * 半径大、角度宽，且 POINT_BLANK 内不判角度，尽量“好打中”。
 */
function getConeTargets(player, radius, halfAngleDeg) {
    const origin = player.getHeadLocation();
    const view = player.getViewDirection();
    const cosLimit = Math.cos((halfAngleDeg * Math.PI) / 180);

    let candidates;
    try {
        candidates = player.dimension.getEntities({
            location: origin,
            maxDistance: radius,
        });
    } catch {
        return [];
    }

    const hits = [];
    for (const entity of candidates) {
        if (entity.id === player.id || !isLiving(entity)) continue;

        // 用 location（所有实体都一定有）而不是 getHeadLocation，避免版本差异
        const location = entity.location;
        const dx = location.x - origin.x;
        const dy = location.y + 1 - origin.y;
        const dz = location.z - origin.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < 0.001 || distance > radius) continue;

        if (distance > POINT_BLANK) {
            const dot = (dx * view.x + dy * view.y + dz * view.z) / distance;
            if (dot < cosLimit) continue;
        }
        hits.push({ entity, distance });
    }

    hits.sort((a, b) => a.distance - b.distance);
    return hits.map((hit) => hit.entity);
}

/** 球形范围判定，用于冰霜新星。 */
function getSphereTargets(player, radius) {
    let candidates;
    try {
        candidates = player.dimension.getEntities({
            location: player.location,
            maxDistance: radius,
        });
    } catch {
        return [];
    }

    return candidates.filter(
        (entity) => entity.id !== player.id && isLiving(entity),
    );
}

/** 在玩家视线前方 1 格处生成实体。 */
function spawnAhead(player, typeId) {
    const head = player.getHeadLocation();
    const view = player.getViewDirection();
    return player.dimension.spawnEntity(typeId, {
        x: head.x + view.x,
        y: head.y + view.y,
        z: head.z + view.z,
    });
}

/**
 * 在落点周围撒下 8~10 个“即将爆炸”的 TNT。
 *
 * 用的是本包 minecraft:tnt 覆盖定义里的 from_explosion 分组：引信 0.5~2 秒、威力 4、不引火，
 * 正好就是原版“被爆炸炸出来的 TNT”那种马上就要炸的状态。
 */
function spawnTntBarrage(dimension, origin) {
    const count = TNT_MIN + Math.floor(Math.random() * (TNT_MAX - TNT_MIN + 1));
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // 开方采样，让落点在圆面内均匀分布而不是挤在中心
        const distance = Math.sqrt(Math.random()) * TNT_SPREAD_RADIUS;
        const x = (origin.x + Math.cos(angle) * distance).toFixed(2);
        const y = (origin.y + 1).toFixed(2);
        const z = (origin.z + Math.sin(angle) * distance).toFixed(2);
        try {
            dimension.runCommand(`summon tnt ${x} ${y} ${z} ~ ~ from_explosion`);
        } catch {
            // 区块未加载等情况忽略这一个
        }
    }
    try {
        dimension.playSound("random.fuse", origin);
    } catch {
        // 玩家离线等异常忽略
    }
}

/**
 * 爆炸法杖主攻击：抛出一颗炸弹球，落到哪就在哪炸出一片 TNT。
 *
 * 命中判定完全交给引擎，与陨星之剑的流星火球同一套写法：
 * bomb_ball.json 的 minecraft:projectile.on_hit（碰方块/碰生物都触发）和
 * 5 秒自毁的 timer 都会发 scriptevent 通知脚本，脚本收到后在球所在位置撒 TNT。
 * 脚本不再自己采样“撞停”——引擎说撞了才是真的撞了。
 *
 * 脚本这边只负责出手与手感：眼前 1.5 格出手、沿视线 1 格/tick 直飞、轻微线性下坠。
 */
function launchBombBall(player) {
    const head = player.getHeadLocation();
    const view = player.getViewDirection();
    const dimension = player.dimension;

    let ball;
    try {
        ball = dimension.spawnEntity("lucky:bomb_ball", {
            x: head.x + view.x * 1.5,
            y: head.y + view.y * 1.5,
            z: head.z + view.z * 1.5,
        });
    } catch {
        return;
    }

    // 登记投掷物主人：球不会和发射者自己碰撞（否则朝下扔会卡在自己碰撞箱里）
    setProjectileOwner(ball, player);

    const velocity = {
        x: view.x * BOMB_SPEED,
        y: view.y * BOMB_SPEED + BOMB_LIFT,
        z: view.z * BOMB_SPEED,
    };
    setBallVelocity(ball, velocity);

    // 每帧只补一点线性下坠；命中与自毁都由实体事件经 scriptevent 通知
    const runId = system.runInterval(() => {
        if (!isAlive(ball)) {
            stopBombTracker(ball);
            return;
        }
        velocity.y -= BOMB_DROP;
        setBallVelocity(ball, velocity);
    }, 2);
    try {
        bombTrackers.set(ball.id, runId);
    } catch {
        // 实体已消失，下坠循环会在下一次检查时自行退出
    }
}

/** 每颗在飞的炸弹球的下坠循环 id，按实体 id 索引。 @type {Map<string, number>} */
const bombTrackers = new Map();
/** 已经撒过 TNT 的炸弹球 id（命中与 5 秒自毁可能都发一次通知，去重）。 @type {Set<string>} */
const detonatedBombs = new Set();

function stopBombTracker(ball) {
    let id;
    try {
        id = ball.id;
    } catch {
        return;
    }
    const runId = bombTrackers.get(id);
    if (runId !== undefined) {
        system.clearRun(runId);
        bombTrackers.delete(id);
    }
}

/**
 * 炸弹球的统一收尾：命中方块/生物（on_hit）或 5 秒自毁（timer）时，在球所在位置
 * 撒一拨“即将爆炸”的 TNT 并移除球。撒 TNT 留在脚本里，才能随机 8~10 个并均匀散开。
 * @param ball 触发通知的炸弹球实体（scriptevent 的 sourceEntity）
 */
function finishBombBall(ball) {
    if (!ball) return;
    let id;
    try {
        id = ball.id;
    } catch {
        return;
    }
    if (detonatedBombs.has(id)) return;
    detonatedBombs.add(id);

    stopBombTracker(ball);

    let at;
    try {
        at = ball.location;
    } catch {
        return;
    }
    spawnTntBarrage(ball.dimension, at);
    try {
        if (isAlive(ball)) ball.remove();
    } catch {
        // 已经没了
    }
}

/**
 * 重设炸弹球速度：先清空再交回脚本，弹道完全可预测，
 * 不会被引擎自带的重力/阻力改得忽快忽慢。
 */
function setBallVelocity(ball, velocity) {
    try {
        ball.clearVelocity();
        ball.applyImpulse(velocity);
    } catch {
        // 球已消失，忽略
    }
}

function setProjectileOwner(entity, player) {
    try {
        const projectile = entity.getComponent(PROJECTILE_COMPONENT);
        if (projectile) projectile.owner = player;
    } catch {
        // 某些投掷物没有 projectile 组件，忽略即可
    }
}

/**
 * 扣法力。法力 = 耐久度，因此直接累加 damage。
 * 上限停在 maxDurability - 1，避免把法杖直接“用坏”。
 * @returns {boolean} 法力是否足够
 */
function spendMana(itemStack, player, amount) {
    const durability = itemStack.getComponent(DURABILITY_COMPONENT);
    if (!durability) return false;
    if (durability.damage + amount >= durability.maxDurability) return false;

    if (player.getGameMode() !== GameMode.creative) {
        durability.damage += amount;
        getInventory(player)?.setItem(player.selectedSlotIndex, itemStack);
    }
    return true;
}

/**
 * 施法期间【只读】地检查法力够不够，并把消耗先记账，稍后统一写入。
 *
 * 这里刻意不再像旧版那样每 5 tick 把物品写回槽位：正在被“使用”的物品如果中途被
 * 重新写进槽位，客户端会丢失“这件东西正在被使用”的配对，于是 use_modifiers 里的
 * movement_modifier（蓄力减速 0.5）就不会在松手时被撤销 —— 表现就是“技能早放完了
 * 却一直减速，要切换手持物才恢复”。法力统一在 endCasting 里写一次即可。
 */
function canSpendManaFromSlot(player, state, amount) {
    const inventory = getInventory(player);
    if (!inventory) return false;

    const itemStack = inventory.getItem(state.slot);
    if (!itemStack || itemStack.typeId !== state.typeId) return false;

    const durability = itemStack.getComponent(DURABILITY_COMPONENT);
    if (!durability) return false;
    return durability.damage + state.pendingMana + amount < durability.maxDurability;
}

/** 把施法期间记账的法力一次性写回槽位。 */
function applyPendingMana(player, state) {
    const amount = state.pendingMana;
    state.pendingMana = 0;
    if (!amount || amount <= 0) return;

    try {
        if (player.getGameMode() === GameMode.creative) return;

        const inventory = getInventory(player);
        if (!inventory) return;

        const itemStack = inventory.getItem(state.slot);
        if (!itemStack || itemStack.typeId !== state.typeId) return;

        const durability = itemStack.getComponent(DURABILITY_COMPONENT);
        if (!durability) return;

        // 夹在 max-1，避免把法杖直接写坏
        durability.damage = Math.min(durability.maxDurability - 1, durability.damage + amount);
        inventory.setItem(state.slot, itemStack);
    } catch {
        // 物品/玩家状态在收尾瞬间变化时忽略即可
    }
}

/**
 * 强制结束客户端的“使用中”状态。
 *
 * 物品 JSON 的 minecraft:cooldown 只有在“使用完成”时才会触发，而法杖的
 * use_duration 长到永远不会完成，所以那圈冷却转盘其实一直没生效，客户端的
 * “使用中”标记也就只能等松手才清。脚本侧直接开启同一 category 的冷却，既让
 * 物品栏冷却显示和脚本的 6 秒同步，也顺带把残留的蓄力状态顶掉。
 */
function forceItemCooldown(player) {
    try {
        player.startItemCooldown(COOLDOWN_CATEGORY, COOLDOWN_TICKS);
    } catch {
        // 旧版本没有该 API 时忽略（此时仍靠 use_duration 收手）
    }
}

function sendMessage(player, key) {
    player.sendMessage([{ text: "§c[!] §r" }, { translate: key }]);
}

function showActionBar(player, rawtext) {
    try {
        player.onScreenDisplay.setActionBar({ rawtext });
    } catch {
        // 玩家已离线，忽略
    }
}

/** 在动作栏显示冷却倒计时，冷却结束时提示“冷却完成”。 */
function startCooldownDisplay(player) {
    const playerId = player.id;
    const existing = cooldownDisplay.get(playerId);
    if (existing !== undefined) system.clearRun(existing);

    let remaining = COOLDOWN_TICKS;
    const runId = system.runInterval(() => {
        if (!isAlive(player)) {
            system.clearRun(runId);
            cooldownDisplay.delete(playerId);
            return;
        }

        if (remaining > 0) {
            showActionBar(player, [
                { translate: "lucky.message.staffs.cooldown" },
                { text: `${(remaining / TicksPerSecond).toFixed(1)}s` },
            ]);
            remaining -= 5;
            return;
        }

        // 冷却完成
        showActionBar(player, [{ translate: "lucky.message.staffs.cooldownReady" }]);
        system.clearRun(runId);
        cooldownDisplay.delete(playerId);

        // 1 秒后清掉提示；若这期间又进入了冷却则保留新提示
        system.runTimeout(() => {
            if (cooldownDisplay.has(playerId) || !isAlive(player)) return;
            showActionBar(player, [{ text: " " }]);
        }, TicksPerSecond);
    }, 5);
    cooldownDisplay.set(playerId, runId);
}

// ---------------------------------------------------------------------------
// 主攻击
// ---------------------------------------------------------------------------

function startCasting(player, itemStack) {
    const playerId = player.id;
    if (casting.has(playerId)) return;

    const typeId = itemStack.typeId;
    const config = STAFFS[typeId];
    if (!config) return;

    // 冷却中不允许再次起手。物品的 minecraft:cooldown 只负责物品栏转圈显示，
    // 并不能可靠拦住 itemStartUse，所以必须在这里自己把关。
    if (system.currentTick < (primaryReady.get(playerId) ?? 0)) return;

    /** @type {any} */
    const state = {
        typeId,
        slot: player.selectedSlotIndex,
        runId: undefined,
        iceProjectile: undefined,
        lockedTarget: undefined,
        // 施法期间累计的法力，收手时一次性写入（过程中不碰槽位里的物品）
        pendingMana: 0,
    };
    casting.set(playerId, state);

    if (config.startSound) {
        player.dimension.playSound(config.startSound, player.getHeadLocation());
    }
    // 发射瞬间的枪口粒子
    muzzleBurst(player, PARTICLE_MUZZLE, 12, 0.9, 1.2);

    if (config.track) {
        state.iceProjectile = spawnIceProjectile(player);
    }

    // 一发式（爆炸法杖）：和 tickCasting 第一段判定同一瞬间出手，然后立刻收手进入冷却。
    // 放在这里而不是等蓄力计时器，是为了不再出现“先闪两次粒子、球才慢吞吞出来”的延迟感。
    if (config.launchOnStart) {
        try {
            if (!canSpendManaFromSlot(player, state, BOMB_MANA_COST)) {
                endCasting(player, true);
                return;
            }
            state.pendingMana += BOMB_MANA_COST;
            config.effect(player);
        } catch {
            // 发射失败也必须收手，否则玩家会卡在“施法中”，法杖再也用不了
        }
        endCasting(player, false);
        return;
    }

    let ticks = 0;
    state.runId = system.runInterval(() => {
        if (state.runId === undefined) return;

        if (!isAlive(player)) {
            endCasting(player, false);
            return;
        }

        try {
            tickCasting(player, state, ticks);
        } catch {
            // 施法期间任何单次异常都不应该让法杖卡死
            endCasting(player, false);
            return;
        }
        ticks++;

        // 到点强制收手：玩家即使一直按着屏幕，也只结算 MAX_CAST_TICKS
        if (ticks >= MAX_CAST_TICKS) {
            endCasting(player, false);
        }
    }, 1);
}

function tickCasting(player, state, ticks) {
    const config = STAFFS[state.typeId];
    if (!config) {
        endCasting(player, false);
        return;
    }

    if (config.beamParticles && ticks % BEAM_INTERVAL === 0) {
        drawBeam(player, config.beamParticles, BEAM_RANGE);
    }

    // 持续施法时也不断有“发射中”的粒子反馈
    if (config.muzzle && ticks % MUZZLE_INTERVAL === 0) {
        muzzleBurst(player, PARTICLE_MUZZLE, 6, 0.7, 1.2);
    }

    if (config.loopSound && ticks % SOUND_INTERVAL === 0) {
        player.dimension.playSound(config.loopSound, player.getHeadLocation());
    }

    if (config.track) {
        updateIceTracking(player, state, ticks);
        return;
    }

    if (ticks % EFFECT_INTERVAL === 0) {
        if (!canSpendManaFromSlot(player, state, MANA_PER_EFFECT)) {
            endCasting(player, true);
            return;
        }
        state.pendingMana += MANA_PER_EFFECT;
        config.effect(player);
    }
}

function endCasting(player, outOfMana) {
    const playerId = player.id;
    const state = casting.get(playerId);
    if (!state) return;

    if (state.runId !== undefined) {
        system.clearRun(state.runId);
        state.runId = undefined;
    }
    casting.delete(playerId);

    // 法力在这里一次性结算
    applyPendingMana(player, state);

    if (outOfMana) {
        sendMessage(player, "lucky.message.staffs.outOfMana");
    }

    // 进入 6 秒冷却：脚本侧计时负责拦截再次起手，startCooldownDisplay 负责倒计时显示，
    // forceItemCooldown 负责把客户端的“使用中/蓄力”状态真正结束掉。
    primaryReady.set(playerId, system.currentTick + COOLDOWN_TICKS);
    forceItemCooldown(player);
    startCooldownDisplay(player);
}

// ---------------------------------------------------------------------------
// 冰法杖
// ---------------------------------------------------------------------------

/**
 * 冰法杖出手：与爆炸法杖同一套写法——在眼前 1.5 格沿视线生成、出生即武装、立即飞走。
 * 冰块不再在头顶悬浮（悬停期间只要撞上低天花板/窄走廊/路过的生物就会当场引爆），
 * “头顶自爆”从机制上不存在了。
 */
function spawnIceProjectile(player) {
    const head = player.getHeadLocation();
    const view = player.getViewDirection();
    const dimension = player.dimension;

    let ice;
    try {
        ice = dimension.spawnEntity("lucky:ice_projectile", {
            x: head.x + view.x * 1.5,
            y: head.y + view.y * 1.5,
            z: head.z + view.z * 1.5,
        });
    } catch {
        return undefined;
    }

    // 登记投掷物主人：冰块不会和发射者自己碰撞
    setProjectileOwner(ice, player);
    // 贴墙出手时冰块可能当场撞爆，给自己短暂抗性
    protectFromOwnExplosion(player, 2 * TicksPerSecond);

    // 弹速由脚本接管（与爆炸法杖的炸弹球同一套）：
    // BP 里 inertia=1.0、gravity=0，引擎不再衰减/下拉速度，
    // 否则默认 0.99 的空气阻力会让冰弹越飞越慢，最后停在半空“往上飘再下坠”。
    // 出手速度保持原版 1.0 / 0.7。
    const velocity = {
        x: view.x * 1.0,
        y: view.y * 0.7,
        z: view.z * 1.0,
    };
    setBallVelocity(ice, velocity);

    // 每 2 tick：朝锁定的目标把速度方向混合 30%（追踪、速率不变），再线性下坠一点。
    // 顺便记录冰弹最后位置：冰弹被销毁/被引擎吞掉而没走 on_hit 时，
    // 由这里按最后位置补一炸（finishIceBall），保证“冰弹没了就一定炸过”。
    let lastPos = ice.location;
    let polls = 0;
    const runId = system.runInterval(() => {
        if (!isAlive(ice)) {
            system.clearRun(runId);
            finishIceBall(ice, lastPos, dimension);
            return;
        }
        polls++;

        try {
            lastPos = ice.location;
        } catch {
            // 读不到就沿用上一次坐标
        }

        const target = findIceTarget(player);
        if (isAlive(target)) {
            // 锁定目标持续挂减速（保留原有的控制效果）
            if (polls % 5 === 0) {
                try {
                    target.addEffect("slowness", 2 * TicksPerSecond, {
                        amplifier: 1,
                        showParticles: false,
                    });
                } catch {
                    // 目标刚好消失，忽略
                }
            }
            try {
                const from = ice.location;
                const to = target.location;
                const dx = to.x - from.x;
                const dy = to.y + 1 - from.y;
                const dz = to.z - from.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist > 0.001 && dist <= ICE_STEER_RANGE) {
                    const speed = Math.sqrt(
                        velocity.x * velocity.x +
                        velocity.y * velocity.y +
                        velocity.z * velocity.z,
                    ) || 1;
                    // 速度方向朝目标方向混合 ICE_STEER，速率保持不变
                    let mx = velocity.x * (1 - ICE_STEER) + (dx / dist) * speed * ICE_STEER;
                    let my = velocity.y * (1 - ICE_STEER) + (dy / dist) * speed * ICE_STEER;
                    let mz = velocity.z * (1 - ICE_STEER) + (dz / dist) * speed * ICE_STEER;
                    const ms = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
                    velocity.x = (mx / ms) * speed;
                    velocity.y = (my / ms) * speed;
                    velocity.z = (mz / ms) * speed;
                }
            } catch {
                // 冰块或目标刚好消失，忽略
            }
        }

        velocity.y -= ICE_DROP;
        setBallVelocity(ice, velocity);
    }, 2);

    return ice;
}

/** 已经爆过的冰弹 id（命中/被销毁/5 秒超时可能都发一次通知，去重防止炸两次）。 @type {Set<string>} */
const detonatedIce = new Set();

/**
 * 冰弹的统一收尾：命中方块/生物（on_hit）、被销毁（destroy_on_hurt）、
 * 或 5 秒超时（timer）都汇到这里，在冰弹最后所在的位置原地爆炸。
 *
 * 爆炸由脚本做（createExplosion，威力 3、不毁方块、不引火），BP 不再自带 explode 组件：
 * 引擎偶尔会把撞进方块的投掷物直接吞掉而不走 on_hit（碰撞箱越大越容易发生），
 * 脚本按“最后已知位置”补炸，保证冰弹消失就一定炸过。
 * @param ball 触发通知的冰弹实体（scriptevent 的 sourceEntity）
 * @param at 已知的最后坐标（可选，冰弹已消失时用）
 * @param dimension 冰弹所在维度（可选，冰弹已消失时用）
 */
function finishIceBall(ball, at, dimension) {
    if (!ball) return;
    let id;
    try {
        id = ball.id;
    } catch {
        return;
    }
    if (detonatedIce.has(id)) return;
    detonatedIce.add(id);

    let pos = at;
    if (!pos) {
        try {
            pos = ball.location;
        } catch {
            return;
        }
    }
    let dim = dimension;
    if (!dim) {
        try {
            dim = ball.dimension;
        } catch {
            return;
        }
    }

    try {
        dim.createExplosion(pos, 3, { breaksBlocks: false, causesFire: false });
    } catch {
        // 爆炸失败（区块未加载等）忽略
    }
    try {
        if (isAlive(ball)) ball.remove();
    } catch {
        // 已经没了
    }
}

/**
 * 冰法杖锁定目标：先走精确射线，射线没抓到就退化成锥形（12 格 / 全角 90°），
 * 避免“明明对着怪却锁不上”。
 */
function findIceTarget(player) {
    const head = player.getHeadLocation();
    const view = player.getViewDirection();
    try {
        const hit = player.dimension.getEntitiesFromRay(
            { x: head.x + view.x, y: head.y + view.y, z: head.z + view.z },
            view,
            {
                maxDistance: ICE_RANGE,
                excludeTypes: [
                    "minecraft:item",
                    "lucky:ice_projectile",
                    "lucky:bomb_ball",
                    ...NON_TARGET_TYPES,
                ],
            },
        )[0]?.entity;
        // 必须排除自己，否则在狭窄空间里射线会打到玩家自己，
        // 导致冰块锁在自己头上并给自己挂减速
        if (hit && hit.id !== player.id && isLiving(hit)
            && !NON_TARGET_TYPES.has(hit.typeId) && !isMarkerEntity(hit)) return hit;
    } catch {
        // 射线失败就交给锥形兜底
    }

    // 装饰实体黑名单只对冰弹生效：悬浮名牌/特效火焰/盔甲架不能当追踪目标；
    // 基础/吸血法杖的攻击光束走同一个 getConeTargets，但维持原版索敌不设黑名单
    const coneHits = getConeTargets(player, ICE_RANGE, ICE_CONE_ANGLE);
    return coneHits.find(
        (entity) => !NON_TARGET_TYPES.has(entity.typeId) && !isMarkerEntity(entity),
    );
}

/** 冰法杖爆炸前给玩家短暂抗性，避免被自己的爆炸炸到。 */
function protectFromOwnExplosion(player, ticks) {
    try {
        player.addEffect("resistance", ticks, { amplifier: 4, showParticles: false });
    } catch {
        // 玩家已离线，忽略
    }
}

function updateIceTracking(player, state, ticks) {
    const ice = state.iceProjectile;
    if (!isAlive(ice)) {
        // 冰块已经命中炸掉了：正常收手
        state.iceProjectile = undefined;
        endCasting(player, false);
        return;
    }

    // 锁定、弱追踪、减速都在冰块自己的飞行循环里（见 spawnIceProjectile），
    // 蓄力期间这里只负责法力结算
    if (ticks % EFFECT_INTERVAL === 0) {
        if (!canSpendManaFromSlot(player, state, ICE_MANA_PER_EFFECT)) {
            endCasting(player, true);
            return;
        }
        state.pendingMana += ICE_MANA_PER_EFFECT;
    }
}

// ---------------------------------------------------------------------------
// 二次攻击
// ---------------------------------------------------------------------------

function useSecondary(player, itemStack) {
    const config = STAFFS[itemStack.typeId];
    if (!config?.secondary) return;

    const playerId = player.id;
    const now = system.currentTick;
    if (now < (secondaryReady.get(playerId) ?? 0)) return;

    if (!spendMana(itemStack, player, config.secondaryMana)) {
        sendMessage(player, "lucky.message.staffs.notEnoughMana");
        return;
    }

    config.secondary(player);
    secondaryReady.set(playerId, now + config.secondaryCooldown);
    startCooldownDisplay(player);
}

// ---------------------------------------------------------------------------
// 事件绑定
// ---------------------------------------------------------------------------

world.afterEvents.itemStartUse.subscribe(({ itemStack, source }) => {
    if (!isStaff(itemStack)) return;
    if (source.isSneaking) return; // 潜行是二次攻击
    startCasting(source, itemStack);
});

world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (!isStaff(itemStack)) return;
    if (!source.isSneaking) return;
    useSecondary(source, itemStack);
});

function handleStopUse({ itemStack, source }) {
    // 不能只看 itemStack：施法过程中物品可能已被换走或读不出来，
    // 只认 itemStack 会让收手逻辑整个被跳过，法杖就“卡在施法状态”了。
    if (!casting.has(source.id) && !isStaff(itemStack)) return;
    endCasting(source, false);
}

world.afterEvents.itemStopUse.subscribe(handleStopUse);
world.afterEvents.itemReleaseUse.subscribe(handleStopUse);

// 投掷物的命中/销毁/超时通知（引擎检测，脚本负责收尾）：
//   lucky:bomb_hit —— 炸弹球：撒 8 个 TNT
//   lucky:ice_hit  —— 冰弹：原地 createExplosion（威力 3）
system.afterEvents.scriptEventReceive.subscribe((e) => {
    if (e.id === "lucky:bomb_hit") finishBombBall(e.sourceEntity);
    else if (e.id === "lucky:ice_hit") finishIceBall(e.sourceEntity);
});
