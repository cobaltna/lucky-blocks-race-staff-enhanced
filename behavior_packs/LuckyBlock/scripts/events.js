import { system, world, EquipmentSlot, ItemStack, TicksPerSecond } from "@minecraft/server"
import { startWitherStorm } from "./hazards"

/**
 * 稀有掉落：锋利 5 / 耐久 3 / 效率 5 的下界合金斧。
 * 附魔必须精确指定，战利品表只能随机附魔，所以直接用脚本生成物品再丢到方块位置。
 */
function giveEnchantedNetheriteAxe(player, x, y, z) {
    try {
        const stack = new ItemStack("minecraft:netherite_axe", 1)
        const enchantable = stack.getComponent("minecraft:enchantable")
        const enchants = [["sharpness", 5], ["unbreaking", 3], ["efficiency", 5]]
        for (const [name, level] of enchants) {
            // 附魔 id 带不带命名空间在不同版本上有差异，两种都试一次
            for (const type of [name, "minecraft:" + name]) {
                try {
                    enchantable.addEnchantment({ type, level })
                    break
                } catch {
                    // 换下一种写法
                }
            }
        }
        player.dimension.spawnItem(stack, { x: x + 0.5, y: y + 0.2, z: z + 0.5 })
    } catch {
        // 兜底：至少别让这次幸运方块空手
        player.runCommand(
            `execute positioned ${x} ${y} ${z} run loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`,
        )
    }
}

/**
 * 原“河豚”位置统一改成：1~2 只狼 + 2~6 根骨头。
 * 现存 3 个调用点（witheredluckyBlock / structures / entities）；水族馆那 4 处仍是河豚。
 */
function wolvesAndBones(runCommands) {
    const wolves = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < wolves; i++) runCommands("summon wolf")
    runCommands(`give @p[r=8] bone ${Math.floor(Math.random() * 5) + 2}`)
}

export function luckyBlock(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }

    const random = Math.floor(Math.random() * 281)
    if (random === 0) {
        runCommands("effect @p[r=8] jump_boost 256 14 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 1) {
        runCommands("effect @p[r=8] haste 128 6 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 2) {
        runCommands("effect @p[r=8] speed 25 15 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 3) {
        runCommands("effect @p[r=8] slowness 10 128 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 4) {
        runCommands("effect @p[r=8] nausea 18 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 5) {
        runCommands("effect @p[r=8] poison 15 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 6) {
        runCommands("effect @p[r=8] levitation 1 15 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 7) {
        runCommands("effect @p[r=8] blindness 10 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/1"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/2"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/3"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/4"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/5"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/6"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/7"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/8"`)
    else if (random === 16) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/9"`)
    else if (random === 17) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/10"`)
    else if (random === 18) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/11"`)
    else if (random === 19) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/12"`)
    else if (random === 20) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/13"`)
    else if (random === 21) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/14"`)
    else if (random === 22) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/15"`)
    else if (random === 23) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/16"`)
    else if (random === 24) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/17"`)
    else if (random === 25) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/18"`)
    else if (random === 26) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/19"`)
    else if (random === 27) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/20"`)
    else if (random === 28) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/21"`)
    else if (random === 29) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/22"`)
    else if (random === 30) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/23"`)
    else if (random === 31) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/24"`)
    else if (random === 32) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/25"`)
    else if (random === 33) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/26"`)
    else if (random === 34) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/27"`)
    else if (random === 35) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/28"`)
    else if (random === 36) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/29"`)
    else if (random === 37) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/30"`)
    else if (random === 38) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/31"`)
    else if (random === 39) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/32"`)
    else if (random === 40) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/33"`)
    else if (random === 41) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/34"`)
    else if (random === 42) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/35"`)
    else if (random === 43) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/36"`)
    else if (random === 44) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/37"`)
    else if (random === 45) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/38"`)
    else if (random === 46) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/39"`)
    else if (random === 47) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/40"`)
    else if (random === 48) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/41"`)
    else if (random === 49) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/42"`)
    else if (random === 50) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/43"`)
    else if (random === 51) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/44"`)
    else if (random === 52) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/45"`)
    else if (random === 53) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/46"`)
    else if (random === 54) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/47"`)
    else if (random === 55) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/48"`)
    else if (random === 56) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/49"`)
    else if (random === 57) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/50"`)
    else if (random === 58) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/51"`)
    else if (random === 59) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/52"`)
    else if (random === 60) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/53"`)
    else if (random === 61) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/54"`)
    else if (random === 62) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/55"`)
    else if (random === 63) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/56"`)
    else if (random === 64) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/57"`)
    else if (random === 65) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/58"`)
    else if (random === 66) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/59"`)
    else if (random === 67) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/60"`)
    else if (random === 68) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/61"`)
    else if (random === 69) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/62"`)
    else if (random === 70) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/63"`)
    else if (random === 71) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/64"`)
    else if (random === 72) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/65"`)
    else if (random === 73) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/66"`)
    else if (random === 74) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/67"`)
    else if (random === 75) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/68"`)
    else if (random === 76) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/69"`)
    else if (random === 77) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/70"`)
    else if (random === 78) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/71"`)
    else if (random === 79) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/72"`)
    else if (random === 80) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/73"`)
    else if (random === 81) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/74"`)
    else if (random === 82) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/75"`)
    else if (random === 83) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/76"`)
    else if (random === 84) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/77"`)
    else if (random === 85) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/78"`)
    else if (random === 86) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/79"`)
    else if (random === 87) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/80"`)
    else if (random === 88) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/81"`)
    else if (random === 89) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/82"`)
    else if (random === 90) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/83"`)
    else if (random === 91) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/84"`)
    else if (random === 92) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/85"`)
    else if (random === 93) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/86"`)
    else if (random === 94) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/87"`)
    else if (random === 95) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/88"`)
    else if (random === 96) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/89"`)
    else if (random === 97) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/90"`)
    else if (random === 98) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/91"`)
    else if (random === 99) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/92"`)
    else if (random === 100) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/93"`)
    else if (random === 101) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/94"`)
    else if (random === 102) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/95"`)
    else if (random === 103) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/96"`)
    else if (random === 104) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/97"`)
    else if (random === 105) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/98"`)
    else if (random === 106) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/99"`)
    else if (random === 107) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/100"`)
    else if (random === 108) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/101"`)
    else if (random === 109) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/102"`)
    else if (random === 110) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/103"`)
    else if (random === 111) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/104"`)
    else if (random === 112) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/105"`)
    else if (random === 113) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/110"`)
    else if (random === 114) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/143"`)
    else if (random === 115) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/152"`)
    else if (random === 116) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/153"`)
    else if (random === 117) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/154"`)
    else if (random === 118) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/155"`)
    else if (random === 119) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/156"`)
    else if (random === 120) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/157"`)
    else if (random === 121) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/158"`)
    else if (random === 122) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/159"`)
    else if (random === 123) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/160"`)
    else if (random === 124) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/161"`)
    else if (random === 125) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/162"`)
    else if (random === 126) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/163"`)
    else if (random === 127) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/205"`)
    else if (random === 128) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/206"`)
    else if (random === 129) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/207"`)
    else if (random === 130) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/208"`)
    else if (random === 131) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/209"`)
    else if (random === 132) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/210"`)
    else if (random === 133) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/211"`)
    else if (random === 134) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/212"`)
    else if (random === 135) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/213"`)
    else if (random === 136) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/214"`)
    else if (random === 137) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/215"`)
    else if (random === 138) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/216"`)
    else if (random === 139) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/217"`)
    else if (random === 140) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/218"`)
    else if (random === 141) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/219"`)
    else if (random === 142) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/220"`)
    else if (random === 143) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/221"`)
    else if (random === 144) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/222"`)
    else if (random === 145) {
        runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/19"`)
        runCommands("summon entity:show_name ~ ~ ~ ~ ~ minecraft:despawn_activated §l§gIron§r§7.§l§gArmor")
    }
    else if (random === 146) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/20"`)
    else if (random === 147) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/25"`)
    else if (random === 148) {
        runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/45"`)
        runCommands("summon entity:show_name ~ ~ ~ ~ ~ minecraft:despawn_activated §l§6Flame§r§7.§l§6Boots")
    }
    // 稀有装备位：锋利 5 / 耐久 3 / 效率 5 的下界合金斧（占原来 9 个 223 号池中的 1 个）
    else if (random === 149) giveEnchantedNetheriteAxe(l.player, x, y, z)
    else if (random === 150) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    else if (random === 151) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    else if (random === 152) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    else if (random === 153) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    else if (random === 154) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    else if (random === 155) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    // 额外的心：约 1/281 抽中，符合“1/256 左右”的稀有度
    else if (random === 156) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/224"`)
    // 极低概率灾难点：1/281 抽中此分支、再 1/4 命中，约合每 1124 个幸运方块一次
    else if (random === 157) {
        if (Math.random() < 0.25) startWitherStorm(l.player.dimension, { x, y, z })
        else runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/223"`)
    }
    else if (random === 158) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/abandoned_mineshaft"`)
    else if (random === 159) runCommands(`loot spawn ${x} ${y} ${z} loot "gameplay/fishing/treasure"`)
    else if (random === 160) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/desert_pyramid"`)
    else if (random === 161) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_crossing"`)
    else if (random === 162) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/pillager_outpost"`)
    else if (random === 163) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwrecksupply"`)
    else if (random === 164) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/village_two_room_house"`)
    else if (random === 165) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/end_city_treasure"`)
    else if (random === 166) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/buriedtreasure"`)
    else if (random === 167) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/jungle_temple"`)
    else if (random === 168) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/underwater_ruin_big"`)
    else if (random === 169) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/igloo_chest"`)
    else if (random === 170) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_corridor"`)
    else if (random === 171) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/nether_bridge"`)
    else if (random === 172) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwrecktreasure"`)
    else if (random === 173) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwreck"`)
    else if (random === 174) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/underwater_ruin_small"`)
    else if (random === 175) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/simple_dungeon"`)
    else if (random === 176) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_library"`)
    else if (random === 177) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/monster_room"`)
    else if (random === 178) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/spawn_bonus_chest"`)
    else if (random === 179) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/woodland_mansion"`)
    else if (random === 180) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/village_blacksmith"`)
    else if (random === 181) {
        runCommands("summon villager ~ ~2 ~")
        runCommands("summon villager ~ ~2 ~")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load villagerhouse ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load villagerhouse ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load villagerhouse ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load villagerhouse ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 182) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-1 ~-1 tnt")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~-1 ~ red_concrete")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 heavy_weighted_pressure_plate")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ air")
    }
    else if (random === 183) {
        // 一圈书架围着附魔台：出现率砍半，剩下的一半改发一把钻石剑，避免这次幸运方块空手
        if (Math.random() < 0.5) {
            runCommands("fill ~2 ~ ~2 ~-2 ~ ~-2 bookshelf")
            runCommands("fill ~1 ~ ~1 ~-1 ~ ~-1 air")
            runCommands("setblock ~ ~ ~ enchanting_table")
        }
        else runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/2"`)
    }
    else if (random === 184) runCommands("execute at @p[r=8] positioned ~~~ run structure load slimecastle ~-2 ~-1 ~-2")
    else if (random === 185) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~5 ~-1 orange_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ fire")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~40 ~ ~ ~45 ~ orange_concrete_powder")
    }
    else if (random === 186) runCommands("execute at @p[r=8] positioned ~~~ run structure load sand_pyramid ~-3 ~-1 ~-3")
    else if (random === 187) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~2 ~1 ~-1 ~ ~-1 obsidian hollow")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~1 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~-1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~-1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~ flowing_water")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ flowing_water")
    }
    else if (random === 188) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-20 ~-1 air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-20 ~1 ~-1 ~-20 ~-1 lava")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-19 ~1 ~-1 ~-19 ~-1 web")
    }
    else if (random === 189) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load sand_cube_pyramid ~-2 ~ ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~1 ~")
    }
    else if (random === 190) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load lucky_block_jail ~-2 ~ ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~1 ~")
    }
    else if (random === 191) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~6 ~-1 gray_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~6 ~ flowing_lava")
    }
    else if (random === 192) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~4 ~-1 iron_bars hollow")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~4 ~ air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~4 ~ ~ ~4 ~ flowing_lava")
    }
    else if (random === 193) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 194) runCommands("structure load fountain ~-1 ~-1 ~-1")
    else if (random === 195) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~2 ~ ~2 ~-2 ~ ~-2 fire replace air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 air replace fire")
    }
    else if (random === 196) runCommands("structure load farmlands ~-2 ~-1 ~-2")
    else if (random === 197) runCommands("structure load farmlandmelon ~-2 ~-1 ~-2")
    else if (random === 198) runCommands("fill ~1 ~-1 ~1 ~-1 3 ~-1 air")
    else if (random === 199) {
        const randomChoose = Math.floor(Math.random() * 8)
        if (randomChoose === 0) runCommands("structure load end_plant ~-2 ~-1 ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load end_plant ~-2 ~-1 ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load end_plant ~-2 ~-1 ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load end_plant ~-2 ~-1 ~-2 90_degrees")
        else if (randomChoose === 4) runCommands("structure load end_plant ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 5) runCommands("structure load end_plant ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 6) runCommands("structure load end_plant ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 7) runCommands("structure load end_plant ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 200) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 201) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load tree ~-2 ~ ~-2")
        else if (randomChoose === 1) {
            runCommands("structure load tree ~-2 ~ ~-2")
            runCommands("summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~")
        }
    }
    else if (random === 202) {
        runCommands("execute at @p[ry=-45,rym=-134,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 180_degrees")
        runCommands("execute at @p[ry=135,rym=46,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-2 ~-1 ~-1 0_degrees")
        runCommands("execute at @p[ry=45,rym=-44,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 270_degrees")
        runCommands("execute at @p[ry=180,rym=136,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[ry=-135,rym=-180,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~29 ~ ~ ~30 ~ anvil")
    }
    else if (random === 203) runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~29 ~1 ~-1 ~30 ~-1 anvil")
    else if (random === 204) {
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 205) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load jungle_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon cave_spider")
    }
    else if (random === 206) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load nether_pyramid ~-3 ~-1 ~-3")
        runCommands("effect @p[r=8] fire_resistance 12")
    }
    else if (random === 207) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load water_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon tropicalfish")
    }
    else if (random === 208) {
        runCommands("structure load bamboo_biome ~-2 ~-1 ~-2")
        runCommands("summon panda ~ ~ ~")
        runCommands("summon panda ~ ~ ~")
    }
    else if (random === 209) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load sand_castle ~-2 ~-1 ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load sand_castle ~-2 ~-1 ~-2 90_degrees")
    }
    else if (random === 210) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load color_parkour ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load color_parkour ~-2 ~ ~-2 90_degrees")
        else if (randomChoose === 2) runCommands("structure load color_parkour ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 3) runCommands("structure load color_parkour ~-2 ~ ~-2 270_degrees")
    }
    else if (random === 211) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load dungeon ~-4 ~-1 ~-4 0_degrees")
        else if (randomChoose === 1) runCommands("structure load dungeon ~-4 ~-1 ~-4 90_degrees")
    }
    else if (random === 212) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load spider_dungeon ~-3 ~ ~-3 0_degrees")
        else if (randomChoose === 1) runCommands("structure load spider_dungeon ~-3 ~ ~-3 90_degrees")
    }
    else if (random === 213) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 214) runCommands("structure load cactus ~-2 ~-1 ~-2")
    else if (random === 215) runCommands("structure load mushroom ~-2 ~ ~-2")
    else if (random === 216) runCommands("structure load jungle_biome ~-3 ~-1 ~-3")
    else if (random === 217) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load Aquarium ~-2 ~-1 ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run summon pufferfish")
    }
    else if (random === 218) runCommands("structure load terracota_tower ~ ~ ~ 0_degrees none block_by_block 1")
    else if (random === 219) runCommands("structure load lucky_block_giant ~ ~ ~ 0_degrees none block_by_block 15")
    else if (random === 220) {
        runCommands("summon entity:explode ~3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~3.2")
        runCommands("summon entity:explode ~-3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~-3.2")
        runCommands("structure load meteor1 ~-2 ~-2 ~-2")
    }
    else if (random === 221) runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    else if (random === 222) {
        runCommands("spreadplayers ~ ~ 4 16 @p")
        runCommands("playsound mob.endermen.portal @a[r=17]")
    }
    else if (random === 223) runCommands("structure load pig_stack ~~~")
    else if (random === 224) runCommands("structure load pigman_stack ~-2 ~ ~-2")
    else if (random === 225) runCommands("structure load creeper_stack ~~~")
    else if (random === 226) {
        const randomChoose = Math.floor(Math.random() * 17)
        if (randomChoose === 0) runCommands("summon creeper Dinnerbone ~ ~ ~")
        else if (randomChoose === 1) runCommands("summon wolf Dinnerbone ~ ~ ~")
        else if (randomChoose === 2) runCommands("summon cat Dinnerbone ~ ~ ~")
        else if (randomChoose === 3) runCommands("summon villager Dinnerbone ~ ~ ~")
        else if (randomChoose === 4) runCommands("summon blaze Dinnerbone ~ ~ ~")
        else if (randomChoose === 5) runCommands("summon zombie Dinnerbone ~ ~ ~")
        else if (randomChoose === 6) runCommands("summon skeleton Dinnerbone ~ ~ ~")
        else if (randomChoose === 7) runCommands("summon slime Dinnerbone ~ ~ ~")
        else if (randomChoose === 8) runCommands("summon axolotl Dinnerbone ~ ~ ~")
        else if (randomChoose === 9) runCommands("summon goat Dinnerbone ~ ~ ~")
        else if (randomChoose === 10) runCommands("summon pig Dinnerbone ~ ~ ~")
        else if (randomChoose === 11) runCommands("summon sheep Dinnerbone ~ ~ ~")
        else if (randomChoose === 12) runCommands("summon chicken Dinnerbone ~ ~ ~")
        else if (randomChoose === 13) runCommands("summon cow Dinnerbone ~ ~ ~")
        else if (randomChoose === 14) runCommands("summon turtle Dinnerbone ~ ~ ~")
        else if (randomChoose === 15) runCommands("summon enderman Dinnerbone ~ ~ ~")
        else if (randomChoose === 16) runCommands("summon horse Dinnerbone ~ ~ ~")
    }
    else if (random === 227) runCommands("summon minecraft:tnt")
    else if (random === 228) {
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
    }
    else if (random === 229) runCommands("structure load Bob ~ ~ ~")
    else if (random === 230) {
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    }
    else if (random === 231) runCommands("summon zombie ~ ~ ~ ~ ~ minecraft:zombie_giant")
    else if (random === 232) runCommands("summon tnt ~ ~ ~ ~ ~ instant_explode")
    else if (random === 233) runCommands("summon xp_bottle ~ ~ ~ ~ ~ modified_xp_bottle")
    else if (random === 234) runCommands("summon sheep jeb_ ~ ~ ~")
    else if (random === 235) {
        runCommands("summon creeper")
        runCommands("summon lightning_bolt ~ ~1.2 ~")
    }
    else if (random === 236) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon creeper")
        else if (randomChoose === 1) runCommands("summon creeper", "summon creeper")
        else if (randomChoose === 2) runCommands("summon creeper", "summon creeper", "summon creeper")
    }
    else if (random === 237) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon slime")
        else if (randomChoose === 1) runCommands("summon slime", "summon slime")
        else if (randomChoose === 2) runCommands("summon slime", "summon slime", "summon slime")
    }
    else if (random === 238) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon skeleton")
        else if (randomChoose === 1) runCommands("summon skeleton", "summon skeleton")
        else if (randomChoose === 2) runCommands("summon skeleton", "summon skeleton", "summon skeleton")
    }
    else if (random === 239) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon zombie")
        else if (randomChoose === 1) runCommands("summon zombie", "summon zombie")
        else if (randomChoose === 2) runCommands("summon zombie", "summon zombie", "summon zombie")
    }
    else if (random === 240) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon spider")
        else if (randomChoose === 1) runCommands("summon spider", "summon spider")
        else if (randomChoose === 2) runCommands("summon spider", "summon spider", "summon spider")
    }
    else if (random === 241) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cave_spider")
        else if (randomChoose === 1) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 2) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 3) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
    }
    else if (random === 242) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:pillager")
        else if (randomChoose === 1) runCommands("summon minecraft:pillager", "summon minecraft:pillager")
        else if (randomChoose === 2) runCommands("summon minecraft:pillager", "summon minecraft:pillager", "summon minecraft:pillager")
    }
    else if (random === 243) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 1) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 2) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
    }
    else if (random === 244) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon blaze")
        else if (randomChoose === 1) runCommands("summon blaze", "summon blaze")
        else if (randomChoose === 2) runCommands("summon blaze", "summon blaze", "summon blaze")
    }
    else if (random === 245) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wither_skeleton")
        else if (randomChoose === 1) runCommands("summon wither_skeleton", "summon wither_skeleton")
        else if (randomChoose === 2) runCommands("summon wither_skeleton", "summon wither_skeleton", "summon wither_skeleton")
    }
    else if (random === 246) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon evocation_illager")
        else if (randomChoose === 1) runCommands("summon evocation_illager", "summon vindicator", "summon vindicator")
    }
    else if (random === 247) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon vindicator")
        else if (randomChoose === 1) runCommands("summon vindicator ~ ~ ~ ~ ~ minecraft:start_johnny")
    }
    else if (random === 248) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon guardian")
        else if (randomChoose === 1) runCommands("summon guardian", "summon guardian")
        else if (randomChoose === 2) runCommands("summon guardian", "summon guardian", "summon guardian")
    }
    else if (random === 249) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon phantom")
        else if (randomChoose === 1) runCommands("summon phantom", "summon phantom")
        else if (randomChoose === 2) runCommands("summon phantom", "summon phantom", "summon phantom")
    }
    else if (random === 250) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ghast")
        else if (randomChoose === 1) runCommands("summon ghast", "summon ghast")
        else if (randomChoose === 2) runCommands("summon ghast", "summon ghast", "summon ghast")
    }
    else if (random === 251) {
        const randomChoose = Math.floor(Math.random() * 5)
        if (randomChoose === 0) runCommands("summon vex")
        else if (randomChoose === 1) runCommands("summon vex", "summon vex")
        else if (randomChoose === 2) runCommands("summon vex", "summon vex", "summon vex")
        else if (randomChoose === 3) runCommands("summon vex", "summon vex", "summon vex", "summon vex")
        else if (randomChoose === 4) runCommands("summon vex", "summon vex", "summon vex", "summon vex", "summon vex")
    }
    else if (random === 252) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ravager")
        else if (randomChoose === 1) runCommands("summon elder_guardian")
        else if (randomChoose === 2) runCommands("summon wither")
    }
    else if (random === 253) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon witch")
        else if (randomChoose === 1) runCommands("summon witch", "summon witch")
    }
    else if (random === 254) {
        // 原来召出河豚，改成 15 只鸡
        for (let i = 0; i < 15; i++) runCommands("summon chicken")
    }
    else if (random === 255) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon magma_cube")
        else if (randomChoose === 1) runCommands("summon magma_cube", "summon magma_cube")
        else if (randomChoose === 2) runCommands("summon magma_cube", "summon magma_cube", "summon magma_cube")
    }
    else if (random === 256) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon chicken")
        else if (randomChoose === 1) runCommands("summon chicken", "summon chicken")
        else if (randomChoose === 2) runCommands("summon chicken", "summon chicken", "summon chicken")
        else if (randomChoose === 3) runCommands("summon chicken", "summon chicken", "summon chicken", "summon chicken")
    }
    else if (random === 257) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cod")
        else if (randomChoose === 1) runCommands("summon cod", "summon cod")
        else if (randomChoose === 2) runCommands("summon cod", "summon cod", "summon cod")
        else if (randomChoose === 3) runCommands("summon cod", "summon cod", "summon cod", "summon cod")
    }
    else if (random === 258) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon pig")
        else if (randomChoose === 1) runCommands("summon pig", "summon pig")
        else if (randomChoose === 2) runCommands("summon pig", "summon pig", "summon pig")
        else if (randomChoose === 3) runCommands("summon pig", "summon pig", "summon pig", "summon pig")
    }
    else if (random === 259) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cow")
        else if (randomChoose === 1) runCommands("summon cow", "summon cow")
        else if (randomChoose === 2) runCommands("summon cow", "summon cow", "summon cow")
        else if (randomChoose === 3) runCommands("summon cow", "summon cow", "summon cow", "summon cow")
    }
    else if (random === 260) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon sheep")
        else if (randomChoose === 1) runCommands("summon sheep", "summon sheep")
        else if (randomChoose === 2) runCommands("summon sheep", "summon sheep", "summon sheep")
        else if (randomChoose === 3) runCommands("summon sheep", "summon sheep", "summon sheep", "summon sheep")
    }
    else if (random === 261) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wolf")
        else if (randomChoose === 1) runCommands("summon wolf", "summon wolf")
        else if (randomChoose === 2) runCommands("summon wolf", "summon wolf", "summon wolf")
    }
    else if (random === 262) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon cat")
        else if (randomChoose === 1) runCommands("summon cat", "summon cat")
        else if (randomChoose === 2) runCommands("summon cat", "summon cat", "summon cat")
    }
    else if (random === 263) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon parrot")
        else if (randomChoose === 1) runCommands("summon parrot", "summon parrot")
        else if (randomChoose === 2) runCommands("summon parrot", "summon parrot", "summon parrot")
        else if (randomChoose === 3) runCommands("summon parrot", "summon parrot", "summon parrot", "summon parrot")
    }
    else if (random === 264) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon rabbit")
        else if (randomChoose === 1) runCommands("summon rabbit", "summon rabbit")
        else if (randomChoose === 2) runCommands("summon rabbit", "summon rabbit", "summon rabbit")
        else if (randomChoose === 3) runCommands("summon rabbit", "summon rabbit", "summon rabbit", "summon rabbit")
    }
    else if (random === 265) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon polar_bear")
        else if (randomChoose === 1) runCommands("summon polar_bear", "summon polar_bear")
    }
    else if (random === 266) runCommands("summon wandering_trader")
    else if (random === 267) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon horse")
        else if (randomChoose === 1) runCommands("summon horse", "summon horse")
        else if (randomChoose === 2) runCommands("summon horse", "summon horse", "summon horse")
    }
    else if (random === 268) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:bee")
        else if (randomChoose === 1) runCommands("summon minecraft:bee", "summon minecraft:bee")
        else if (randomChoose === 2) runCommands("summon minecraft:bee", "summon minecraft:bee", "summon minecraft:bee")
    }
    else if (random === 269) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon fox")
        else if (randomChoose === 1) runCommands("summon fox", "summon fox")
        else if (randomChoose === 2) runCommands("summon fox", "summon fox", "summon fox")
    }
    else if (random === 270) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon panda")
        else if (randomChoose === 1) runCommands("summon panda", "summon panda")
        else if (randomChoose === 2) runCommands("summon panda", "summon panda", "summon panda")
    }
    else if (random === 271) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon turtle")
        else if (randomChoose === 1) runCommands("summon turtle", "summon turtle")
        else if (randomChoose === 2) runCommands("summon turtle", "summon turtle", "summon turtle")
    }
    else if (random === 272) runCommands("summon zombie_horse")
    else if (random === 273) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon skeleton_horse")
        else if (randomChoose === 1) runCommands("summon skeleton_horse ~ ~ ~ ~ ~ minecraft:set_trap")
    }
    else if (random === 274) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon villager")
        else if (randomChoose === 1) runCommands("summon villager", "summon villager")
        else if (randomChoose === 2) runCommands("summon villager", "summon villager", "summon villager")
    }
    else if (random === 275) {
        const randomChoose = Math.floor(Math.random() * 9)
        if (randomChoose === 0) runCommands("structure load lucky_villager1 ~ ~ ~")
        else if (randomChoose === 1) runCommands("structure load lucky_villager2 ~ ~ ~")
        else if (randomChoose === 2) runCommands("structure load lucky_villager3 ~ ~ ~")
        else if (randomChoose === 3) runCommands("structure load lucky_villager4 ~ ~ ~")
        else if (randomChoose === 4) runCommands("structure load lucky_villager5 ~ ~ ~")
        else if (randomChoose === 5) runCommands("structure load lucky_villager6 ~ ~ ~")
        else if (randomChoose === 6) runCommands("structure load lucky_villager7 ~ ~ ~")
        else if (randomChoose === 7) runCommands("structure load lucky_villager8 ~ ~ ~")
        else if (randomChoose === 8) runCommands("structure load lucky_villager9 ~ ~ ~")
    }
    else if (random === 276) runCommands("structure load slime_stack ~ ~ ~")
    else if (random === 277) runCommands("summon spawn_entity:witch_and_bats")
    else if (random === 278) runCommands("structure load magma_cube_tower ~ ~ ~")
    else if (random === 279) runCommands("structure load giant_slime ~ ~ ~")
    else if (random === 280) runCommands("structure load ghostly_horseman ~ ~ ~")
}

