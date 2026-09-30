import { world } from "@minecraft/server"
import * as event from "./events"
import "./staffs"
import "./armor"
import "./extra_heart"

world.gameRules.sendCommandFeedback = false
world.gameRules.commandBlockOutput = false

world.beforeEvents.worldInitialize.subscribe(i => {
    i.blockComponentRegistry.registerCustomComponent("lucky:events", {
        onPlayerDestroy: event.luckyBlock
    })
    i.blockComponentRegistry.registerCustomComponent("goodlucky:events", {
        onPlayerDestroy: event.goodLuckyBlock
    })
    i.blockComponentRegistry.registerCustomComponent("unlucky:events", {
        onPlayerDestroy: event.unluckyBlock
    })
    i.blockComponentRegistry.registerCustomComponent("withered:events", {
        onPlayerDestroy: event.witheredluckyBlock
    })
    i.blockComponentRegistry.registerCustomComponent("lucky:structures", {
        onPlayerDestroy: event.structures
    })
    i.blockComponentRegistry.registerCustomComponent("lucky:drops", {
        onPlayerDestroy: event.itemDrops
    })
    i.blockComponentRegistry.registerCustomComponent("lucky:mobs", {
        onPlayerDestroy: event.entities
    })
    i.blockComponentRegistry.registerCustomComponent("lucky:pvp", {
        onPlayerDestroy: event.pvpItems
    })
    i.blockComponentRegistry.registerCustomComponent("pumpkin:events", {
        onPlayerDestroy: event.luckyPumpkin
    })
    i.blockComponentRegistry.registerCustomComponent("lucky_fountain:event", {
        onPlayerDestroy: event.luckyFountain,
        onStepOn: event.luckyFountain
    })
    i.blockComponentRegistry.registerCustomComponent("lucky_fountain:event_1", {
        onPlace: event.luckyFountainI
    })
    i.blockComponentRegistry.registerCustomComponent("lucky_fountain:event_2", {
        onPlace: event.luckyFountainII
    })

    i.itemComponentRegistry.registerCustomComponent("lucky:sword", {
        onHitEntity: event.luckySword
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:meteorite_sword", {
        onHitEntity: event.meteoriteSword,
        onUse: event.meteoriteSword,
        onUseOn: event.meteoriteSword
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:pumpkin_sword", {
        onHitEntity: event.pumpkinSword,
        onUse: event.pumpkinSword,
        onUseOn: event.pumpkinSword
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:quartz_stick", {
        onHitEntity: event.quartzStick,
        onUse: event.quartzStick,
        onUseOn: event.quartzStick
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:grenade", {
        onUse: event.grenade
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:cGrenade", {
        onUse: event.christmasGrenade
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:splash_mystery", {
        onUse: event.luckySplashMystery
    })
    i.itemComponentRegistry.registerCustomComponent("unlucky:splash_mystery", {
        onUse: event.unluckySplashMystery
    })
    // 饮用型神秘药水：效果在脚本里 50% 随机（正面 / 负面），JSON 中不再写死
    i.itemComponentRegistry.registerCustomComponent("lucky:mystery_potion", {
        onConsume: event.mysteryPotion,
        onCompleteUse: event.mysteryPotion
    })
    // 冲锋药水：速度 II 2 分钟 + 防火/跳跃提升/生命恢复 I 各 1 分钟
    i.itemComponentRegistry.registerCustomComponent("lucky:charge_potion", {
        onConsume: event.chargePotion,
        onCompleteUse: event.chargePotion
    })
    i.itemComponentRegistry.registerCustomComponent("unlucky:super_splash", {
        onUse: event.superUnluckySplash
    })
    i.itemComponentRegistry.registerCustomComponent("unlucky:op_splash", {
        onUse: event.opUnluckySplash
    })
    i.itemComponentRegistry.registerCustomComponent("lucky:evil_splash", {
        onUse: event.evilLuckySplash
    })
})
