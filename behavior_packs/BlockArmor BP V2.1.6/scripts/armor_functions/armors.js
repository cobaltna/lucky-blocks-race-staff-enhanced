import { system, world, EntityEquippableComponent, EquipmentSlot, ItemStack, EnchantmentTypes } from "@minecraft/server";
let w = world.getDimension("overworld");
// 用于存储玩家潜行状态的Map
const sneakingPlayers = new Map();
// 仙人掌盔甲自动修复计时器
let cactusRepairTick = 0;
// 用于存储玩家玻璃盔甲耐久度的Map
const glassArmorDurability = new Map();
world.afterEvents.playerSpawn.subscribe(spawn => {
    let p = spawn.player;
    p.runCommandAsync("function scores");
});
system.runInterval(() => {
    for (let p of world.getPlayers()) {
        try {
            let equip = p.getComponent(EntityEquippableComponent.componentId);
            let glowstone = getScore(p, "glowstone");
            let ice = getScore(p, "ice");
            let prismarine = getScore(p, "prismarine");
            let slime = getScore(p, "slime");
            let obsidian = getScore(p, "obsidian");
            p.runCommandAsync("function armors");
            let head = equip.getEquipment(EquipmentSlot.Head);
            let chest = equip.getEquipment(EquipmentSlot.Chest);
            let legs = equip.getEquipment(EquipmentSlot.Legs);
            let feet = equip.getEquipment(EquipmentSlot.Feet);
            // --- 单件装备效果 ---
            if (head) {
                if (head.typeId.includes("obsidian_helmet")) addEffect(p, "resistance", 5, obsidian - 1, false);
                if (head.typeId.includes("slime_helmet")) addEffect(p, "jump_boost", 5, slime - 1, false);
                if (head.typeId.includes("prismarine_helmet")) addEffect(p, "conduit_power", 5, prismarine - 1, false);
                if (head.typeId.includes("glowstone_helmet")) p.runCommandAsync(`execute as @s positioned ~~1~ run function light${glowstone}`);
                if (!head.typeId.includes("glowstone_helmet")) p.runCommandAsync("function no_light");
            }
            if (chest) {
                if (chest.typeId.includes("obsidian_chestplate")) addEffect(p, "resistance", 5, obsidian - 1, false);
                if (chest.typeId.includes("slime_chestplate")) addEffect(p, "jump_boost", 5, slime - 1, false);
                if (chest.typeId.includes("prismarine_chestplate")) addEffect(p, "conduit_power", 5, prismarine - 1, false);
                if (chest.typeId.includes("glowstone_chestplate")) p.runCommandAsync(`execute as @s positioned ~~1~ run function light${glowstone}`);
                if (!chest.typeId.includes("glowstone_chestplate")) p.runCommandAsync("function no_light");
                // Stone/Andesite/Diorite/Granite chestplate slowness (exclude end_stone)
                if ((chest.typeId.includes("stone_chestplate") && !chest.typeId.includes("end_stone")) || chest.typeId.includes("andesite_chestplate") || chest.typeId.includes("diorite_chestplate") || chest.typeId.includes("granito_chestplate")) {
                    addEffect(p, "slowness", 5, 0, false);
                }
            }
            if (legs) {
                if (legs.typeId.includes("obsidian_leggings")) addEffect(p, "resistance", 5, obsidian - 1, false);
                if (legs.typeId.includes("slime_leggings")) addEffect(p, "jump_boost", 5, slime - 1, false);
                if (legs.typeId.includes("prismarine_leggings")) addEffect(p, "conduit_power", 5, prismarine - 1, false);
                if (legs.typeId.includes("glowstone_leggings")) p.runCommandAsync(`execute as @s positioned ~~1~ run function light${glowstone}`);
                if (!legs.typeId.includes("glowstone_leggings")) p.runCommandAsync("function no_light");
            }
            if (feet) {
                if (feet.typeId.includes("slime_boots")) addEffect(p, "jump_boost", 5, slime - 1, false);
                if (feet.typeId.includes("prismarine_boots")) addEffect(p, "conduit_power", 5, prismarine - 1, false);
                if (feet.typeId.includes("glowstone_boots")) p.runCommandAsync(`execute as @s positioned ~~1~ run function light${glowstone}`);
                if (!feet.typeId.includes("glowstone_boots")) p.runCommandAsync("function no_light");
            }
            // --- Obsidian leggings/chestplate slowness ---
            let obsidianSlownessCount = 0;
            if (legs && legs.typeId.includes("obsidian_leggings")) obsidianSlownessCount++;
            if (chest && chest.typeId.includes("obsidian_chestplate")) obsidianSlownessCount++;
            if (obsidianSlownessCount > 0) {
                addEffect(p, "slowness", 5, obsidianSlownessCount, false);
            }
            // --- 套装效果 ---
            if (head && chest && legs && feet) {
                // 寒冰套装
                if (head.typeId.includes("ice_helmet") && chest.typeId.includes("ice_chestplate") && legs.typeId.includes("ice_leggings") && feet.typeId.includes("ice_boots")) {
                    p.runCommandAsync("execute as @s if block ~~-1~ water run fill ~-2~-1~-2~2~~2 ice [] replace water []");
                    p.runCommandAsync("execute as @s if block ~1~-1~ water run fill ~-2~-1~-2~+2~~+2 ice [] replace water []");
                    p.runCommandAsync("execute as @s if block ~~-1~1 water run fill ~-2~-1~-1~+2~~+2 ice [] replace water []");
                    p.runCommandAsync("execute as @s if block ~-1~-1~ water run fill ~-2~-1~-2~+2~~+2 ice [] replace water []");
                    p.runCommandAsync("execute as @s if block ~~-1~-1 water run fill ~-2~-1~-2~+2~~+2 ice [] replace water []");
                }
                // 青金石套装 (增强版代码)
                if (head.typeId.includes("lapis_helmet") && chest.typeId.includes("lapis_chestplate") && legs.typeId.includes("lapis_leggings") && feet.typeId.includes("lapis_boots")) {
                    handleLapisEnchanting(p, equip);
                }
                // 地狱砖套装
                if (head.typeId.includes("nether_brick_helmet") && chest.typeId.includes("nether_brick_chestplate") && legs.typeId.includes("nether_brick_leggings") && feet.typeId.includes("nether_brick_boots")) {
                    addEffect(p, "fire_resistance", 5, 0, false);
                    // Check if player is in lava
                    let playerPos = p.location;
                    let inLava = false;
                    try {
                        // Check block at player's feet and body level
                        let blockFeet = w.getBlock({ x: Math.floor(playerPos.x), y: Math.floor(playerPos.y), z: Math.floor(playerPos.z) });
                        let blockBody = w.getBlock({ x: Math.floor(playerPos.x), y: Math.floor(playerPos.y + 1), z: Math.floor(playerPos.z) });
                        if ((blockFeet && blockFeet.typeId === "minecraft:lava") || (blockBody && blockBody.typeId === "minecraft:lava")) {
                            inLava = true;
                        }
                    } catch (e) {}
                    if (inLava) {
                        addEffect(p, "speed", 5, 4, false);
                    }
                }
                // 红蘑菇套装
                if (head.typeId.includes("red_mushroom_block_helmet") && chest.typeId.includes("red_mushroom_block_chestplate") && legs.typeId.includes("red_mushroom_block_leggings") && feet.typeId.includes("red_mushroom_block_boots")) {
                    let mushroom_cooldown = getScore(p, "mushroom_cooldown");
                    if (mushroom_cooldown <= 0) {
                        if (p.isSneaking) {
                            // 生成 10 个巨型红蘑菇
                            let playerPos = p.location;
                            let playerView = p.getViewDirection();
                            for (let i = 0; i < 10; i++) {
                                let distance = Math.random() * 8 + 4;
                                let angle = (Math.random() - 0.5) * Math.PI * 1.5;
                                let offsetX = Math.sin(angle) * (Math.random() * 5);
                                let offsetZ = Math.cos(angle) * (Math.random() * 5);
                                let x = playerPos.x + playerView.x * distance + offsetX;
                                let z = playerPos.z + playerView.z * distance + offsetZ;
                                let y = playerPos.y;
                                // 寻找地面
                                let foundGround = false;
                                for (let checkY = Math.floor(y) + 3; checkY > y - 10; checkY--) {
                                    try {
                                        let block = w.getBlock({ x: Math.floor(x), y: checkY, z: Math.floor(z) });
                                        if (block && block.typeId !== "minecraft:air" && block.typeId !== "minecraft:water" && block.typeId !== "minecraft:lava" && !block.typeId.includes("foliage") && !block.typeId.includes("grass")) {
                                            y = checkY + 1;
                                            foundGround = true;
                                            break;
                                        }
                                    } catch (e) {}
                                }
                                if (!foundGround) continue;
                                let baseX = Math.floor(x);
                                let baseY = Math.floor(y);
                                let baseZ = Math.floor(z);
                                let height = Math.floor(Math.random() * 3) + 4;
                                let capY = baseY + height;
                                // 生成柄和盖 (修正语法为 huge_mushroom_bits)
                                p.runCommandAsync(`fill ${baseX} ${baseY} ${baseZ} ${baseX} ${baseY + height - 1} ${baseZ} red_mushroom_block ["huge_mushroom_bits"=15] replace`);
                                p.runCommandAsync(`fill ${baseX - 1} ${capY} ${baseZ - 1} ${baseX + 1} ${capY} ${baseZ + 1} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`fill ${baseX - 2} ${capY - 1} ${baseZ - 1} ${baseX - 2} ${capY - 1} ${baseZ + 1} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`fill ${baseX + 2} ${capY - 1} ${baseZ - 1} ${baseX + 2} ${capY - 1} ${baseZ + 1} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`fill ${baseX - 1} ${capY - 1} ${baseZ - 2} ${baseX + 1} ${capY - 1} ${baseZ - 2} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`fill ${baseX - 1} ${capY - 1} ${baseZ + 2} ${baseX + 1} ${capY - 1} ${baseZ + 2} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`setblock ${baseX - 2} ${capY - 1} ${baseZ - 2} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`setblock ${baseX + 2} ${capY - 1} ${baseZ - 2} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`setblock ${baseX - 2} ${capY - 1} ${baseZ + 2} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`setblock ${baseX + 2} ${capY - 1} ${baseZ + 2} red_mushroom_block ["huge_mushroom_bits"=14] replace`);
                                p.runCommandAsync(`particle minecraft:crop_growth_emitter ${baseX} ${baseY + 2} ${baseZ}`);
                            }
                            setScore(p, "mushroom_cooldown", 20 * 20);
                            p.runCommandAsync('titleraw @s actionbar {"rawtext":[{"text":"§c蘑菇森林已生成"}]}');
                        } else {
                            p.runCommandAsync('titleraw @s actionbar {"rawtext":[{"text":"§8[§c蘑菇技能§8] §7潜行释放"}]}');
                        }
                    } else {
                        let cooldownSec = Math.ceil(mushroom_cooldown / 20);
                        p.runCommandAsync(`titleraw @s actionbar {"rawtext":[{"text":"§8[§c蘑菇技能§8] §7冷却: §f${cooldownSec}s"}]}`);
                    }
                }
            }
            if (!head && !chest && !legs && !feet) {
                p.runCommandAsync("function no_light");
            }
        } catch (e) {}
        // 蘑菇技能冷却倒计时
        let mushroom_cooldown = getScore(p, "mushroom_cooldown");
        if (mushroom_cooldown > 0) {
            setScore(p, "mushroom_cooldown", mushroom_cooldown - 1);
        }
    }
    // 仙人掌计时器递增并处理自动修复
    cactusRepairTick++;
    if (cactusRepairTick >= 100) {
        // 仙人掌盔甲自动修复耐久（每5秒恢复1点）
        for (let p of world.getPlayers()) {
            try {
                let equip = p.getComponent(EntityEquippableComponent.componentId);
                let slots = [
                    { slot: EquipmentSlot.Head, name: "cactus_helmet" },
                    { slot: EquipmentSlot.Chest, name: "cactus_chestplate" },
                    { slot: EquipmentSlot.Legs, name: "cactus_leggings" },
                    { slot: EquipmentSlot.Feet, name: "cactus_boots" }
                ];
                for (let s of slots) {
                    let item = equip.getEquipment(s.slot);
                    if (item && item.typeId.includes(s.name)) {
                        let durability = item.getComponent("minecraft:durability");
                        if (durability && durability.damage > 0) {
                            durability.damage = durability.damage - 1;
                            equip.setEquipment(s.slot, item);
                        }
                    }
                }
            } catch (e) {}
        }
        cactusRepairTick = 0;
    }
    // 玻璃盔甲破碎检测和爆炸效果
    for (let p of world.getPlayers()) {
        try {
            let equip = p.getComponent(EntityEquippableComponent.componentId);
            let playerId = p.id;
            let prevDurability = glassArmorDurability.get(playerId) || { head: -1, chest: -1, legs: -1, feet: -1 };
            let currentDurability = { head: -1, chest: -1, legs: -1, feet: -1 };
            let slots = [
                { slot: EquipmentSlot.Head, name: "glass_helmet", key: "head" },
                { slot: EquipmentSlot.Chest, name: "glass_chestplate", key: "chest" },
                { slot: EquipmentSlot.Legs, name: "glass_leggings", key: "legs" },
                { slot: EquipmentSlot.Feet, name: "glass_boots", key: "feet" }
            ];
            for (let s of slots) {
                let item = equip.getEquipment(s.slot);
                if (item && item.typeId.includes(s.name)) {
                    let durability = item.getComponent("minecraft:durability");
                    if (durability) {
                        currentDurability[s.key] = durability.maxDurability - durability.damage;
                    }
                }
            }
            // 检测是否有玻璃盔甲破碎（上一tick有耐久度，这一tick没有了）
            for (let s of slots) {
                if (prevDurability[s.key] > 0 && currentDurability[s.key] <= 0) {
                    // 玻璃盔甲破碎，触发爆炸效果
                    let pos = p.location;
                    // 播放玻璃破碎音效
                    p.runCommandAsync(`playsound random.glass @a ${pos.x} ${pos.y} ${pos.z} 1 0.8`);
                    p.runCommandAsync(`playsound block.glass.break @a ${pos.x} ${pos.y} ${pos.z} 1 1`);
                    // 显示文字提示
                    p.runCommandAsync('titleraw @s actionbar {"rawtext":[{"text":"§c§l玻璃碎片飞溅！"}]}');
                    // 粒子效果
                    p.runCommandAsync(`particle minecraft:breaking_item_icon ${pos.x} ${pos.y + 1} ${pos.z}`);
                    // 对附迗6格内的生物造成10点伤害并赋予缓慢和虚弱效果
                    let nearbyEntities = p.dimension.getEntities({ location: pos, maxDistance: 6 });
                    for (let entity of nearbyEntities) {
                        if (entity.id !== p.id) {
                            try {
                                entity.applyDamage(10);
                                addEffect(entity, "slowness", 100, 0, true);
                                addEffect(entity, "weakness", 100, 0, true);
                            } catch (e) {}
                        }
                    }
                }
            }
            glassArmorDurability.set(playerId, currentDurability);
        } catch (e) {}
    }
});
world.beforeEvents.playerBreakBlock.subscribe(block => {
    let p = block.player;
    let b = block.block;
    let equip = p.getComponent(EntityEquippableComponent.componentId);
    let hand = equip.getEquipment(EquipmentSlot.Mainhand);
    if (hand) {
        if (hand.typeId.includes("pickaxe")) {
            if (b.typeId.includes("_ore")) {
                let parts = ["head", "chest", "legs", "feet"];
                let slots = ["helmet", "chestplate", "leggings", "boots"];
                for (let slot of slots) {
                    for (let part of parts) {
                        p.runCommandAsync(`scoreboard players add @s[hasitem={item=bls:lapis_${slot},location=slot.armor.${part}}] lapis 1`);
                    }
                }
                system.runTimeout(() => {
                    let lapis = getScore(p, "lapis");
                    if (lapis > 0) {
                        for (let i = 0; i <= lapis; i++) {
                            p.runCommandAsync("summon xp_orb ~~~");
                            setScore(p, "lapis", 0);
                        }
                    }
                }, 4);
            }
        }
    }
});
// ============ 修改后的 entityHurt 事件 ============
world.afterEvents.entityHurt.subscribe(hurt => {
    try {
        let eHurt = hurt.hurtEntity;
        let damageSource = hurt.damageSource;
        let damage = Math.round(Math.floor(hurt.damage));
        let cause = damageSource.cause;
        let damaging = damageSource.damagingEntity;

        if (eHurt.typeId == "minecraft:player") {
            // --- 岩浆盔甲反伤逻辑（保持原有） ---
            let parts = ["head", "chest", "legs", "feet"];
            let slots = ["helmet", "chestplate", "leggings", "boots"];
            for (let slot of slots) {
                for (let part of parts) {
                    eHurt.runCommandAsync(`scoreboard players add @s[hasitem={item=bls:magma_${slot},location=slot.armor.${part}}] magma 1`);
                    system.runTimeout(() => {
                        let magma = getScore(eHurt, "magma");
                        if (magma > 0) {
                            damaging.runCommandAsync(`damage @s ${damage + magma}`);
                            setScore(eHurt, "magma", 0);
                        }
                    }, 1);
                }
            }

            // --- End stone armor teleport attacker ---
            if (damaging) {
                try {
                    let equipHurt = eHurt.getComponent(EntityEquippableComponent.componentId);
                    let endStoneCount = 0;
                    let headEnd = equipHurt.getEquipment(EquipmentSlot.Head);
                    let chestEnd = equipHurt.getEquipment(EquipmentSlot.Chest);
                    let legsEnd = equipHurt.getEquipment(EquipmentSlot.Legs);
                    let feetEnd = equipHurt.getEquipment(EquipmentSlot.Feet);
                    if (headEnd && headEnd.typeId.includes("end_stone_helmet")) endStoneCount++;
                    if (chestEnd && chestEnd.typeId.includes("end_stone_chestplate")) endStoneCount++;
                    if (legsEnd && legsEnd.typeId.includes("end_stone_leggings")) endStoneCount++;
                    if (feetEnd && feetEnd.typeId.includes("end_stone_boots")) endStoneCount++;
                    if (endStoneCount > 0) {
                        let teleportDistance = 5 + endStoneCount;
                        let angle = Math.random() * Math.PI * 2;
                        let dx = Math.cos(angle) * teleportDistance;
                        let dz = Math.sin(angle) * teleportDistance;
                        let damagerPos = damaging.location;
                        let newX = damagerPos.x + dx;
                        let newZ = damagerPos.z + dz;
                        damaging.teleport({ x: newX, y: damagerPos.y, z: newZ });
                    }
                } catch (e) {}
            }

            // --- 仙人掌盔甲反伤逻辑 ---
            if (damaging) {
                try {
                    let equipHurt = eHurt.getComponent(EntityEquippableComponent.componentId);
                    let cactusCount = 0;
                    let headCactus = equipHurt.getEquipment(EquipmentSlot.Head);
                    let chestCactus = equipHurt.getEquipment(EquipmentSlot.Chest);
                    let legsCactus = equipHurt.getEquipment(EquipmentSlot.Legs);
                    let feetCactus = equipHurt.getEquipment(EquipmentSlot.Feet);
                    if (headCactus && headCactus.typeId.includes("cactus_helmet")) cactusCount++;
                    if (chestCactus && chestCactus.typeId.includes("cactus_chestplate")) cactusCount++;
                    if (legsCactus && legsCactus.typeId.includes("cactus_leggings")) cactusCount++;
                    if (feetCactus && feetCactus.typeId.includes("cactus_boots")) cactusCount++;
                    if (cactusCount > 0) {
                        let thornsDamage = 5 * cactusCount;
                        damaging.applyDamage(thornsDamage);
                    }
                } catch (e) {}
            }

            // --- 寒冰盔甲冰冻攻击者逻辑（新增） ---
            if (damaging) { // 确保攻击者存在
                try {
                    let equipHurt = eHurt.getComponent(EntityEquippableComponent.componentId);
                    let iceCount = 0;

                    // 统计穿戴的寒冰盔甲件数
                    let headIce = equipHurt.getEquipment(EquipmentSlot.Head);
                    let chestIce = equipHurt.getEquipment(EquipmentSlot.Chest);
                    let legsIce = equipHurt.getEquipment(EquipmentSlot.Legs);
                    let feetIce = equipHurt.getEquipment(EquipmentSlot.Feet);

                    if (headIce && headIce.typeId.includes("ice_helmet")) iceCount++;
                    if (chestIce && chestIce.typeId.includes("ice_chestplate")) iceCount++;
                    if (legsIce && legsIce.typeId.includes("ice_leggings")) iceCount++;
                    if (feetIce && feetIce.typeId.includes("ice_boots")) iceCount++;

                    // 如果穿了至少一件寒冰盔甲
                    if (iceCount > 0) {
                        let freezeChance = iceCount * 15; // 15%, 30%, 45%, 60%
                        let randomChance = Math.random() * 100;

                        // 概率触发冰冻效果
                        if (randomChance < freezeChance) {
                            // 冰冻时长：每件0.5秒 (因为addEffect函数内部会*2，所以这里传入5*件数)
                            let freezeDuration = iceCount * 5; // 5*2=10ticks=0.5s, 10*2=20ticks=1s, 15*2=30ticks=1.5s, 20*2=40ticks=2s

                            // 施加冰冻效果（amplifier: 254 相当于等级255）
                            addEffect(damaging, "slowness", freezeDuration, 254, true);
                            addEffect(damaging, "weakness", freezeDuration, 254, true);
                            addEffect(damaging, "mining_fatigue", freezeDuration, 254, true);

                            // 添加冰蓝色粒子效果
                            let pos = damaging.location;
                            // 使用多个粒子营造冰冻效果
                            damaging.runCommandAsync(`particle minecraft:blue_flame_particle ${pos.x} ${pos.y + 1} ${pos.z}`);
                            damaging.runCommandAsync(`particle minecraft:snowflake_particle ${pos.x} ${pos.y + 1} ${pos.z}`);
                            damaging.runCommandAsync(`particle minecraft:ice_evaporation_emitter ${pos.x} ${pos.y + 0.5} ${pos.z}`);

                            // 播放冰冻音效
                            damaging.runCommandAsync(`playsound random.glass @a ${pos.x} ${pos.y} ${pos.z} 1 0.8`);
                            damaging.runCommandAsync(`playsound block.glass.break @a ${pos.x} ${pos.y} ${pos.z} 0.5 1.2`);

                            // 可选：给攻击者发送冰冻提示
                            if (damaging.typeId === "minecraft:player") {
                                damaging.runCommandAsync(`titleraw @s actionbar {"rawtext":[{"text":"§b§l❄ 你被冰冻了！❄"}]}`);
                            }
                        }
                    }
                } catch (e) {}
            }
        }
    } catch (e) {};
});
/**
 * 处理青金石套装的附魔功能
 */
