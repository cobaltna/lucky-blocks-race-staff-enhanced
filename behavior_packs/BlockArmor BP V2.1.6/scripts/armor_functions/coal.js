import { system, world, EntityEquippableComponent, EquipmentSlot, ItemStack } from "@minecraft/server";
const COAL_ARMOR_ID = "bls:coal_";
const COOLDOWN_TIME = 10000;
const playerCooldowns = {}; 
const rawMeats = {
    "minecraft:beef": "minecraft:cooked_beef",
    "minecraft:chicken": "minecraft:cooked_chicken",
    "minecraft:mutton": "minecraft:cooked_mutton",
    "minecraft:porkchop": "minecraft:cooked_porkchop",
    "minecraft:rabbit": "minecraft:cooked_rabbit",
    "minecraft:salmon": "minecraft:cooked_salmon",
    "minecraft:cod": "minecraft:cooked_cod"
};
//Si el w tiene armadura de carbon bv
function hasCoalArmor(player) {
    const equip = player.getComponent(EntityEquippableComponent.componentId);
    return ["Head", "Chest", "Legs", "Feet"].every(slot =>
        equip.getEquipment(EquipmentSlot[slot])?.typeId.includes(COAL_ARMOR_ID)
        );
}

system.runInterval(()=>{
    for(let p of world.getPlayers()){
        if (hasCoalArmor(p)){
            p.onScreenDisplay.setActionBar({translate: "action.coal_armor.warn"})
        }
    }
})


function cookMeat(player, item) {

    const cookedItemId = rawMeats[item.typeId];
    if (cookedItemId) {
        player.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${cookedItemId} 1`);
        return 1; 
    }
    return 0;
}
//Reducir durabilidad xd
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
//Checar cooldown xd
function checkCooldown(player) {
    const currentTime = Date.now();
    const playerId = `${player.name}`; // Usa el nombre del jugador como identificador
    const lastCookTime = playerCooldowns[playerId] || 0; 
    if (currentTime - lastCookTime < COOLDOWN_TIME) {
        player.sendMessage({translate: "action.cook_cooldown"});
        return false; 
    }
    playerCooldowns[playerId] = currentTime;
    return true;
}
world.beforeEvents.itemUse.subscribe(event => {
    const player = event.source;
    const item = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
    //Item debe ser carne cruda de rawMeats
    if(player.isSneaking && item && rawMeats[item.typeId]) {
        if (hasCoalArmor(player) && item && item.amount > 0 && item.amount < 2) {
            if (checkCooldown(player)) {
                // Si no está en cooldown, cocinamos la carne y aplicamos el desgaste
                const totalCooked = cookMeat(player, item);
                if (totalCooked > 0) {
                    system.run(() => reduceCoalArmorDurability(player, totalCooked));
                }
            }
        }
        if (hasCoalArmor(player) && item && item.amount > 1) {
         player.sendMessage({translate: "action.cook_amount"})
     }
 }
});
