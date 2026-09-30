//Sistema de dormir con la armadura de lana (Hare un array por si agregas mas en futuro system xd)
import { world, system, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

let angle = -30; // Ángulo inicial de la cámara
let time = 0; // Tiempo para gestionar las animaciones y eventos
let armorIds = [
    "bls:wool_colored_white_helmet", 
    "bls:wool_colored_white_chestplate", 
    "bls:wool_colored_white_leggings", 
    "bls:wool_colored_white_boots"
];
const COAL_ARMOR_ID = "bls:wool_colored_white";

// Función para verificar si el jugador tiene al menos una pieza de armadura de lana
function hasWoolArmor(player) {
    const equip = player.getComponent(EntityEquippableComponent.componentId);
    return ["Head", "Chest", "Legs", "Feet"].every(slot => 
        armorIds.includes(equip.getEquipment(EquipmentSlot[slot])?.typeId)
    );
}

// Función para verificar si es de noche en el juego
function isNightTime() {
    const worldTime = world.getTimeOfDay();
    return worldTime >= 13000 && worldTime < 23000; // Rango de noche en Minecraft
}

// Detectar cuando el jugador usa un ítem en un bloque mientras está agachado y lleva armadura de lana
world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    const player = event.player;
    // Verificar si lleva armadura de lana, es de noche, y el jugador está agachado
    system.run(()=>{
        if (hasWoolArmor(player) && isNightTime() && player.isSneaking) {
        // Añadir una etiqueta para rastrear el estado de "dormir" del jugador
        if (!player.hasTag("interact")){
            player.addTag("interact"); // Añadir etiqueta "interact" si no la tiene
            reduceCoalArmorDurability(player, 4)
        }
    }
    })
});

// Sistema de intervalo para ejecutar la animación de "dormir" y otros efectos visuales
system.runInterval(() => {
    for (let p of world.getPlayers()) {
        if (hasWoolArmor(p)){
            p.onScreenDisplay.setActionBar({translate: "action.wool_armor.warn"})
        }
        p.runCommandAsync("gamerule sendcommandfeedback false"); // Deshabilitar retroalimentación de comandos
        // Solo proceder si el jugador tiene la etiqueta "interact" (indicando que quiere dormir)
        if (p.hasTag("interact")) {
            time++;
            if (time < 100) {
                p.runCommandAsync(`tp @s[tag=interact] ~~~ -90 ${angle + time / 4}`);
                p.onScreenDisplay.setActionBar({translate: "action.sleeping"})
                p.runCommandAsync("inputpermission set @s[tag=interact] movement disabled");
                p.runCommandAsync("inputpermission set @s[tag=interact] camera disabled");
            }
            if (time === 5) {
                p.runCommandAsync("camera @s[tag=interact] fade time 3 1 1");
            }
            if (time === 100) {
                p.runCommandAsync(`time set 0`);
                time = 0;
                p.runCommandAsync(`playanimation @s animation.player.sleeping`);
                p.runCommandAsync(`playsound random.levelup @s`);
                p.runCommandAsync("camera @s clear");
                p.runCommandAsync("inputpermission set @s movement enabled");
                p.runCommandAsync("inputpermission set @s camera enabled");
                p.removeTag("interact");
                p.runCommandAsync("gamerule sendcommandfeedback true");
            }
        }
    }
});

function reduceCoalArmorDurability(player, totalDamage) {
    const equip = player.getComponent(EntityEquippableComponent.componentId);
    const armorSlots = ["Head", "Chest", "Legs", "Feet"];
    const coalArmorPieces = armorSlots
    .map(slot => ({ slot, armor: equip.getEquipment(EquipmentSlot[slot]) }))
    .filter(({ armor }) => armor?.typeId.includes(COAL_ARMOR_ID));  
    if (coalArmorPieces.length === 0) return;
    const damagePerPiece = Math.floor(totalDamage / coalArmorPieces.length);
    const leftoverDamage = totalDamage % coalArmorPieces.length;
    coalArmorPieces.forEach(({ slot, armor }, index) => {
        const durabilityComp = armor.getComponent("durability");
        if (!durabilityComp) return;
        durabilityComp.damage += damagePerPiece + (index === 0 ? leftoverDamage : 0);
        if (durabilityComp.damage >= durabilityComp.maxDurability) {
            player.playSound("random.break", { pitch: 1, location: player.location, volume: 1 });
            equip.setEquipment(slot, new ItemStack("minecraft:air", 1));
        } else {
            equip.setEquipment(slot, armor);
        }
    });
}