function handleLapisEnchanting(player, equip) {
    let hand = equip.getEquipment(EquipmentSlot.Mainhand);
    let playerId = player.id;
    // 检查玩家是否正在潜行
    if (player.isSneaking && hand) {
        // 获取玩家之前的潜行状态
        let sneakData = sneakingPlayers.get(playerId) || { startTime: 0, hasEnchanted: false };
        if (sneakData.startTime === 0) {
            // 刚开始潜行，记录开始时间
            sneakingPlayers.set(playerId, { startTime: Date.now(), hasEnchanted: false });
        } else {
            // 正在潜行中，检查是否已经潜行足够长时间（1.5秒 = 1500毫秒）
            let sneakDuration = Date.now() - sneakData.startTime;
            if (sneakDuration >= 1500 && !sneakData.hasEnchanted && player.level >= 10) {
                // 尝试附魔
                let success = tryEnchantItem(player, hand, equip);
                if (success) {
                    // 标记已附魔，防止重复触发
                    sneakingPlayers.set(playerId, { startTime: sneakData.startTime, hasEnchanted: true });
                    // 扣除经验
                    player.runCommandAsync("xp -10L @s");
                    player.sendMessage("§a附魔成功！");
                } else {
                    sneakingPlayers.set(playerId, { startTime: sneakData.startTime, hasEnchanted: true });
                }
            }
        }
    } else {
        // 玩家停止潜行，重置状态
        sneakingPlayers.set(playerId, { startTime: 0, hasEnchanted: false });
    }
}
/**
 * 尝试给物品附魔
 */