export function goodLuckyBlock(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }


    const random = Math.floor(Math.random() * 214)
    if (random === 0) {
        runCommands("effect @p[r=8] jump_boost 256 14 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 1) {
        runCommands("effect @p[r=8] haste 128 6 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 2) {
        runCommands("effect @p[r=8] speed 25 15 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 3) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/2"`)
    else if (random === 4) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/3"`)
    else if (random === 5) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/4"`)
    else if (random === 6) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/5"`)
    else if (random === 7) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/6"`)
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/7"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/8"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/9"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/10"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/11"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/12"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/13"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/14"`)
    else if (random === 16) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/15"`)
    else if (random === 17) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/16"`)
    else if (random === 18) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/17"`)
    else if (random === 19) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/18"`)
    else if (random === 20) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/19"`)
    else if (random === 21) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/20"`)
    else if (random === 22) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/21"`)
    else if (random === 23) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/22"`)
    else if (random === 24) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/23"`)
    else if (random === 25) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/24"`)
    else if (random === 26) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/25"`)
    else if (random === 27) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/26"`)
    else if (random === 28) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/27"`)
    else if (random === 29) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/28"`)
    else if (random === 30) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/29"`)
    else if (random === 31) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/30"`)
    else if (random === 32) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/31"`)
    else if (random === 33) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/32"`)
    else if (random === 34) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/33"`)
    else if (random === 35) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/34"`)
    else if (random === 36) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/35"`)
    else if (random === 37) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/36"`)
    else if (random === 38) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/37"`)
    else if (random === 39) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/38"`)
    else if (random === 40) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/39"`)
    else if (random === 41) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/40"`)
    else if (random === 42) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/41"`)
    else if (random === 43) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/42"`)
    else if (random === 44) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/43"`)
    else if (random === 45) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/44"`)
    else if (random === 46) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/45"`)
    else if (random === 47) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/46"`)
    else if (random === 48) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/47"`)
    else if (random === 49) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/48"`)
    else if (random === 50) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/49"`)
    else if (random === 51) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/50"`)
    else if (random === 52) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/51"`)
    else if (random === 53) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/52"`)
    else if (random === 54) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/53"`)
    else if (random === 55) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/54"`)
    else if (random === 56) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/55"`)
    else if (random === 57) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/56"`)
    else if (random === 58) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/57"`)
    else if (random === 59) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/58"`)
    else if (random === 60) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/59"`)
    else if (random === 61) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/60"`)
    else if (random === 62) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/61"`)
    else if (random === 63) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/62"`)
    else if (random === 64) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/63"`)
    else if (random === 65) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/64"`)
    else if (random === 66) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/65"`)
    else if (random === 67) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/66"`)
    else if (random === 68) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/67"`)
    else if (random === 69) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/68"`)
    else if (random === 70) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/69"`)
    else if (random === 71) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/70"`)
    else if (random === 72) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/71"`)
    else if (random === 73) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/72"`)
    else if (random === 74) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/73"`)
    else if (random === 75) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/74"`)
    else if (random === 76) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/75"`)
    else if (random === 77) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/76"`)
    else if (random === 78) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/77"`)
    else if (random === 79) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/78"`)
    else if (random === 80) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/79"`)
    else if (random === 81) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/80"`)
    else if (random === 82) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/81"`)
    else if (random === 83) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/82"`)
    else if (random === 84) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/83"`)
    else if (random === 85) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/84"`)
    else if (random === 86) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/85"`)
    else if (random === 87) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/86"`)
    else if (random === 88) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/87"`)
    else if (random === 89) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/88"`)
    else if (random === 90) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/89"`)
    else if (random === 91) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/90"`)
    else if (random === 92) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/91"`)
    else if (random === 93) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/92"`)
    else if (random === 94) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/93"`)
    else if (random === 95) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/94"`)
    else if (random === 96) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/95"`)
    else if (random === 97) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/96"`)
    else if (random === 98) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/97"`)
    else if (random === 99) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/98"`)
    else if (random === 100) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/99"`)
    else if (random === 101) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/100"`)
    else if (random === 102) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/101"`)
    else if (random === 103) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/102"`)
    else if (random === 104) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/103"`)
    else if (random === 105) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/104"`)
    else if (random === 106) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/105"`)
    else if (random === 107) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/110"`)
    else if (random === 108) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/143"`)
    else if (random === 109) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/152"`)
    else if (random === 110) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/153"`)
    else if (random === 111) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/154"`)
    else if (random === 112) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/155"`)
    else if (random === 113) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/156"`)
    else if (random === 114) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/157"`)
    else if (random === 115) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/158"`)
    else if (random === 116) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/159"`)
    else if (random === 117) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/160"`)
    else if (random === 118) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/161"`)
    else if (random === 119) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/162"`)
    else if (random === 120) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/163"`)
    else if (random === 121) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/205"`)
    else if (random === 122) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/206"`)
    else if (random === 123) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/207"`)
    else if (random === 124) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/208"`)
    else if (random === 125) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/209"`)
    else if (random === 126) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/210"`)
    else if (random === 127) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/211"`)
    else if (random === 128) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/212"`)
    else if (random === 129) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/213"`)
    else if (random === 130) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/214"`)
    else if (random === 131) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/215"`)
    else if (random === 132) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/216"`)
    else if (random === 133) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/217"`)
    else if (random === 134) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/218"`)
    else if (random === 135) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/219"`)
    else if (random === 136) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/220"`)
    else if (random === 137) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/221"`)
    else if (random === 138) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/222"`)
    else if (random === 139) {
        runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/19"`)
        runCommands("summon entity:show_name ~ ~ ~ ~ ~ minecraft:despawn_activated §l§gWooden§r§7.§l§gArmor")
    }
    else if (random === 140) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/20"`)
    else if (random === 141) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/25"`)
    else if (random === 142) {
        runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/45"`)
        runCommands("summon entity:show_name ~ ~ ~ ~ ~ minecraft:despawn_activated §l§6Flame§r§7.§l§6Boots")
    }
    else if (random === 143) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/abandoned_mineshaft"`)
    else if (random === 144) runCommands(`loot spawn ${x} ${y} ${z} loot "gameplay/fishing/treasure"`)
    else if (random === 145) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/desert_pyramid"`)
    else if (random === 146) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_crossing"`)
    else if (random === 147) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/pillager_outpost"`)
    else if (random === 148) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwrecksupply"`)
    else if (random === 149) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/village_two_room_house"`)
    else if (random === 150) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/end_city_treasure"`)
    else if (random === 151) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/buriedtreasure"`)
    else if (random === 152) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/jungle_temple"`)
    else if (random === 153) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/underwater_ruin_big"`)
    else if (random === 154) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/igloo_chest"`)
    else if (random === 155) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_corridor"`)
    else if (random === 156) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/nether_bridge"`)
    else if (random === 157) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwrecktreasure"`)
    else if (random === 158) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwreck"`)
    else if (random === 159) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/underwater_ruin_small"`)
    else if (random === 160) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/simple_dungeon"`)
    else if (random === 161) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_library"`)
    else if (random === 162) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/monster_room"`)
    else if (random === 163) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/spawn_bonus_chest"`)
    else if (random === 164) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/woodland_mansion"`)
    else if (random === 165) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/village_blacksmith"`)
    else if (random === 166) {
        runCommands("summon villager ~ ~2 ~")
        runCommands("summon villager ~ ~2 ~")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load villagerhouse ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load villagerhouse ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load villagerhouse ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load villagerhouse ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 167) {
        runCommands("fill ~2 ~ ~2 ~-2 ~ ~-2 bookshelf")
        runCommands("fill ~1 ~ ~1 ~-1 ~ ~-1 air")
        runCommands("setblock ~ ~ ~ enchanting_table")
    }
    else if (random === 168) runCommands("execute at @p[r=8] positioned ~~~ run structure load slimecastle ~-2 ~-1 ~-2")
    else if (random === 169) runCommands("execute at @p[r=8] positioned ~~~ run structure load sand_pyramid ~-3 ~-1 ~-3")
    else if (random === 170) {
runCommands("execute at @p[r=8] positioned ~~~ run structure load sand_cube_pyramid ~-2 ~ ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~1 ~")
    }
    else if (random === 171) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load lucky_block_jail ~-2 ~ ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~1 ~")
    }
    else if (random === 172) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 173) runCommands("structure load fountain ~-1 ~-1 ~-1")
    else if (random === 174) runCommands("structure load farmlands ~-2 ~-1 ~-2")
    else if (random === 175) runCommands("structure load farmlandmelon ~-2 ~-1 ~-2")
    else if (random === 176) {
        const randomChoose = Math.floor(Math.random() * 8)
        if (randomChoose === 0) runCommands("structure load end_plant ~-2 ~-1 ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load end_plant ~-2 ~-1 ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load end_plant ~-2 ~-1 ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load end_plant ~-2 ~-1 ~-2 90_degrees")
        else if (randomChoose === 4) runCommands("structure load end_plant ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 5) runCommands("structure load end_plant ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 6) runCommands("structure load end_plant ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 7) runCommands("structure load end_plant ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 177) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 178) runCommands("structure load tree ~-2 ~ ~-2")
    else if (random === 179) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load jungle_pyramid ~-3 ~-1 ~-3")
    }
    else if (random === 180) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load nether_pyramid ~-3 ~-1 ~-3")
        runCommands("effect @p[r=8] fire_resistance 30")
    }
    else if (random === 181) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load water_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon tropicalfish")
    }
    else if (random === 182) {
        runCommands("structure load bamboo_biome ~-2 ~-1 ~-2")
        runCommands("summon panda ~ ~ ~")
        runCommands("summon panda ~ ~ ~")
    }
    else if (random === 183) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load sand_castle ~-2 ~-1 ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load sand_castle ~-2 ~-1 ~-2 90_degrees")
    }
    else if (random === 184) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load color_parkour ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load color_parkour ~-2 ~ ~-2 90_degrees")
        else if (randomChoose === 2) runCommands("structure load color_parkour ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 3) runCommands("structure load color_parkour ~-2 ~ ~-2 270_degrees")
    }
    else if (random === 185) runCommands("summon sheep jeb_ ~ ~ ~")
    else if (random === 186) runCommands("structure load cactus ~-2 ~-1 ~-2")
    else if (random === 187) runCommands("structure load mushroom ~-2 ~ ~-2")
    else if (random === 188) runCommands("structure load jungle_biome ~-3 ~-1 ~-3")
    else if (random === 189) runCommands("structure load terracota_tower ~ ~ ~ 0_degrees none block_by_block 1")
    else if (random === 190) runCommands("structure load lucky_block_giant ~ ~ ~ 0_degrees none block_by_block 15")
    else if (random === 191) runCommands("structure load pig_stack ~~~")
    else if (random === 192) {
        const randomChoose = Math.floor(Math.random() * 17)
        if (randomChoose === 0) runCommands("summon creeper Dinnerbone ~ ~ ~")
        else if (randomChoose === 1) runCommands("summon wolf Dinnerbone ~ ~ ~")
        else if (randomChoose === 2) runCommands("summon cat Dinnerbone ~ ~ ~")
        else if (randomChoose === 3) runCommands("summon villager Dinnerbone ~ ~ ~")
        else if (randomChoose === 4) runCommands("summon blaze Dinnerbone ~ ~ ~")
        else if (randomChoose === 5) runCommands("summon zombie Dinnerbone ~ ~ ~")
        else if (randomChoose === 6) runCommands("summon skeleton Dinnerbone ~ ~ ~")
        else if (randomChoose === 7) runCommands("summon slime Dinnerbone ~ ~ ~")
        else if (randomChoose === 8) runCommands("summon axolotl Dinnerbone ~ ~ ~")
        else if (randomChoose === 9) runCommands("summon goat Dinnerbone ~ ~ ~")
        else if (randomChoose === 10) runCommands("summon pig Dinnerbone ~ ~ ~")
        else if (randomChoose === 11) runCommands("summon sheep Dinnerbone ~ ~ ~")
        else if (randomChoose === 12) runCommands("summon chicken Dinnerbone ~ ~ ~")
        else if (randomChoose === 13) runCommands("summon cow Dinnerbone ~ ~ ~")
        else if (randomChoose === 14) runCommands("summon turtle Dinnerbone ~ ~ ~")
        else if (randomChoose === 15) runCommands("summon enderman Dinnerbone ~ ~ ~")
        else if (randomChoose === 16) runCommands("summon horse Dinnerbone ~ ~ ~")
    }
    else if (random === 193) runCommands("summon xp_bottle ~ ~ ~ ~ ~ modified_xp_bottle")
    else if (random === 194) runCommands("summon sheep jeb_ ~ ~ ~")
    else if (random === 195) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon chicken")
        else if (randomChoose === 1) runCommands("summon chicken", "summon chicken")
        else if (randomChoose === 2) runCommands("summon chicken", "summon chicken", "summon chicken")
        else if (randomChoose === 3) runCommands("summon chicken", "summon chicken", "summon chicken", "summon chicken")
    }
    else if (random === 196) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cod")
        else if (randomChoose === 1) runCommands("summon cod", "summon cod")
        else if (randomChoose === 2) runCommands("summon cod", "summon cod", "summon cod")
        else if (randomChoose === 3) runCommands("summon cod", "summon cod", "summon cod", "summon cod")
    }
    else if (random === 197) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon pig")
        else if (randomChoose === 1) runCommands("summon pig", "summon pig")
        else if (randomChoose === 2) runCommands("summon pig", "summon pig", "summon pig")
        else if (randomChoose === 3) runCommands("summon pig", "summon pig", "summon pig", "summon pig")
    }
    else if (random === 198) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cow")
        else if (randomChoose === 1) runCommands("summon cow", "summon cow")
        else if (randomChoose === 2) runCommands("summon cow", "summon cow", "summon cow")
        else if (randomChoose === 3) runCommands("summon cow", "summon cow", "summon cow", "summon cow")
    }
    else if (random === 199) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon sheep")
        else if (randomChoose === 1) runCommands("summon sheep", "summon sheep")
        else if (randomChoose === 2) runCommands("summon sheep", "summon sheep", "summon sheep")
        else if (randomChoose === 3) runCommands("summon sheep", "summon sheep", "summon sheep", "summon sheep")
    }
    else if (random === 200) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wolf")
        else if (randomChoose === 1) runCommands("summon wolf", "summon wolf")
        else if (randomChoose === 2) runCommands("summon wolf", "summon wolf", "summon wolf")
    }
    else if (random === 201) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon cat")
        else if (randomChoose === 1) runCommands("summon cat", "summon cat")
        else if (randomChoose === 2) runCommands("summon cat", "summon cat", "summon cat")
    }
    else if (random === 202) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon parrot")
        else if (randomChoose === 1) runCommands("summon parrot", "summon parrot")
        else if (randomChoose === 2) runCommands("summon parrot", "summon parrot", "summon parrot")
        else if (randomChoose === 3) runCommands("summon parrot", "summon parrot", "summon parrot", "summon parrot")
    }
    else if (random === 203) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon rabbit")
        else if (randomChoose === 1) runCommands("summon rabbit", "summon rabbit")
        else if (randomChoose === 2) runCommands("summon rabbit", "summon rabbit", "summon rabbit")
        else if (randomChoose === 3) runCommands("summon rabbit", "summon rabbit", "summon rabbit", "summon rabbit")
    }
    else if (random === 204) runCommands("summon wandering_trader")
    else if (random === 205) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon horse")
        else if (randomChoose === 1) runCommands("summon horse", "summon horse")
        else if (randomChoose === 2) runCommands("summon horse", "summon horse", "summon horse")
    }
    else if (random === 206) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:bee")
        else if (randomChoose === 1) runCommands("summon minecraft:bee", "summon minecraft:bee")
        else if (randomChoose === 2) runCommands("summon minecraft:bee", "summon minecraft:bee", "summon minecraft:bee")
    }
    else if (random === 207) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon fox")
        else if (randomChoose === 1) runCommands("summon fox", "summon fox")
        else if (randomChoose === 2) runCommands("summon fox", "summon fox", "summon fox")
    }
    else if (random === 208) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon panda")
        else if (randomChoose === 1) runCommands("summon panda", "summon panda")
        else if (randomChoose === 2) runCommands("summon panda", "summon panda", "summon panda")
    }
    else if (random === 209) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon turtle")
        else if (randomChoose === 1) runCommands("summon turtle", "summon turtle")
        else if (randomChoose === 2) runCommands("summon turtle", "summon turtle", "summon turtle")
    }
    else if (random === 210) runCommands("summon zombie_horse")
    else if (random === 211) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon skeleton_horse")
        else if (randomChoose === 1) runCommands("summon skeleton_horse ~ ~ ~ ~ ~ minecraft:set_trap")
    }
    else if (random === 212) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon villager")
        else if (randomChoose === 1) runCommands("summon villager", "summon villager")
        else if (randomChoose === 2) runCommands("summon villager", "summon villager", "summon villager")
    }
    else if (random === 213) {
        const randomChoose = Math.floor(Math.random() * 9)
        if (randomChoose === 0) runCommands("structure load lucky_villager1 ~ ~ ~")
        else if (randomChoose === 1) runCommands("structure load lucky_villager2 ~ ~ ~")
        else if (randomChoose === 2) runCommands("structure load lucky_villager3 ~ ~ ~")
        else if (randomChoose === 3) runCommands("structure load lucky_villager4 ~ ~ ~")
        else if (randomChoose === 4) runCommands("structure load lucky_villager5 ~ ~ ~")
        else if (randomChoose === 5) runCommands("structure load lucky_villager6 ~ ~ ~")
        else if (randomChoose === 6) runCommands("structure load lucky_villager7 ~ ~ ~")
        else if (randomChoose === 7) runCommands("structure load lucky_villager8 ~ ~ ~")
        else if (randomChoose === 8) runCommands("structure load lucky_villager9 ~ ~ ~")
    }
}

export function unluckyBlock(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }

    const random = Math.floor(Math.random() * 113)
    if (random === 0) {
        runCommands("effect @p[r=8] slowness 10 128 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 1) {
        runCommands("effect @p[r=8] nausea 18 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 2) {
        runCommands("effect @p[r=8] poison 15 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 3) {
        runCommands("effect @p[r=8] levitation 1 15 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 4) {
        runCommands("effect @p[r=8] blindness 10 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 5) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/3"`)
    else if (random === 6) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/4"`)
    else if (random === 7) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/6"`)
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/10"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/11"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/13"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/14"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/16"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/17"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/18"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/22"`)
    else if (random === 16) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/23"`)
    else if (random === 17) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/24"`)
    else if (random === 18) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/26"`)
    else if (random === 19) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/27"`)
    else if (random === 20) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/28"`)
    else if (random === 21) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/31"`)
    else if (random === 22) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/32"`)
    else if (random === 23) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/33"`)
    else if (random === 24) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/34"`)
    else if (random === 25) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/43"`)
    else if (random === 26) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/47"`)
    else if (random === 27) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/49"`)
    else if (random === 28) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/52"`)
    else if (random === 29) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/53"`)
    else if (random === 30) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/57"`)
    else if (random === 31) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/59"`)
    else if (random === 32) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/62"`)
    else if (random === 33) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/63"`)
    else if (random === 34) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/64"`)
    else if (random === 35) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/67"`)
    else if (random === 36) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/68"`)
    else if (random === 37) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/70"`)
    else if (random === 38) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/72"`)
    else if (random === 39) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/73"`)
    else if (random === 40) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/77"`)
    else if (random === 41) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/78"`)
    else if (random === 42) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/79"`)
    else if (random === 43) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/80"`)
    else if (random === 44) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/81"`)
    else if (random === 45) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/82"`)
    else if (random === 46) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/83"`)
    else if (random === 47) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/86"`)
    else if (random === 48) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/87"`)
    else if (random === 49) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/89"`)
    else if (random === 50) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/91"`)
    else if (random === 51) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/96"`)
    else if (random === 52) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/101"`)
    else if (random === 53) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/102"`)
    else if (random === 54) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/103"`)
    else if (random === 55) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/105"`)
    else if (random === 56) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/110"`)
    else if (random === 57) runCommands(`loot spawn ${x} ${y} ${z} loot "gameplay/fishing/treasure"`)
    else if (random === 182) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-1 ~-1 tnt")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~-1 ~ red_concrete")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 heavy_weighted_pressure_plate")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ air")
    }
    else if (random === 58) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~5 ~-1 orange_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ fire")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~40 ~ ~ ~45 ~ orange_concrete_powder")
    }
    else if (random === 59) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~2 ~1 ~-1 ~ ~-1 obsidian hollow")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~1 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~-1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~-1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~ flowing_water")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ flowing_water")
    }
    else if (random === 60) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-20 ~-1 air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-20 ~1 ~-1 ~-20 ~-1 lava")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-19 ~1 ~-1 ~-19 ~-1 web")
    }
    else if (random === 61) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~6 ~-1 gray_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~6 ~ flowing_lava")
    }
    else if (random === 62) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~4 ~-1 iron_bars hollow")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~4 ~ air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~4 ~ ~ ~4 ~ flowing_lava")
    }
    else if (random === 63) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~2 ~ ~2 ~-2 ~ ~-2 fire replace air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 air replace fire")
    }
    else if (random === 64) runCommands("fill ~1 ~-1 ~1 ~-1 3 ~-1 air")
    else if (random === 65) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load tree ~-2 ~ ~-2")
        else if (randomChoose === 1) {
            runCommands("structure load tree ~-2 ~ ~-2")
            runCommands("summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~")
        }
    }
    else if (random === 66) {
        runCommands("execute at @p[ry=-45,rym=-134,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 180_degrees")
        runCommands("execute at @p[ry=135,rym=46,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-2 ~-1 ~-1 0_degrees")
        runCommands("execute at @p[ry=45,rym=-44,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 270_degrees")
        runCommands("execute at @p[ry=180,rym=136,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[ry=-135,rym=-180,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~29 ~ ~ ~30 ~ anvil")
    }
    else if (random === 67) runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~29 ~1 ~-1 ~30 ~-1 anvil")
    else if (random === 68) {
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 69) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load nether_pyramid ~-3 ~-1 ~-3")
        runCommands("effect @p[r=8] fire_resistance 12")
    }
    else if (random === 70) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load water_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon tropicalfish")
    }
    else if (random === 71) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load dungeon ~-4 ~-1 ~-4 0_degrees")
        else if (randomChoose === 1) runCommands("structure load dungeon ~-4 ~-1 ~-4 90_degrees")
    }
    else if (random === 72) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load spider_dungeon ~-3 ~ ~-3 0_degrees")
        else if (randomChoose === 1) runCommands("structure load spider_dungeon ~-3 ~ ~-3 90_degrees")
    }
    else if (random === 73) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 74) runCommands("structure load cactus ~-2 ~-1 ~-2")
    else if (random === 75) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load Aquarium ~-2 ~-1 ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run summon pufferfish")
    }
    else if (random === 76) {
        runCommands("summon entity:explode ~3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~3.2")
        runCommands("summon entity:explode ~-3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~-3.2")
        runCommands("structure load meteor1 ~-2 ~-2 ~-2")
    }
    else if (random === 77) runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    else if (random === 78) {
        runCommands("spreadplayers ~ ~ 4 16 @p")
        runCommands("playsound mob.endermen.portal @a[r=17]")
    }
    else if (random === 79) runCommands("structure load pigman_stack ~-2 ~ ~-2")
    else if (random === 80) runCommands("structure load creeper_stack ~~~")
    else if (random === 81) {
        const randomChoose = Math.floor(Math.random() * 6)
        if (randomChoose === 0) runCommands("summon creeper Dinnerbone ~ ~ ~")
        else if (randomChoose === 1) runCommands("summon blaze Dinnerbone ~ ~ ~")
        else if (randomChoose === 2) runCommands("summon zombie Dinnerbone ~ ~ ~")
        else if (randomChoose === 3) runCommands("summon skeleton Dinnerbone ~ ~ ~")
        else if (randomChoose === 4) runCommands("summon slime Dinnerbone ~ ~ ~")
        else if (randomChoose === 5) runCommands("summon enderman Dinnerbone ~ ~ ~")
    }
    else if (random === 82) runCommands("summon minecraft:tnt")
    else if (random === 83) {
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
    }
    else if (random === 84) runCommands("structure load Bob ~ ~ ~")
    else if (random === 85) {
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    }
    else if (random === 86) runCommands("summon zombie ~ ~ ~ ~ ~ minecraft:zombie_giant")
    else if (random === 87) runCommands("summon tnt ~ ~ ~ ~ ~ instant_explode")
    else if (random === 88) {
        runCommands("summon creeper")
        runCommands("summon lightning_bolt ~ ~1.2 ~")
    }
    else if (random === 89) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon creeper")
        else if (randomChoose === 1) runCommands("summon creeper", "summon creeper")
        else if (randomChoose === 2) runCommands("summon creeper", "summon creeper", "summon creeper")
    }
    else if (random === 90) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon slime")
        else if (randomChoose === 1) runCommands("summon slime", "summon slime")
        else if (randomChoose === 2) runCommands("summon slime", "summon slime", "summon slime")
    }
    else if (random === 91) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon skeleton")
        else if (randomChoose === 1) runCommands("summon skeleton", "summon skeleton")
        else if (randomChoose === 2) runCommands("summon skeleton", "summon skeleton", "summon skeleton")
    }
    else if (random === 92) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon zombie")
        else if (randomChoose === 1) runCommands("summon zombie", "summon zombie")
        else if (randomChoose === 2) runCommands("summon zombie", "summon zombie", "summon zombie")
    }
    else if (random === 93) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon spider")
        else if (randomChoose === 1) runCommands("summon spider", "summon spider")
        else if (randomChoose === 2) runCommands("summon spider", "summon spider", "summon spider")
    }
    else if (random === 94) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cave_spider")
        else if (randomChoose === 1) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 2) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 3) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
    }
    else if (random === 95) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:pillager")
        else if (randomChoose === 1) runCommands("summon minecraft:pillager", "summon minecraft:pillager")
        else if (randomChoose === 2) runCommands("summon minecraft:pillager", "summon minecraft:pillager", "summon minecraft:pillager")
    }
    else if (random === 96) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 1) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 2) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
    }
    else if (random === 97) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon blaze")
        else if (randomChoose === 1) runCommands("summon blaze", "summon blaze")
        else if (randomChoose === 2) runCommands("summon blaze", "summon blaze", "summon blaze")
    }
    else if (random === 98) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wither_skeleton")
        else if (randomChoose === 1) runCommands("summon wither_skeleton", "summon wither_skeleton")
        else if (randomChoose === 2) runCommands("summon wither_skeleton", "summon wither_skeleton", "summon wither_skeleton")
    }
    else if (random === 99) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon evocation_illager")
        else if (randomChoose === 1) runCommands("summon evocation_illager", "summon vindicator", "summon vindicator")
    }
    else if (random === 100) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon vindicator")
        else if (randomChoose === 1) runCommands("summon vindicator ~ ~ ~ ~ ~ minecraft:start_johnny")
    }
    else if (random === 101) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon guardian")
        else if (randomChoose === 1) runCommands("summon guardian", "summon guardian")
        else if (randomChoose === 2) runCommands("summon guardian", "summon guardian", "summon guardian")
    }
    else if (random === 102) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon phantom")
        else if (randomChoose === 1) runCommands("summon phantom", "summon phantom")
        else if (randomChoose === 2) runCommands("summon phantom", "summon phantom", "summon phantom")
    }
    else if (random === 103) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ghast")
        else if (randomChoose === 1) runCommands("summon ghast", "summon ghast")
        else if (randomChoose === 2) runCommands("summon ghast", "summon ghast", "summon ghast")
    }
    else if (random === 104) {
        const randomChoose = Math.floor(Math.random() * 5)
        if (randomChoose === 0) runCommands("summon vex")
        else if (randomChoose === 1) runCommands("summon vex", "summon vex")
        else if (randomChoose === 2) runCommands("summon vex", "summon vex", "summon vex")
        else if (randomChoose === 3) runCommands("summon vex", "summon vex", "summon vex", "summon vex")
        else if (randomChoose === 4) runCommands("summon vex", "summon vex", "summon vex", "summon vex", "summon vex")
    }
    else if (random === 105) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ravager")
        else if (randomChoose === 1) runCommands("summon elder_guardian")
        else if (randomChoose === 2) runCommands("summon wither")
    }
    else if (random === 106) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon witch")
        else if (randomChoose === 1) runCommands("summon witch", "summon witch")
    }
    else if (random === 107) {
        wolvesAndBones(runCommands)
    }
    else if (random === 108) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon magma_cube")
        else if (randomChoose === 1) runCommands("summon magma_cube", "summon magma_cube")
        else if (randomChoose === 2) runCommands("summon magma_cube", "summon magma_cube", "summon magma_cube")
    }
    else if (random === 109) runCommands("structure load slime_stack ~ ~ ~")
    else if (random === 110) runCommands("summon spawn_entity:witch_and_bats")
    else if (random === 111) runCommands("structure load magma_cube_tower ~ ~ ~")
    else if (random === 112) runCommands("structure load giant_slime ~ ~ ~")
    else if (random === 113) runCommands("structure load ghostly_horseman ~ ~ ~")
}