function tryEnchantItem(player, item, equip) {
    try {
        // 获取物品的附魔组件
        let enchantable = item.getComponent("minecraft:enchantable");
        if (!enchantable) {
            player.sendMessage("§c该物品无法附魔！");
            return false;
        }
        // 基岩版附魔ID列表（maxLevel是你想要的最大等级，可超过原版）
        let allEnchantments = [
            // 护甲附魔
            { id: "protection", maxLevel: 5 },
            { id: "fire_protection", maxLevel: 5 },
            { id: "feather_falling", maxLevel: 5 },
            { id: "blast_protection", maxLevel: 5 },
            { id: "projectile_protection", maxLevel: 5 },
            { id: "respiration", maxLevel: 4 },
            { id: "aqua_affinity", maxLevel: 1 },
            { id: "thorns", maxLevel: 4 },
            { id: "depth_strider", maxLevel: 4 },
            { id: "frost_walker", maxLevel: 3 },
            { id: "soul_speed", maxLevel: 4 },
            { id: "swift_sneak", maxLevel: 4 },
            // 武器附魔
            { id: "sharpness", maxLevel: 6 },
            { id: "smite", maxLevel: 6 },
            { id: "bane_of_arthropods", maxLevel: 6 },
            { id: "knockback", maxLevel: 3 },
            { id: "fire_aspect", maxLevel: 3 },
            { id: "looting", maxLevel: 4 },
            // 工具附魔
            { id: "efficiency", maxLevel: 6 },
            { id: "silk_touch", maxLevel: 1 },
            { id: "unbreaking", maxLevel: 4 },
            { id: "fortune", maxLevel: 4 },
            { id: "mending", maxLevel: 1 },
            // 弓附魔
            { id: "power", maxLevel: 6 },
            { id: "punch", maxLevel: 3 },
            { id: "flame", maxLevel: 1 },
            { id: "infinity", maxLevel: 1 },
            // 钓鱼竿附魔
            { id: "luck_of_the_sea", maxLevel: 4 },
            { id: "lure", maxLevel: 4 },
            // 三叉戟附魔
            { id: "loyalty", maxLevel: 4 },
            { id: "impaling", maxLevel: 6 },
            { id: "riptide", maxLevel: 4 },
            { id: "channeling", maxLevel: 1 },
            // 弩附魔
            { id: "multishot", maxLevel: 1 },
            { id: "piercing", maxLevel: 5 },
            { id: "quick_charge", maxLevel: 4 },
            // 重锤附魔 (1.21新增)
            { id: "breach", maxLevel: 5 },
            { id: "density", maxLevel: 6 },
            { id: "wind_burst", maxLevel: 4 }
        ];
        // 打乱附魔列表顺序
        for (let i = allEnchantments.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [allEnchantments[i], allEnchantments[j]] = [allEnchantments[j], allEnchantments[i]];
        }
        // 遍历所有附魔，直到找到一个可以添加的
        for (let ench of allEnchantments) {
            try {
                // 使用 EnchantmentTypes.get() 获取附魔类型，修复 API 兼容性问题
                let enchType = EnchantmentTypes.get(ench.id);
                if(!enchType) continue; // 防止ID错误导致崩溃
                // 先用等级1检查该附魔是否兼容该物品
                if (enchantable.canAddEnchantment({ type: enchType, level: 1 })) {
                    // 兼容的话，生成随机等级（可超过原版上限）
                    let level = Math.floor(Math.random() * ench.maxLevel) + 1;
                    // 直接添加附魔
                    enchantable.addEnchantment({ type: enchType, level: level });
                    equip.setEquipment(EquipmentSlot.Mainhand, item);
                    player.sendMessage(`§b获得附魔: ${ench.id} ${level}级`);
                    return true;
                }
            } catch (enchantError) {
                // 该附魔不兼容，继续尝试下一个
                continue;
            }
        }
        // 所有附魔都尝试过了，都不能添加
        player.sendMessage("§c该物品不能继续被附魔！");
        return false;
    } catch (e) {
        return false;
    }
}
export function addEffect(player, effectType, duration, level, particles) {
    return player.addEffect(effectType, duration * 2, { amplifier: level, showParticles: particles }) ?? 0;
}
export function removeEffect(player, effectType) {
    return player.removeEffect(effectType) ?? 0;
}
export function getScore(player, objective) {
    return world.scoreboard.getObjective(objective)?.getScore(player) ?? 0;
}
export function setScore(player, objective, score) {
    return world.scoreboard.getObjective(objective)?.setScore(player, score) ?? 0;
}
export function addScore(player, objective, score) {
    return world.scoreboard.getObjective(objective)?.addScore(player, score) ?? 0;
}