export function witheredluckyBlock(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }

    const random = Math.floor(Math.random() * 72)
    if (random === 0) {
        runCommands("effect @p[r=8] slowness 10 128 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 1) {
        runCommands("effect @p[r=8] nausea 18 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 2) {
        runCommands("effect @p[r=8] poison 15 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 3) {
        runCommands("effect @p[r=8] levitation 1 15 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 4) {
        runCommands("effect @p[r=8] blindness 10 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 5) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/111"`)
    else if (random === 6) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/112"`)
    else if (random === 7) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/113"`)
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/114"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/114"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/115"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/116"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/117"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/118"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/119"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/120"`)

    else if (random === 16) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-1 ~-1 tnt")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~-1 ~ red_concrete")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 heavy_weighted_pressure_plate")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ air")
    }
    else if (random === 17) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~5 ~-1 orange_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ fire")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~40 ~ ~ ~45 ~ orange_concrete_powder")
    }
    else if (random === 18) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~2 ~1 ~-1 ~ ~-1 obsidian hollow")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~1 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~-1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~-1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~ flowing_water")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ flowing_water")
    }
    else if (random === 19) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-20 ~-1 air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-20 ~1 ~-1 ~-20 ~-1 lava")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-19 ~1 ~-1 ~-19 ~-1 web")
    }
    else if (random === 20) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~6 ~-1 gray_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~6 ~ flowing_lava")
    }
    else if (random === 21) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~4 ~-1 iron_bars hollow")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~4 ~ air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~4 ~ ~ ~4 ~ flowing_lava")
    }
    else if (random === 22) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~2 ~ ~2 ~-2 ~ ~-2 fire replace air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 air replace fire")
    }
    else if (random === 23) runCommands("fill ~1 ~-1 ~1 ~-1 3 ~-1 air")
    else if (random === 24) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load tree ~-2 ~ ~-2")
        else if (randomChoose === 1) {
            runCommands("structure load tree ~-2 ~ ~-2")
            runCommands("summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~")
        }
    }
    else if (random === 25) {
        runCommands("execute at @p[ry=-45,rym=-134,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 180_degrees")
        runCommands("execute at @p[ry=135,rym=46,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-2 ~-1 ~-1 0_degrees")
        runCommands("execute at @p[ry=45,rym=-44,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 270_degrees")
        runCommands("execute at @p[ry=180,rym=136,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[ry=-135,rym=-180,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~29 ~ ~ ~30 ~ anvil")
    }
    else if (random === 26) runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~29 ~1 ~-1 ~30 ~-1 anvil")
    else if (random === 27) {
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 28) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load nether_pyramid ~-3 ~-1 ~-3")
        runCommands("effect @p[r=8] fire_resistance 12")
    }
    else if (random === 29) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load water_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon tropicalfish")
    }
    else if (random === 30) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load dungeon ~-4 ~-1 ~-4 0_degrees")
        else if (randomChoose === 1) runCommands("structure load dungeon ~-4 ~-1 ~-4 90_degrees")
    }
    else if (random === 31) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load spider_dungeon ~-3 ~ ~-3 0_degrees")
        else if (randomChoose === 1) runCommands("structure load spider_dungeon ~-3 ~ ~-3 90_degrees")
    }
    else if (random === 32) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 33) runCommands("structure load cactus ~-2 ~-1 ~-2")
    else if (random === 34) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load Aquarium ~-2 ~-1 ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run summon pufferfish")
    }
    else if (random === 35) {
        runCommands("summon entity:explode ~3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~3.2")
        runCommands("summon entity:explode ~-3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~-3.2")
        runCommands("structure load meteor1 ~-2 ~-2 ~-2")
    }
    else if (random === 36) runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    else if (random === 37) {
        runCommands("spreadplayers ~ ~ 50 100 @p")
        runCommands("playsound mob.endermen.portal @a[r=17]")
    }
    else if (random === 38) runCommands("structure load pigman_stack ~-2 ~ ~-2")
    else if (random === 39) runCommands("structure load creeper_stack ~~~")
    else if (random === 40) {
        const randomChoose = Math.floor(Math.random() * 6)
        if (randomChoose === 0) runCommands("summon creeper Dinnerbone ~ ~ ~")
        else if (randomChoose === 1) runCommands("summon blaze Dinnerbone ~ ~ ~")
        else if (randomChoose === 2) runCommands("summon zombie Dinnerbone ~ ~ ~")
        else if (randomChoose === 3) runCommands("summon skeleton Dinnerbone ~ ~ ~")
        else if (randomChoose === 4) runCommands("summon slime Dinnerbone ~ ~ ~")
        else if (randomChoose === 5) runCommands("summon enderman Dinnerbone ~ ~ ~")
    }
    else if (random === 41) runCommands("summon minecraft:tnt")
    else if (random === 42) {
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
    }
    else if (random === 43) runCommands("structure load Bob ~ ~ ~")
    else if (random === 44) {
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    }
    else if (random === 45) runCommands("summon zombie ~ ~ ~ ~ ~ minecraft:zombie_giant")
    else if (random === 46) runCommands("summon tnt ~ ~ ~ ~ ~ instant_explode")
    else if (random === 47) {
        runCommands("summon creeper")
        runCommands("summon lightning_bolt ~ ~1.2 ~")
    }
    else if (random === 48) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon creeper")
        else if (randomChoose === 1) runCommands("summon creeper", "summon creeper")
        else if (randomChoose === 2) runCommands("summon creeper", "summon creeper", "summon creeper")
    }
    else if (random === 49) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon slime")
        else if (randomChoose === 1) runCommands("summon slime", "summon slime")
        else if (randomChoose === 2) runCommands("summon slime", "summon slime", "summon slime")
    }
    else if (random === 50) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon skeleton")
        else if (randomChoose === 1) runCommands("summon skeleton", "summon skeleton")
        else if (randomChoose === 2) runCommands("summon skeleton", "summon skeleton", "summon skeleton")
    }
    else if (random === 51) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon zombie")
        else if (randomChoose === 1) runCommands("summon zombie", "summon zombie")
        else if (randomChoose === 2) runCommands("summon zombie", "summon zombie", "summon zombie")
    }
    else if (random === 52) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon spider")
        else if (randomChoose === 1) runCommands("summon spider", "summon spider")
        else if (randomChoose === 2) runCommands("summon spider", "summon spider", "summon spider")
    }
    else if (random === 53) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cave_spider")
        else if (randomChoose === 1) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 2) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 3) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
    }
    else if (random === 54) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:pillager")
        else if (randomChoose === 1) runCommands("summon minecraft:pillager", "summon minecraft:pillager")
        else if (randomChoose === 2) runCommands("summon minecraft:pillager", "summon minecraft:pillager", "summon minecraft:pillager")
    }
    else if (random === 55) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 1) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 2) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
    }
    else if (random === 56) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon blaze")
        else if (randomChoose === 1) runCommands("summon blaze", "summon blaze")
        else if (randomChoose === 2) runCommands("summon blaze", "summon blaze", "summon blaze")
    }
    else if (random === 57) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wither_skeleton")
        else if (randomChoose === 1) runCommands("summon wither_skeleton", "summon wither_skeleton")
        else if (randomChoose === 2) runCommands("summon wither_skeleton", "summon wither_skeleton", "summon wither_skeleton")
    }
    else if (random === 58) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon evocation_illager")
        else if (randomChoose === 1) runCommands("summon evocation_illager", "summon vindicator", "summon vindicator")
    }
    else if (random === 59) runCommands("summon vindicator ~ ~ ~ ~ ~ minecraft:start_johnny")
    else if (random === 60) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon guardian")
        else if (randomChoose === 1) runCommands("summon guardian", "summon guardian")
        else if (randomChoose === 2) runCommands("summon guardian", "summon guardian", "summon guardian")
    }
    else if (random === 61) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon phantom")
        else if (randomChoose === 1) runCommands("summon phantom", "summon phantom")
        else if (randomChoose === 2) runCommands("summon phantom", "summon phantom", "summon phantom")
    }
    else if (random === 62) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ghast")
        else if (randomChoose === 1) runCommands("summon ghast", "summon ghast")
        else if (randomChoose === 2) runCommands("summon ghast", "summon ghast", "summon ghast")
    }
    else if (random === 63) {
        const randomChoose = Math.floor(Math.random() * 5)
        if (randomChoose === 0) runCommands("summon vex")
        else if (randomChoose === 1) runCommands("summon vex", "summon vex")
        else if (randomChoose === 2) runCommands("summon vex", "summon vex", "summon vex")
        else if (randomChoose === 3) runCommands("summon vex", "summon vex", "summon vex", "summon vex")
        else if (randomChoose === 4) runCommands("summon vex", "summon vex", "summon vex", "summon vex", "summon vex")
    }
    else if (random === 64) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ravager")
        else if (randomChoose === 1) runCommands("summon elder_guardian")
        else if (randomChoose === 2) runCommands("summon wither")
    }
    else if (random === 65) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon witch")
        else if (randomChoose === 1) runCommands("summon witch", "summon witch")
    }
    else if (random === 66) {
        wolvesAndBones(runCommands)
    }
    else if (random === 67) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon magma_cube")
        else if (randomChoose === 1) runCommands("summon magma_cube", "summon magma_cube")
        else if (randomChoose === 2) runCommands("summon magma_cube", "summon magma_cube", "summon magma_cube")
    }
    else if (random === 68) runCommands("structure load slime_stack ~ ~ ~")
    else if (random === 69) runCommands("summon spawn_entity:witch_and_bats")
    else if (random === 70) runCommands("structure load magma_cube_tower ~ ~ ~")
    else if (random === 71) runCommands("structure load giant_slime ~ ~ ~")
    else if (random === 72) runCommands("structure load ghostly_horseman ~ ~ ~")
}

export function structures(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 40)
    if (random === 0) {
        runCommands("summon villager ~ ~2 ~")
        runCommands("summon villager ~ ~2 ~")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load villagerhouse ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load villagerhouse ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load villagerhouse ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load villagerhouse ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 1) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-1 ~-1 tnt")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~-1 ~ red_concrete")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 heavy_weighted_pressure_plate")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ air")
    }
    else if (random === 2) {
        runCommands("fill ~2 ~ ~2 ~-2 ~ ~-2 bookshelf")
        runCommands("fill ~1 ~ ~1 ~-1 ~ ~-1 air")
        runCommands("setblock ~ ~ ~ enchanting_table")
    }
    else if (random === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load slimecastle ~-2 ~-1 ~-2")
    else if (random === 4) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~5 ~-1 orange_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ fire")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~40 ~ ~ ~45 ~ orange_concrete_powder")
    }
    else if (random === 5) runCommands("execute at @p[r=8] positioned ~~~ run structure load sand_pyramid ~-3 ~-1 ~-3")
    else if (random === 6) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~2 ~1 ~-1 ~ ~-1 obsidian hollow")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~1 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~-1 glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~-1 ~1 ~ glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~1 ~ flowing_water")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ flowing_water")
    }
    else if (random === 7) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-20 ~-1 air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-20 ~1 ~-1 ~-20 ~-1 lava")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-19 ~1 ~-1 ~-19 ~-1 web")
    }
    else if (random === 8) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load sand_cube_pyramid ~-2 ~ ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~1 ~")
    }
    else if (random === 9) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load lucky_block_jail ~-2 ~ ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~1 ~")
    }
    else if (random === 10) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~6 ~-1 gray_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~6 ~ flowing_lava")
    }
    else if (random === 11) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~4 ~-1 iron_bars hollow")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~4 ~ air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~4 ~ ~ ~4 ~ flowing_lava")
    }
    else if (random === 12) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load playerhouse ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 13) runCommands("structure load fountain ~-1 ~-1 ~-1")
    else if (random === 14) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~2 ~ ~2 ~-2 ~ ~-2 fire replace air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 air replace fire")
    }
    else if (random === 15) runCommands("structure load farmlands ~-2 ~-1 ~-2")
    else if (random === 16) runCommands("structure load farmlandmelon ~-2 ~-1 ~-2")
    else if (random === 17) runCommands("fill ~1 ~-1 ~1 ~-1 3 ~-1 air")
    else if (random === 18) {
        const randomChoose = Math.floor(Math.random() * 8)
        if (randomChoose === 0) runCommands("structure load end_plant ~-2 ~-1 ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load end_plant ~-2 ~-1 ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load end_plant ~-2 ~-1 ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load end_plant ~-2 ~-1 ~-2 90_degrees")
        else if (randomChoose === 4) runCommands("structure load end_plant ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 5) runCommands("structure load end_plant ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 6) runCommands("structure load end_plant ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 7) runCommands("structure load end_plant ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 19) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load dirt_house ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 20) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load tree ~-2 ~ ~-2")
        else if (randomChoose === 1) {
            runCommands("structure load tree ~-2 ~ ~-2")
            runCommands("summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~", "summon minecraft:tnt ~~3~")
        }
    }
    else if (random === 21) {
        runCommands("execute at @p[ry=-45,rym=-134,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 180_degrees")
        runCommands("execute at @p[ry=135,rym=46,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-2 ~-1 ~-1 0_degrees")
        runCommands("execute at @p[ry=45,rym=-44,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 270_degrees")
        runCommands("execute at @p[ry=180,rym=136,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[ry=-135,rym=-180,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~29 ~ ~ ~30 ~ anvil")
    }
    else if (random === 22) runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~29 ~1 ~-1 ~30 ~-1 anvil")
    else if (random === 23) {
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")
        runCommands("execute at @p[r=8] positioned ~~~ run summon skeleton")

        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load skeleton_jail ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 24) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load jungle_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon cave_spider")
    }
    else if (random === 25) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load nether_pyramid ~-3 ~-1 ~-3")
        runCommands("effect @p[r=8] fire_resistance 12")
    }
    else if (random === 26) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load water_pyramid ~-3 ~-1 ~-3")
        runCommands("execute at @p[r=8] positioned ~~~ run summon tropicalfish")
    }
    else if (random === 27) {
        runCommands("structure load bamboo_biome ~-2 ~-1 ~-2")
        runCommands("summon panda ~ ~ ~")
        runCommands("summon panda ~ ~ ~")
    }
    else if (random === 28) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load sand_castle ~-2 ~-1 ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load sand_castle ~-2 ~-1 ~-2 90_degrees")
    }
    else if (random === 29) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load color_parkour ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load color_parkour ~-2 ~ ~-2 90_degrees")
        else if (randomChoose === 2) runCommands("structure load color_parkour ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 3) runCommands("structure load color_parkour ~-2 ~ ~-2 270_degrees")
    }
    else if (random === 30) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load dungeon ~-4 ~-1 ~-4 0_degrees")
        else if (randomChoose === 1) runCommands("structure load dungeon ~-4 ~-1 ~-4 90_degrees")
    }
    else if (random === 31) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("structure load spider_dungeon ~-3 ~ ~-3 0_degrees")
        else if (randomChoose === 1) runCommands("structure load spider_dungeon ~-3 ~ ~-3 90_degrees")
    }
    else if (random === 32) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("execute at @p[r=8] positioned ~~~ run structure load tnt_house ~-2 ~ ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~~~ run tp @s ~ ~2 ~")
    }
    else if (random === 33) runCommands("structure load cactus ~-2 ~-1 ~-2")
    else if (random === 34) runCommands("structure load mushroom ~-2 ~ ~-2")
    else if (random === 35) runCommands("structure load jungle_biome ~-3 ~-1 ~-3")
    else if (random === 36) {
        runCommands("execute at @p[r=8] positioned ~~~ run structure load Aquarium ~-2 ~-1 ~-2")
        runCommands("execute at @p[r=8] positioned ~~~ run summon pufferfish")
    }
    else if (random === 37) runCommands("structure load terracota_tower ~ ~ ~ 0_degrees none block_by_block 1")
    else if (random === 38) runCommands("structure load lucky_block_giant ~ ~ ~ 0_degrees none block_by_block 15")
    else if (random === 39) {
        runCommands("summon entity:explode ~3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~3.2")
        runCommands("summon entity:explode ~-3.2 ~ ~")
        runCommands("summon entity:explode ~ ~ ~-3.2")
        runCommands("structure load meteor1 ~-2 ~-2 ~-2")
    }
}

export function itemDrops(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 164)
    if (random === 0) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/1"`)
    else if (random === 1) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/2"`)
    else if (random === 2) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/3"`)
    else if (random === 3) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/4"`)
    else if (random === 4) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/5"`)
    else if (random === 5) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/6"`)
    else if (random === 6) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/7"`)
    else if (random === 7) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/8"`)
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/9"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/10"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/11"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/12"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/13"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/14"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/15"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/16"`)
    else if (random === 16) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/17"`)
    else if (random === 17) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/18"`)
    else if (random === 18) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/19"`)
    else if (random === 19) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/20"`)
    else if (random === 20) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/21"`)
    else if (random === 21) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/22"`)
    else if (random === 22) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/23"`)
    else if (random === 23) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/24"`)
    else if (random === 24) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/25"`)
    else if (random === 25) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/26"`)
    else if (random === 26) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/27"`)
    else if (random === 27) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/28"`)
    else if (random === 28) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/29"`)
    else if (random === 29) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/30"`)
    else if (random === 30) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/31"`)
    else if (random === 31) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/32"`)
    else if (random === 32) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/33"`)
    else if (random === 33) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/34"`)
    else if (random === 34) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/35"`)
    else if (random === 35) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/36"`)
    else if (random === 36) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/37"`)
    else if (random === 37) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/38"`)
    else if (random === 38) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/39"`)
    else if (random === 39) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/40"`)
    else if (random === 40) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/41"`)
    else if (random === 41) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/42"`)
    else if (random === 42) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/43"`)
    else if (random === 43) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/44"`)
    else if (random === 44) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/45"`)
    else if (random === 45) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/46"`)
    else if (random === 46) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/47"`)
    else if (random === 47) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/48"`)
    else if (random === 48) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/49"`)
    else if (random === 49) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/50"`)
    else if (random === 50) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/51"`)
    else if (random === 51) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/52"`)
    else if (random === 52) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/53"`)
    else if (random === 53) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/54"`)
    else if (random === 54) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/55"`)
    else if (random === 55) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/56"`)
    else if (random === 56) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/57"`)
    else if (random === 57) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/58"`)
    else if (random === 58) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/59"`)
    else if (random === 59) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/60"`)
    else if (random === 60) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/61"`)
    else if (random === 61) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/62"`)
    else if (random === 62) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/63"`)
    else if (random === 63) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/64"`)
    else if (random === 64) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/65"`)
    else if (random === 65) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/66"`)
    else if (random === 66) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/67"`)
    else if (random === 67) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/68"`)
    else if (random === 68) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/69"`)
    else if (random === 69) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/70"`)
    else if (random === 70) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/71"`)
    else if (random === 71) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/72"`)
    else if (random === 72) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/73"`)
    else if (random === 73) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/74"`)
    else if (random === 74) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/75"`)
    else if (random === 75) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/76"`)
    else if (random === 76) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/77"`)
    else if (random === 77) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/78"`)
    else if (random === 78) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/79"`)
    else if (random === 79) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/80"`)
    else if (random === 80) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/81"`)
    else if (random === 81) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/82"`)
    else if (random === 82) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/83"`)
    else if (random === 83) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/84"`)
    else if (random === 84) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/85"`)
    else if (random === 85) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/86"`)
    else if (random === 86) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/87"`)
    else if (random === 87) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/88"`)
    else if (random === 88) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/89"`)
    else if (random === 89) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/90"`)
    else if (random === 90) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/91"`)
    else if (random === 91) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/92"`)
    else if (random === 92) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/93"`)
    else if (random === 93) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/94"`)
    else if (random === 94) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/95"`)
    else if (random === 95) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/96"`)
    else if (random === 96) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/97"`)
    else if (random === 97) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/98"`)
    else if (random === 98) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/99"`)
    else if (random === 99) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/100"`)
    else if (random === 100) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/101"`)
    else if (random === 101) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/102"`)
    else if (random === 102) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/103"`)
    else if (random === 103) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/104"`)
    else if (random === 104) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/105"`)
    else if (random === 105) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/110"`)
    else if (random === 106) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/143"`)
    else if (random === 107) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/152"`)
    else if (random === 108) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/153"`)
    else if (random === 109) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/154"`)
    else if (random === 110) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/155"`)
    else if (random === 111) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/156"`)
    else if (random === 112) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/157"`)
    else if (random === 113) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/158"`)
    else if (random === 114) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/159"`)
    else if (random === 115) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/160"`)
    else if (random === 116) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/161"`)
    else if (random === 117) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/162"`)
    else if (random === 118) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/163"`)
    else if (random === 119) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/205"`)
    else if (random === 120) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/206"`)
    else if (random === 121) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/207"`)
    else if (random === 122) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/208"`)
    else if (random === 123) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/209"`)
    else if (random === 124) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/210"`)
    else if (random === 125) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/211"`)
    else if (random === 126) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/212"`)
    else if (random === 127) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/213"`)
    else if (random === 128) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/214"`)
    else if (random === 129) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/215"`)
    else if (random === 130) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/216"`)
    else if (random === 131) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/217"`)
    else if (random === 132) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/218"`)
    else if (random === 133) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/219"`)
    else if (random === 134) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/220"`)
    else if (random === 135) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/221"`)
    else if (random === 136) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/222"`)
    else if (random === 137) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/19"`)
    else if (random === 138) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/20"`)
    else if (random === 139) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/25"`)
    else if (random === 140) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/45"`)
    else if (random === 141) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/abandoned_mineshaft"`)
    else if (random === 142) runCommands(`loot spawn ${x} ${y} ${z} loot "gameplay/fishing/treasure"`)
    else if (random === 143) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/desert_pyramid"`)
    else if (random === 144) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_crossing"`)
    else if (random === 145) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/pillager_outpost"`)
    else if (random === 146) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwrecksupply"`)
    else if (random === 147) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/village_two_room_house"`)
    else if (random === 148) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/end_city_treasure"`)
    else if (random === 149) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/buriedtreasure"`)
    else if (random === 150) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/jungle_temple"`)
    else if (random === 151) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/underwater_ruin_big"`)
    else if (random === 152) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/igloo_chest"`)
    else if (random === 153) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_corridor"`)
    else if (random === 154) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/nether_bridge"`)
    else if (random === 155) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwrecktreasure"`)
    else if (random === 156) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/shipwreck"`)
    else if (random === 157) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/underwater_ruin_small"`)
    else if (random === 158) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/simple_dungeon"`)
    else if (random === 159) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/stronghold_library"`)
    else if (random === 160) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/monster_room"`)
    else if (random === 161) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/spawn_bonus_chest"`)
    else if (random === 162) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/woodland_mansion"`)
    else if (random === 163) runCommands(`loot spawn ${x} ${y} ${z} loot "chests/village_blacksmith"`)
}

export function entities(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 58)
    if (random === 0) runCommands("structure load pig_stack ~~~")
    else if (random === 1) runCommands("structure load pigman_stack ~-2 ~ ~-2")
    else if (random === 2) runCommands("structure load creeper_stack ~~~")
    else if (random === 3) {
        const randomChoose = Math.floor(Math.random() * 17)
        if (randomChoose === 0) runCommands("summon creeper Dinnerbone ~ ~ ~")
        else if (randomChoose === 1) runCommands("summon wolf Dinnerbone ~ ~ ~")
        else if (randomChoose === 2) runCommands("summon cat Dinnerbone ~ ~ ~")
        else if (randomChoose === 3) runCommands("summon villager Dinnerbone ~ ~ ~")
        else if (randomChoose === 4) runCommands("summon blaze Dinnerbone ~ ~ ~")
        else if (randomChoose === 5) runCommands("summon zombie Dinnerbone ~ ~ ~")
        else if (randomChoose === 6) runCommands("summon skeleton Dinnerbone ~ ~ ~")
        else if (randomChoose === 7) runCommands("summon slime Dinnerbone ~ ~ ~")
        else if (randomChoose === 8) runCommands("summon axolotl Dinnerbone ~ ~ ~")
        else if (randomChoose === 9) runCommands("summon goat Dinnerbone ~ ~ ~")
        else if (randomChoose === 10) runCommands("summon pig Dinnerbone ~ ~ ~")
        else if (randomChoose === 11) runCommands("summon sheep Dinnerbone ~ ~ ~")
        else if (randomChoose === 12) runCommands("summon chicken Dinnerbone ~ ~ ~")
        else if (randomChoose === 13) runCommands("summon cow Dinnerbone ~ ~ ~")
        else if (randomChoose === 14) runCommands("summon turtle Dinnerbone ~ ~ ~")
        else if (randomChoose === 15) runCommands("summon enderman Dinnerbone ~ ~ ~")
        else if (randomChoose === 16) runCommands("summon horse Dinnerbone ~ ~ ~")
    }
    else if (random === 4) runCommands("summon minecraft:tnt")
    else if (random === 5) {
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
    }
    else if (random === 6) runCommands("structure load Bob ~ ~ ~")
    else if (random === 7) {
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    }
    else if (random === 8) runCommands("summon zombie ~ ~ ~ ~ ~ minecraft:zombie_giant")
    else if (random === 9) runCommands("summon tnt ~ ~ ~ ~ ~ instant_explode")
    else if (random === 10) runCommands("summon xp_bottle ~ ~ ~ ~ ~ modified_xp_bottle")
    else if (random === 11) runCommands("summon sheep jeb_ ~ ~ ~")
    else if (random === 12) {
        runCommands("summon creeper")
        runCommands("summon lightning_bolt ~ ~1.2 ~")
    }
    else if (random === 13) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon creeper")
        else if (randomChoose === 1) runCommands("summon creeper", "summon creeper")
        else if (randomChoose === 2) runCommands("summon creeper", "summon creeper", "summon creeper")
    }
    else if (random === 14) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon slime")
        else if (randomChoose === 1) runCommands("summon slime", "summon slime")
        else if (randomChoose === 2) runCommands("summon slime", "summon slime", "summon slime")
    }
    else if (random === 15) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon skeleton")
        else if (randomChoose === 1) runCommands("summon skeleton", "summon skeleton")
        else if (randomChoose === 2) runCommands("summon skeleton", "summon skeleton", "summon skeleton")
    }
    else if (random === 16) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon zombie")
        else if (randomChoose === 1) runCommands("summon zombie", "summon zombie")
        else if (randomChoose === 2) runCommands("summon zombie", "summon zombie", "summon zombie")
    }
    else if (random === 17) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon spider")
        else if (randomChoose === 1) runCommands("summon spider", "summon spider")
        else if (randomChoose === 2) runCommands("summon spider", "summon spider", "summon spider")
    }
    else if (random === 18) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cave_spider")
        else if (randomChoose === 1) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 2) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 3) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
    }
    else if (random === 19) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:pillager")
        else if (randomChoose === 1) runCommands("summon minecraft:pillager", "summon minecraft:pillager")
        else if (randomChoose === 2) runCommands("summon minecraft:pillager", "summon minecraft:pillager", "summon minecraft:pillager")
    }
    else if (random === 20) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 1) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 2) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
    }
    else if (random === 21) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon blaze")
        else if (randomChoose === 1) runCommands("summon blaze", "summon blaze")
        else if (randomChoose === 2) runCommands("summon blaze", "summon blaze", "summon blaze")
    }
    else if (random === 22) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wither_skeleton")
        else if (randomChoose === 1) runCommands("summon wither_skeleton", "summon wither_skeleton")
        else if (randomChoose === 2) runCommands("summon wither_skeleton", "summon wither_skeleton", "summon wither_skeleton")
    }
    else if (random === 23) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon evocation_illager")
        else if (randomChoose === 1) runCommands("summon evocation_illager", "summon vindicator", "summon vindicator")
    }
    else if (random === 24) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon vindicator")
        else if (randomChoose === 1) runCommands("summon vindicator ~ ~ ~ ~ ~ minecraft:start_johnny")
    }
    else if (random === 25) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon guardian")
        else if (randomChoose === 1) runCommands("summon guardian", "summon guardian")
        else if (randomChoose === 2) runCommands("summon guardian", "summon guardian", "summon guardian")
    }
    else if (random === 26) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon phantom")
        else if (randomChoose === 1) runCommands("summon phantom", "summon phantom")
        else if (randomChoose === 2) runCommands("summon phantom", "summon phantom", "summon phantom")
    }
    else if (random === 27) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ghast")
        else if (randomChoose === 1) runCommands("summon ghast", "summon ghast")
        else if (randomChoose === 2) runCommands("summon ghast", "summon ghast", "summon ghast")
    }
    else if (random === 28) {
        const randomChoose = Math.floor(Math.random() * 5)
        if (randomChoose === 0) runCommands("summon vex")
        else if (randomChoose === 1) runCommands("summon vex", "summon vex")
        else if (randomChoose === 2) runCommands("summon vex", "summon vex", "summon vex")
        else if (randomChoose === 3) runCommands("summon vex", "summon vex", "summon vex", "summon vex")
        else if (randomChoose === 4) runCommands("summon vex", "summon vex", "summon vex", "summon vex", "summon vex")
    }
    else if (random === 29) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ravager")
        else if (randomChoose === 1) runCommands("summon elder_guardian")
        else if (randomChoose === 2) runCommands("summon wither")
    }
    else if (random === 30) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon witch")
        else if (randomChoose === 1) runCommands("summon witch", "summon witch")
    }
    else if (random === 31) {
        wolvesAndBones(runCommands)
    }
    else if (random === 32) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon magma_cube")
        else if (randomChoose === 1) runCommands("summon magma_cube", "summon magma_cube")
        else if (randomChoose === 2) runCommands("summon magma_cube", "summon magma_cube", "summon magma_cube")
    }
    else if (random === 33) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon chicken")
        else if (randomChoose === 1) runCommands("summon chicken", "summon chicken")
        else if (randomChoose === 2) runCommands("summon chicken", "summon chicken", "summon chicken")
        else if (randomChoose === 3) runCommands("summon chicken", "summon chicken", "summon chicken", "summon chicken")
    }
    else if (random === 34) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cod")
        else if (randomChoose === 1) runCommands("summon cod", "summon cod")
        else if (randomChoose === 2) runCommands("summon cod", "summon cod", "summon cod")
        else if (randomChoose === 3) runCommands("summon cod", "summon cod", "summon cod", "summon cod")
    }
    else if (random === 35) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon pig")
        else if (randomChoose === 1) runCommands("summon pig", "summon pig")
        else if (randomChoose === 2) runCommands("summon pig", "summon pig", "summon pig")
        else if (randomChoose === 3) runCommands("summon pig", "summon pig", "summon pig", "summon pig")
    }
    else if (random === 36) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cow")
        else if (randomChoose === 1) runCommands("summon cow", "summon cow")
        else if (randomChoose === 2) runCommands("summon cow", "summon cow", "summon cow")
        else if (randomChoose === 3) runCommands("summon cow", "summon cow", "summon cow", "summon cow")
    }
    else if (random === 37) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon sheep")
        else if (randomChoose === 1) runCommands("summon sheep", "summon sheep")
        else if (randomChoose === 2) runCommands("summon sheep", "summon sheep", "summon sheep")
        else if (randomChoose === 3) runCommands("summon sheep", "summon sheep", "summon sheep", "summon sheep")
    }
    else if (random === 38) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wolf")
        else if (randomChoose === 1) runCommands("summon wolf", "summon wolf")
        else if (randomChoose === 2) runCommands("summon wolf", "summon wolf", "summon wolf")
    }
    else if (random === 39) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon cat")
        else if (randomChoose === 1) runCommands("summon cat", "summon cat")
        else if (randomChoose === 2) runCommands("summon cat", "summon cat", "summon cat")
    }
    else if (random === 40) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon parrot")
        else if (randomChoose === 1) runCommands("summon parrot", "summon parrot")
        else if (randomChoose === 2) runCommands("summon parrot", "summon parrot", "summon parrot")
        else if (randomChoose === 3) runCommands("summon parrot", "summon parrot", "summon parrot", "summon parrot")
    }
    else if (random === 41) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon rabbit")
        else if (randomChoose === 1) runCommands("summon rabbit", "summon rabbit")
        else if (randomChoose === 2) runCommands("summon rabbit", "summon rabbit", "summon rabbit")
        else if (randomChoose === 3) runCommands("summon rabbit", "summon rabbit", "summon rabbit", "summon rabbit")
    }
    else if (random === 42) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon polar_bear")
        else if (randomChoose === 1) runCommands("summon polar_bear", "summon polar_bear")
    }
    else if (random === 43) runCommands("summon wandering_trader")
    else if (random === 44) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon horse")
        else if (randomChoose === 1) runCommands("summon horse", "summon horse")
        else if (randomChoose === 2) runCommands("summon horse", "summon horse", "summon horse")
    }
    else if (random === 45) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon minecraft:bee")
        else if (randomChoose === 1) runCommands("summon minecraft:bee", "summon minecraft:bee")
        else if (randomChoose === 2) runCommands("summon minecraft:bee", "summon minecraft:bee", "summon minecraft:bee")
    }
    else if (random === 46) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon fox")
        else if (randomChoose === 1) runCommands("summon fox", "summon fox")
        else if (randomChoose === 2) runCommands("summon fox", "summon fox", "summon fox")
    }
    else if (random === 47) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon panda")
        else if (randomChoose === 1) runCommands("summon panda", "summon panda")
        else if (randomChoose === 2) runCommands("summon panda", "summon panda", "summon panda")
    }
    else if (random === 48) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon turtle")
        else if (randomChoose === 1) runCommands("summon turtle", "summon turtle")
        else if (randomChoose === 2) runCommands("summon turtle", "summon turtle", "summon turtle")
    }
    else if (random === 49) runCommands("summon zombie_horse")
    else if (random === 50) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon skeleton_horse")
        else if (randomChoose === 1) runCommands("summon skeleton_horse ~ ~ ~ ~ ~ minecraft:set_trap")
    }
    else if (random === 51) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon villager")
        else if (randomChoose === 1) runCommands("summon villager", "summon villager")
        else if (randomChoose === 2) runCommands("summon villager", "summon villager", "summon villager")
    }
    else if (random === 52) {
        const randomChoose = Math.floor(Math.random() * 9)
        if (randomChoose === 0) runCommands("structure load lucky_villager1 ~ ~ ~")
        else if (randomChoose === 1) runCommands("structure load lucky_villager2 ~ ~ ~")
        else if (randomChoose === 2) runCommands("structure load lucky_villager3 ~ ~ ~")
        else if (randomChoose === 3) runCommands("structure load lucky_villager4 ~ ~ ~")
        else if (randomChoose === 4) runCommands("structure load lucky_villager5 ~ ~ ~")
        else if (randomChoose === 5) runCommands("structure load lucky_villager6 ~ ~ ~")
        else if (randomChoose === 6) runCommands("structure load lucky_villager7 ~ ~ ~")
        else if (randomChoose === 7) runCommands("structure load lucky_villager8 ~ ~ ~")
        else if (randomChoose === 8) runCommands("structure load lucky_villager9 ~ ~ ~")
    }
    else if (random === 53) runCommands("structure load slime_stack ~ ~ ~")
    else if (random === 54) runCommands("summon spawn_entity:witch_and_bats")
    else if (random === 55) runCommands("structure load magma_cube_tower ~ ~ ~")
    else if (random === 56) runCommands("structure load giant_slime ~ ~ ~")
    else if (random === 57) runCommands("structure load ghostly_horseman ~ ~ ~")
}

export function pvpItems(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 52)
    if (random === 0) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/1"`)
    else if (random === 1) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/2"`)
    else if (random === 2) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/3"`)
    else if (random === 3) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/4"`)
    else if (random === 4) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/5"`)
    else if (random === 5) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/7"`)
    else if (random === 6) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/8"`)
    else if (random === 7) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/9"`)
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/10"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/11"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/14"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/15"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/16"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/17"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/18"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/19"`)
    else if (random === 16) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/21"`)
    else if (random === 17) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/22"`)
    else if (random === 18) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/26"`)
    else if (random === 19) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/27"`)
    else if (random === 20) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/35"`)
    else if (random === 21) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/36"`)
    else if (random === 22) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/37"`)
    else if (random === 23) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/38"`)
    else if (random === 24) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/47"`)
    else if (random === 25) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/48"`)
    else if (random === 26) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/49"`)
    else if (random === 27) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/53"`)
    else if (random === 28) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/55"`)
    else if (random === 29) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/56"`)
    else if (random === 30) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/58"`)
    else if (random === 31) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/60"`)
    else if (random === 32) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/61"`)
    else if (random === 33) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/62"`)
    else if (random === 34) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/63"`)
    else if (random === 35) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/86"`)
    else if (random === 36) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/93"`)
    else if (random === 37) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/94"`)
    else if (random === 38) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/95"`)
    else if (random === 39) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/96"`)
    else if (random === 40) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/97"`)
    else if (random === 41) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/98"`)
    else if (random === 42) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/99"`)
    else if (random === 43) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/105"`)
    else if (random === 44) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/111"`)
    else if (random === 45) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/112"`)
    else if (random === 46) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/117"`)
    else if (random === 47) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/131"`)
    else if (random === 48) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/147"`)
    else if (random === 49) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/152"`)
    else if (random === 50) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/153"`)
    else if (random === 51) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/205"`)
}

export function luckyPumpkin(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 78)
    if (random === 0) {
        runCommands("effect @p[r=8] jump_boost 256 14 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 1) {
        runCommands("effect @p[r=8] haste 128 6 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 2) {
        runCommands("effect @p[r=8] speed 25 15 true")
        runCommands("particle minecraft:totem_particle ~ ~1 ~")
    }
    else if (random === 3) {
        runCommands("effect @p[r=8] slowness 10 128 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 4) {
        runCommands("effect @p[r=8] nausea 18 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 5) {
        runCommands("effect @p[r=8] poison 15 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 6) {
        runCommands("effect @p[r=8] levitation 1 15 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 7) {
        runCommands("effect @p[r=8] blindness 10 1 true")
        runCommands("particle minecraft:knockback_roar_particle ~ ~1 ~")
    }
    else if (random === 8) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/111"`)
    else if (random === 9) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/112"`)
    else if (random === 10) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/113"`)
    else if (random === 11) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/114"`)
    else if (random === 12) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/115"`)
    else if (random === 13) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/116"`)
    else if (random === 14) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/117"`)
    else if (random === 15) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/118"`)
    else if (random === 16) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/119"`)
    else if (random === 17) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/120"`)
    else if (random === 18) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/withered_lucky_block/27"`)
    else if (random === 19) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/withered_lucky_block/28"`)
    else if (random === 20) {
        runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/45"`)
        runCommands("summon entity:show_name ~ ~ ~ ~ ~ minecraft:despawn_activated §l§6Flame§r§7.§l§6Boots")
    }
    else if (random === 21) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/209"`)
    else if (random === 22) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/210"`)
    else if (random === 23) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/211"`)
    else if (random === 24) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/212"`)
    else if (random === 25) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/213"`)
    else if (random === 26) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/214"`)
    else if (random === 27) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/215"`)
    else if (random === 28) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/216"`)
    else if (random === 29) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/217"`)
    else if (random === 30) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/218"`)
    else if (random === 31) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/219"`)
    else if (random === 32) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/220"`)
    else if (random === 33) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/221"`)
    else if (random === 34) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/222"`)
    else if (random === 35) {
        runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/19"`)
        runCommands("summon entity:show_name ~ ~ ~ ~ ~ minecraft:despawn_activated §l§gWooden§r§7.§l§gArmor")
    }
    else if (random === 36) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/20"`)
    else if (random === 37) runCommands(`loot spawn ${x} ${y} ${z} loot "blocks/spiral_lucky_block/25"`)
    else if (random === 38) {
        runCommands("summon entity:events ~ ~ ~",
            "execute at @p[ry=-45,rym=-134,r=8] positioned ~ ~ ~ run execute at @e[type=entity:events,c=1] positioned ~ ~ ~ run structure load gravestone ~-1 ~-2 ~-1 270_degrees",
            "execute at @p[ry=135,rym=46,r=8] positioned ~ ~ ~ run execute at @e[type=entity:events,c=1] positioned ~ ~ ~ run structure load gravestone ~-2 ~-2 ~-1 90_degrees",
            "execute at @p[ry=45,rym=-44,r=8] positioned ~ ~ ~ run execute at @e[type=entity:events,c=1] positioned ~ ~ ~ run structure load gravestone ~-1 ~-2 ~-1 0_degrees",
            "execute at @p[ry=180,rym=136,r=8] positioned ~ ~ ~ run execute at @e[type=entity:events,c=1] positioned ~ ~ ~ run structure load gravestone ~-1 ~-2 ~-2 180_degrees",
            "execute at @p[ry=-135,rym=-180,r=8] positioned ~ ~ ~ run execute at @e[type=entity:events,c=1] positioned ~ ~ ~ run structure load gravestone ~-1 ~-2 ~-2 180_degrees")
    }
    else if (random === 39) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load pumpkin_tree ~-2 ~ ~-2 0_degrees")
        else if (randomChoose === 1) runCommands("structure load pumpkin_tree ~-2 ~ ~-2 180_degrees")
        else if (randomChoose === 2) runCommands("structure load pumpkin_tree ~-2 ~ ~-2 270_degrees")
        else if (randomChoose === 3) runCommands("structure load pumpkin_tree ~-2 ~ ~-2 90_degrees")
    }
    else if (random === 40) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("structure load cementerio ~-8 ~-2 ~-8 0_degrees")
        else if (randomChoose === 1) runCommands("structure load cementerio ~-8 ~-2 ~-8 180_degrees")
        else if (randomChoose === 2) runCommands("structure load cementerio ~-8 ~-2 ~-8 270_degrees")
        else if (randomChoose === 3) runCommands("structure load cementerio ~-8 ~-2 ~-8 90_degrees")
    }
    else if (random === 41) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~5 ~-1 orange_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~ ~ fire")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~40 ~ ~ ~45 ~ orange_concrete_powder")
    }
    else if (random === 42) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-1 ~1 ~-1 ~-20 ~-1 air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-20 ~1 ~-1 ~-20 ~-1 lava")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~-19 ~1 ~-1 ~-19 ~-1 web")
    }
    else if (random === 43) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~6 ~-1 gray_stained_glass")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~5 ~ air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run setblock ~ ~6 ~ flowing_lava")
    }
    else if (random === 44) {
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~4 ~-1 iron_bars hollow")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~4 ~ air")
        runCommands("execute at @p[r=8,c=1] positioned ~ ~ ~ run fill ~ ~4 ~ ~ ~4 ~ flowing_lava")
    }
    else if (random === 45) {
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~2 ~ ~2 ~-2 ~ ~-2 fire replace air")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~ ~1 ~-1 ~ ~-1 air replace fire")
    }
    else if (random === 46) runCommands("fill ~1 ~15 ~1 ~-1 ~17 ~-1 sand")
    else if (random === 47) {
        runCommands("execute at @p[ry=-45,rym=-134,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 180_degrees")
        runCommands("execute at @p[ry=135,rym=46,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-2 ~-1 ~-1 0_degrees")
        runCommands("execute at @p[ry=45,rym=-44,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-1 270_degrees")
        runCommands("execute at @p[ry=180,rym=136,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[ry=-135,rym=-180,r=8] positioned ~ ~ ~ run structure load anvill_fall ~-1 ~-1 ~-2 90_degrees")
        runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~ ~29 ~ ~ ~30 ~ anvil")
    }
    else if (random === 48) runCommands("execute at @p[r=8] positioned ~ ~ ~ run fill ~1 ~29 ~1 ~-1 ~30 ~-1 anvil")
    else if (random === 49) {
        runCommands("spreadplayers ~ ~ 4 16 @p")
        runCommands("playsound mob.endermen.portal @a[r=17]")
    }
    else if (random === 50) runCommands("structure load pigman_stack ~-2 ~ ~-2")
    else if (random === 51) runCommands("structure load creeper_stack ~~~")

    else if (random === 52) runCommands("summon minecraft:tnt")
    else if (random === 53) {
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
        runCommands("summon lightning_bolt")
    }
    else if (random === 54) runCommands("structure load Bob ~ ~ ~")
    else if (random === 55) {
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
        runCommands("summon spider ~ ~ ~ ~ ~ mini_spider")
    }
    else if (random === 56) runCommands("summon zombie ~ ~ ~ ~ ~ minecraft:zombie_giant")
    else if (random === 57) runCommands("summon tnt ~ ~ ~ ~ ~ instant_explode")
    else if (random === 58) runCommands("summon shulker ~ ~ ~ ~ ~ minecraft:turn_black")
    else if (random === 59) {
        runCommands("summon creeper")
        runCommands("summon lightning_bolt ~ ~1.2 ~")
    }
    else if (random === 60) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon creeper")
        else if (randomChoose === 1) runCommands("summon creeper", "summon creeper")
        else if (randomChoose === 2) runCommands("summon creeper", "summon creeper", "summon creeper")
    }
    else if (random === 61) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon skeleton")
        else if (randomChoose === 1) runCommands("summon skeleton", "summon skeleton")
        else if (randomChoose === 2) runCommands("summon skeleton", "summon skeleton", "summon skeleton")
    }
    else if (random === 62) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon zombie")
        else if (randomChoose === 1) runCommands("summon zombie", "summon zombie")
        else if (randomChoose === 2) runCommands("summon zombie", "summon zombie", "summon zombie")
    }
    else if (random === 63) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon spider")
        else if (randomChoose === 1) runCommands("summon spider", "summon spider")
        else if (randomChoose === 2) runCommands("summon spider", "summon spider", "summon spider")
    }
    else if (random === 64) {
        const randomChoose = Math.floor(Math.random() * 4)
        if (randomChoose === 0) runCommands("summon cave_spider")
        else if (randomChoose === 1) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 2) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
        else if (randomChoose === 3) runCommands("summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider", "summon cave_spider")
    }
    else if (random === 65) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 1) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
        else if (randomChoose === 2) runCommands("summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish", "summon silverfish")
    }
    else if (random === 66) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon blaze")
        else if (randomChoose === 1) runCommands("summon blaze", "summon blaze")
        else if (randomChoose === 2) runCommands("summon blaze", "summon blaze", "summon blaze")
    }
    else if (random === 67) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon wither_skeleton")
        else if (randomChoose === 1) runCommands("summon wither_skeleton", "summon wither_skeleton")
        else if (randomChoose === 2) runCommands("summon wither_skeleton", "summon wither_skeleton", "summon wither_skeleton")
    }
    else if (random === 68) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon evocation_illager")
        else if (randomChoose === 1) runCommands("summon evocation_illager", "summon vindicator", "summon vindicator")
    }
    else if (random === 69) runCommands("summon vindicator ~ ~ ~ ~ ~ minecraft:start_johnny")
    else if (random === 70) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon phantom")
        else if (randomChoose === 1) runCommands("summon phantom", "summon phantom")
        else if (randomChoose === 2) runCommands("summon phantom", "summon phantom", "summon phantom")
    }
    else if (random === 71) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon ghast")
        else if (randomChoose === 1) runCommands("summon ghast", "summon ghast")
        else if (randomChoose === 2) runCommands("summon ghast", "summon ghast", "summon ghast")
    }
    else if (random === 72) {
        const randomChoose = Math.floor(Math.random() * 5)
        if (randomChoose === 0) runCommands("summon vex")
        else if (randomChoose === 1) runCommands("summon vex", "summon vex")
        else if (randomChoose === 2) runCommands("summon vex", "summon vex", "summon vex")
        else if (randomChoose === 3) runCommands("summon vex", "summon vex", "summon vex", "summon vex")
        else if (randomChoose === 4) runCommands("summon vex", "summon vex", "summon vex", "summon vex", "summon vex")
    }
    else if (random === 73) {
        const randomChoose = Math.floor(Math.random() * 2)
        if (randomChoose === 0) runCommands("summon witch")
        else if (randomChoose === 1) runCommands("summon witch", "summon witch")
    }
    else if (random === 74) {
        const randomChoose = Math.floor(Math.random() * 3)
        if (randomChoose === 0) runCommands("summon magma_cube")
        else if (randomChoose === 1) runCommands("summon magma_cube", "summon magma_cube")
        else if (randomChoose === 2) runCommands("summon magma_cube", "summon magma_cube", "summon magma_cube")
    }
    else if (random === 75) runCommands("summon spawn_entity:witch_and_bats")
    else if (random === 76) runCommands("structure load magma_cube_tower ~ ~ ~")
    else if (random === 77) runCommands("structure load ghostly_horseman ~ ~ ~")
}

export function luckyFountain(l) {
    const { x, y, z } = l.block

    function runCommands(...commands) {
        for (const command of commands) {
            l.dimension.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 100)
    runCommands("fill ~ ~1 ~ ~ ~2 ~ air", "setblock ~ ~ ~ iron_block", "setblock ~ ~1 ~ beacon")
    if (random < 40) {
        runCommands("setblock ~2 ~16 ~2 effect99:luckyfountain1",
            "setblock ~-2 ~16 ~-2 effect99:luckyfountain1",
            "setblock ~2 ~16 ~-2 effect99:luckyfountain1",
            "setblock ~-2 ~16 ~2 effect99:luckyfountain1",
            "setblock ~2 ~17 ~2 effect99:luckyfountain1",
            "setblock ~-2 ~17 ~-2 effect99:luckyfountain1",
            "setblock ~2 ~17 ~-2 effect99:luckyfountain1",
            "setblock ~-2 ~17 ~2 effect99:luckyfountain1",
            "summon fireworks_rocket ~ ~1 ~",
            "setblock ~ ~5 ~ yellow_stained_glass")
    }
    else if (random < 80) {
        runCommands("setblock ~2 ~16 ~2 effect99:luckyfountain2",
            "setblock ~-2 ~16 ~-2 effect99:luckyfountain2",
            "setblock ~2 ~16 ~-2 effect99:luckyfountain2",
            "setblock ~-2 ~16 ~2 effect99:luckyfountain2",
            "setblock ~2 ~17 ~2 effect99:luckyfountain2",
            "setblock ~-2 ~17 ~-2 effect99:luckyfountain2",
            "setblock ~2 ~17 ~-2 effect99:luckyfountain2",
            "setblock ~-2 ~17 ~2 effect99:luckyfountain2",
            "function luckytellraw1",
            "summon fireworks_rocket ~ ~1 ~",
            "setblock ~ ~5 ~ orange_stained_glass")
    }
    else if (random < 100) {
        runCommands("summon minecraft:tnt ~2 ~15 ~",
            "summon minecraft:tnt ~-2 ~15 ~",
            "summon minecraft:tnt ~ ~15 ~2",
            "summon minecraft:tnt ~ ~15 ~-2",
            "summon minecraft:tnt ~2 ~15 ~2",
            "summon minecraft:tnt ~2 ~15 ~-2",
            "summon minecraft:tnt ~-2 ~15 ~2",
            "summon minecraft:tnt ~-2 ~15 ~-2",
            "summon minecraft:tnt ~4 ~15 ~",
            "summon minecraft:tnt ~-4 ~15 ~",
            "summon minecraft:tnt ~ ~15 ~4",
            "summon minecraft:tnt ~ ~15 ~-4",
            "summon minecraft:tnt ~4 ~15 ~4",
            "summon minecraft:tnt ~4 ~15 ~-4",
            "summon minecraft:tnt ~-4 ~15 ~4",
            "summon minecraft:tnt ~-4 ~15 ~-4",
            "function luckytellraw2",
            "setblock ~ ~5 ~ red_stained_glass")
    }

}

export function luckyFountainI(l) {
    const { x, y, z } = l.block
    l.dimension.runCommand(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/109"`)
    l.dimension.runCommand(`setblock ${x} ${y} ${z} air`)
}

export function luckyFountainII(l) {
    const { x, y, z } = l.block
    l.dimension.runCommand(`loot spawn ${x} ${y} ${z} loot "blocks/lucky_block/108"`)
    l.dimension.runCommand(`setblock ${x} ${y} ${z} air`)
}

export function luckySword(s) {
    const player = s.attackingEntity
    const { x, y, z } = player.location

    function runCommands(...commands) {
        for (const command of commands) {            
            player.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`)
        }
    }
    const random = Math.floor(Math.random() * 10)
    if (random === 0) runCommands(
        "effect @e[type=!xp_orb,type=!entity:spiral_arrow,type=!player,type=!item,family=!inanimate,type=!arrow,type=!snowball,type=!entity:fire_particle,c=1,r=6] levitation 1 8 true",
        "execute at @e[type=!xp_orb,type=!entity:spiral_arrow,type=!player,type=!item,family=!inanimate,type=!arrow,type=!snowball,type=!entity:fire_particle,c=1,r=6] positioned ~ ~ ~ run particle minecraft:knockback_roar_particle ~ ~ ~"
    )
    else if (random === 1) runCommands("tag @p add shoot_snowball")
    else if (random === 2) runCommands("tag @p add shoot_arrow")
    else if (random === 3) runCommands("event entity @s minecraft:shoot_tnt")
    else if (random === 4) runCommands("execute at @s positioned ^ ^-1 ^5 run summon entity:explode ~ ~ ~")
    else if (random === 5) runCommands("execute at @e[type=!xp_orb,type=!entity:spiral_arrow,type=!player,type=!item,family=!inanimate,type=!arrow,type=!snowball,type=!entity:fire_particle,c=1,r=6] positioned ~ ~ ~ run summon lightning_bolt ~ ~ ~")
    else if (random === 6) runCommands("execute at @e[type=!xp_orb,type=!entity:spiral_arrow,type=!player,type=!item,family=!inanimate,type=!arrow,type=!snowball,type=!entity:fire_particle,c=1,r=6] positioned ~ ~ ~ run fill ~ ~ ~ ~ ~1 ~ web")
    else if (random === 7) runCommands(
        "structure load fire_particle ~-3 ~ ~-3",
        "execute at @e[type=!xp_orb,type=!entity:spiral_arrow,type=!player,type=!item,family=!inanimate,type=!arrow,type=!snowball,type=!entity:fire_particle,r=6] positioned ~ ~ ~ run summon minecraft:small_fireball ~ ~0.5 ~"
    )
}

// ---------------------------------------------------------------------------
// 陨星之剑
// ---------------------------------------------------------------------------
const METEOR_SWORD_ID = "effect99:meteorite_sword"
/** 特殊攻击冷却：6 秒（配合下调后的近战伤害做平衡）。 */
const METEOR_COOLDOWN = 6 * TicksPerSecond;
/** 大火球的生成高度：与冰法杖一致（头顶附近），便于瞄准。 */
const METEOR_LAUNCH_HEIGHT = 2.2;
/** 火焰免疫的刷新时长。持剑时不断续杯，换下剑后最多再持续这么久。 */
const METEOR_FIRE_IMMUNITY = 5 * TicksPerSecond;
/** 每名玩家下一次可以发射大火球的 tick。 @type {Map<string, number>} */
const meteorReady = new Map();

export function meteoriteSword(s) {
    const player = s.attackingEntity ?? s.source
    const now = system.currentTick
    if (now < (meteorReady.get(player.id) ?? 0)) return
    meteorReady.set(player.id, now + METEOR_COOLDOWN)

    // 发射瞬间给 1 秒抗性 5，避免被自己的爆炸波及
    player.addEffect("resistance", TicksPerSecond, { amplifier: 4, showParticles: false })

    const loc = player.location
    const view = player.getViewDirection()
    let ball
    try {
        ball = player.dimension.spawnEntity("lucky:meteor_fireball", {
            x: loc.x,
            y: loc.y + METEOR_LAUNCH_HEIGHT,
            z: loc.z,
        })
    } catch {
        return
    }
    try {
        ball.applyImpulse({ x: view.x * 1.8, y: view.y * 1.8, z: view.z * 1.8 })
    } catch {
        // 投掷物已消失，忽略
    }
    player.dimension.playSound("mob.ghast.fireball", player.getHeadLocation())
}

// 持剑期间持续续杯火焰免疫；因为刷新时长是 5 秒，换下剑后最多 5 秒自然消失
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const equippable = player.getComponent("minecraft:equippable")
        if (!equippable) continue
        let holding
        try {
            holding =
                equippable.getEquipment(EquipmentSlot.Mainhand)?.typeId === METEOR_SWORD_ID ||
                equippable.getEquipment(EquipmentSlot.Offhand)?.typeId === METEOR_SWORD_ID
        } catch {
            continue
        }
        if (holding) {
            player.addEffect("fire_resistance", METEOR_FIRE_IMMUNITY, {
                amplifier: 0,
                showParticles: false,
            })
        }
    }
}, 20)

// ---------------------------------------------------------------------------
// 赛道：存档点 + 终点传送
// ---------------------------------------------------------------------------
/** 终点传送目标（竞技场中心）。 */
const TRACK_FINISH = { x: 300, y: 5, z: 300 };
/** 已记录过的存档点，避免站着不动时反复触发。 @type {Map<string, number>} */
const trackCheckpoint = new Map();

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const loc = player.location;
        let below;
        try {
            below = player.dimension.getBlock({
                x: Math.floor(loc.x),
                y: Math.floor(loc.y) - 1,
                z: Math.floor(loc.z),
            });
        } catch {
            continue;
        }
        if (!below) continue;

        // 存档点：站在青绿色地贴上就记录复活点
        if (below.typeId === "minecraft:lime_concrete") {
            const mark = Math.floor(loc.x);
            if (trackCheckpoint.get(player.id) !== mark) {
                trackCheckpoint.set(player.id, mark);
                try {
                    player.dimension.runCommand(
                        `spawnpoint "${player.name}" ${mark} ${Math.floor(loc.y)} ${Math.floor(loc.z)}`,
                    );
                } catch {
                    // 权限不足时忽略，不影响跑图
                }
                player.onScreenDisplay.setActionBar({
                    rawtext: [{ text: "§a[赛道] 存档点已记录" }],
                });
                player.playSound("random.levelup");
            }
            continue;
        }

        // 终点：踩到压力板传送到竞技场（两条跑道 Z 差很远，范围要放宽）
        if (
            below.typeId.includes("pressure_plate") &&
            loc.x > 190 &&
            loc.z < -260
        ) {
            player.teleport(TRACK_FINISH, { dimension: world.getDimension("overworld") });
            player.playSound("random.orb");
            player.onScreenDisplay.setActionBar({
                rawtext: [{ text: "§d[赛道] 已传送到竞技场" }],
            });
        }
    }
}, 5)

export function pumpkinSword(s) {
    const player = s.attackingEntity ?? s.source
    player.runCommand("playsound mob.shulker.bullet.hit @a[r=10] ~ ~ ~")
    player.triggerEvent("shoot_pumpkin_projectile")
}

export function quartzStick(q) {
    const player = q.attackingEntity ?? q.source

    const random = Math.floor(Math.random() * 100)
    if (random < 10) {
        player.runCommand("damage @s 1 magic")
    }
    else if (random < 95) {
        player.runCommand("damage @s 3 magic")
    }
    else if (random < 100) {
        player.runCommand("damage @s 6 magic")
    }
}

export function grenade(i) {
    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:grenade 0 1")
    player.triggerEvent("shoot_grenade")
}

export function christmasGrenade(i) {
    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:christmas_grenade 0 1")
    player.triggerEvent("shoot_cGrenade")
}

export function luckySplashMystery(i) {
    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:lucky_splash_mystery_potion 0 1")
    throwMysterySplash(player)
}

export function unluckySplashMystery(i) {
    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:unlucky_splash_mystery_potion 0 1")
    throwMysterySplash(player)
}

/**
 * 喷溅型神秘药水：投出哪一种（正面 / 负面）在出手瞬间 50% 随机决定。
 *
 * 以前“幸运”和“倒霉”两个物品各自绑定固定的实体与函数，买到哪一支就永远是那一种结果；
 * 两个物品的名字和贴图本来就完全一样，所以这里改成出手时掷硬币，效果才真的随机。
 */
function throwMysterySplash(player) {
    const event = Math.random() < 0.5
        ? "throwing_splash_lucky_mystery"
        : "throwing_splash_unlucky_mystery"
    player.triggerEvent(event)
}

// ---------------------------------------------------------------------------
// 神秘药水（饮用型）：正面 / 负面各 50%
// ---------------------------------------------------------------------------
/**
 * 正面效果表：[效果名, 持续时间(tick), 等级]。数值与原 JSON 完全一致。
 * @type {[string, number, number][]}
 */
const MYSTERY_GOOD_EFFECTS = [
    ["speed", 405, 1],
    ["strength", 390, 1],
    ["resistance", 405, 2],
    ["water_breathing", 152, 0],
    ["invisibility", 272, 0],
    ["regeneration", 142, 0],
]

/** 负面效果表：[效果名, 持续时间(tick), 等级]。 @type {[string, number, number][]} */
const MYSTERY_BAD_EFFECTS = [
    ["slowness", 396, 2],
    ["mining_fatigue", 201, 2],
    ["blindness", 414, 0],
    ["weakness", 242, 1],
    ["poison", 404, 2],
    ["hunger", 197, 2],
]

/**
 * 记录每名玩家 + 每件物品最近一次“喝下”结算的 tick。
 * onConsume 与 onCompleteUse 有可能在同一次饮用里一起触发，用它去重，
 * 否则效果会结算两遍（神秘药水甚至会先抽正面再抽负面）。
 * @type {Map<string, number>}
 */
const drinkGuard = new Map()

/** 同一件药水的两次结算间隔小于这个 tick 数就认为重复。 */
const DRINK_GUARD_TICKS = 20

/**
 * 饮用型药水的统一入口：去重后执行结算。
 * @param {any} s onConsume / onCompleteUse 的事件对象
 * @param {(player: any) => void} apply 真正施加效果的函数
 */
export function drinkPotion(s, apply) {
    const player = s.source
    if (!player) return

    const key = `${player.id}:${s.itemStack?.typeId ?? "unknown"}`
    const now = system.currentTick
    const last = drinkGuard.get(key)
    if (last !== undefined && now - last <= DRINK_GUARD_TICKS) return
    drinkGuard.set(key, now)

    apply(player)
}

/**
 * 饮用型神秘药水：喝下去时 50% 给正面一套效果，50% 给负面一套效果。
 * 原来两种药水各自写死在 JSON 里（一支永远正面、一支永远负面），
 * 但两者名字贴图完全相同，玩家拿到哪一支就该是随机的。
 */
export function mysteryPotion(s) {
    drinkPotion(s, (player) => {
        const good = Math.random() < 0.5
        for (const [name, duration, amplifier] of (good ? MYSTERY_GOOD_EFFECTS : MYSTERY_BAD_EFFECTS)) {
            try {
                player.addEffect(name, duration, { amplifier, showParticles: false })
            } catch {
                // 单个效果失败不影响其余效果
            }
        }

        try {
            player.onScreenDisplay.setActionBar({
                rawtext: [{
                    text: good
                        ? "§a[神秘药水] §r幸运女神站在你这边！"
                        : "§c[神秘药水] §r……运气不太好。",
                }],
            })
            player.playSound(good ? "random.levelup" : "random.fizz")
        } catch {
            // 玩家已离线，忽略提示
        }
    })
}

// ---------------------------------------------------------------------------
// 冲锋药水
// ---------------------------------------------------------------------------
/**
 * 冲锋药水效果：[效果名, 持续时间(tick), 等级]。
 * 速度 II 2 分钟，防火 / 跳跃提升 / 生命恢复 I 各 1 分钟。
 * @type {[string, number, number][]}
 */
const CHARGE_POTION_EFFECTS = [
    ["speed", 120 * TicksPerSecond, 1],
    ["fire_resistance", 60 * TicksPerSecond, 0],
    ["jump_boost", 60 * TicksPerSecond, 0],
    ["regeneration", 60 * TicksPerSecond, 0],
]

export function chargePotion(s) {
    drinkPotion(s, (player) => {
        for (const [name, duration, amplifier] of CHARGE_POTION_EFFECTS) {
            try {
                player.addEffect(name, duration, { amplifier, showParticles: false })
            } catch {
                // 单个效果失败不影响其余效果
            }
        }
        try {
            player.onScreenDisplay.setActionBar({ rawtext: [{ text: "§b[冲锋药水] §r冲刺！" }] })
            player.playSound("random.levelup")
        } catch {
            // 玩家已离线，忽略提示
        }
    })
}

// 兜底路径：自定义物品组件在个别版本 / 高延迟联机下可能漏触发，
// itemCompleteUse 是 1.4.0 起的稳定事件，喝药完成必定发一次。
// drinkGuard 会按“玩家 + 物品”在 20 tick 内去重，两条路径同时命中也只结算一次。
world.afterEvents.itemCompleteUse.subscribe((s) => {
    const typeId = s.itemStack?.typeId
    if (typeId === "lucky:mystery_potion" || typeId === "lucky:unlucky_mystery_potion") {
        mysteryPotion(s)
    } else if (typeId === "lucky:charge_potion") {
        chargePotion(s)
    }
})

export function superUnluckySplash(i) {    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:super_unlucky_splash_potion 0 1")
    player.triggerEvent("throwing_splash_super_unlucky")
}

export function opUnluckySplash(i) {
    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:op_unlucky_splash_potion 0 1")
    player.triggerEvent("throwing_splash_op_unlucky")
}

export function evilLuckySplash(i) {
    const player = i.source
    player.runCommand("playsound random.bow @s ~ ~ ~ 1 0.4")
    player.runCommand("clear @s[m=!1] lucky:evil_potion 0 1")
    player.triggerEvent("throwing_splash_evil_lucky")
}